<?php declare(strict_types=1);

namespace Scop\PlatformRedirecter\Subscriber;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsAnyFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Event\BeforeSendRedirectResponseEvent;
use Shopware\Core\Framework\Event\BeforeSendResponseEvent;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

class RequestSubscriber extends AbstractController implements EventSubscriberInterface
{
    /**
     * @var EntityRepositoryInterface
     */
    private $repository;
    /**
     * @var EntityRepositoryInterface
     */
    private $seoUrlRepository;

    /**
     * @param EntityRepositoryInterface $redirectRepository
     */
    public function __construct(EntityRepositoryInterface $redirectRepository, EntityRepositoryInterface $seoUrlRepository)
    {
        /** @var EntityRepositoryInterface $repository */
        $this->repository = $redirectRepository;
        $this->seoUrlRepository = $seoUrlRepository;
    }

    /**
     *
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            BeforeSendResponseEvent::class => 'redirectBeforeSendResponse',
            BeforeSendRedirectResponseEvent::class => 'redirectBeforeSendResponse'
        ];
    }

    /**
     * Redirect to the new url if found in redirects
     * Otherwise do nothing
     * Modules like admin, api or widgets are excluded from redirects
     *
     * @param BeforeSendResponseEvent $event
     */
    public function redirectBeforeSendResponse(BeforeSendResponseEvent $event): void
    {
        $requestUri = (string)$event->getRequest()->get("sw-original-request-uri");

        $storefrontUri = $event->getRequest()->get('sw-sales-channel-absolute-base-url');
        $requestBase = $event->getRequest()->getPathInfo();
        $requestBaseUrl = $event->getRequest()->getBaseUrl();

        // Block overriding /admin and /api and widgets, so you can't lock out of the administration.
        if (\strpos($requestBase, "/admin") === 0) {
            return;
        }
        if (\strpos($requestBase, "/api") === 0) {
            return;
        }
        if (\strpos($requestBase, "/widgets") === 0) {
            return;
        }
        if (\strpos($requestBase, "/store-api") === 0) {
            return;
        }
        if (\strpos($requestBase, "/_profiler") === 0) {
            return;
        }

        $context = Context::createDefaultContext();

        $search = [
            $requestBaseUrl . '/' . $requestUri, // relative url with shopware 6 in sub folder: /public/Ergonomic-Concrete-Cough-Machine/48314803f1244f609a2ce907bfb48f53
            $requestBaseUrl . $requestUri, // relative url with shopware 6 in sub folder url is not shopware seo url: /public/test
            $storefrontUri . $requestUri, // absolute url with shopware 6 in sub folder, full url with host: http://shopware-platform.local/public/test1
            $storefrontUri . '/' . $requestUri, // absolute url with shopware 6 in sub folder, full url with host and slash at the end: http://shopware-platform.local/public/Freizeit-Elektro/Telefone/
            $requestUri, // relative url domain configured in public folder: /Ergonomic-Concrete-Cough-Machine/48314803f1244f609a2ce907bfb48f53 or /test4
            '/' . $requestUri, // absolute url domain configured in public folder: http://shopware-platform.local/Shoes-Baby/
            \substr($requestUri, 1), // e.g. "test"
        ];

        // search for the redirect in the database
        $redirects = $this->repository->search((new Criteria())->addFilter(new EqualsAnyFilter('sourceURL', $search))->addFilter(new EqualsFilter('enabled', true))->setLimit(1), $context);
        $redirectsUrl = $this->repository->search((new Criteria())->addFilter(new EqualsAnyFilter('sourceURL', $search))->setLimit(1), $context);
        $redirectsSeoUrl = $this->seoUrlRepository->search((new Criteria())->addFilter(new EqualsAnyFilter('seoPathInfo', $search))->setLimit(1), $context);
        
        //No Redirect or Seo Url found, create it
        if ($redirectsUrl->count() === 0) {
            if ($redirectsSeoUrl->count() === 0){
                $this->repository->create([['sourceURL' => "$storefrontUri$requestUri", 'targetURL' => "$storefrontUri", 'httpCode' => 302, 'enabled' => false]], $context);
                return;
            }
        }
        
        // No Redirect found for this URL, do nothing
        if ($redirects->count() === 0) {
            return;
        }

        $redirect = $redirects->first();
        $targetURL = $redirect->getTargetURL();
        $code = $redirect->getHttpCode();
        
        // Prevent endless redirecting when target url and source url have only different capitalisation
        if (in_array($targetURL, $search, true)) {
            return;
        }

        /*
         *  checks if $targetURL is a full url or path and redirects accordingly
         */
        if (!(\strpos($targetURL, "http:") === 0 || \strpos($targetURL, "https:") === 0)) {
            if (\strpos($targetURL, "www.") === 0) {
                $targetURL = "http://" . $targetURL;
            } else {
                if (\strpos($targetURL, "/") !== 0) {
                    $targetURL = "/" . $targetURL;
                }
            }
        }
        $event->setResponse(new RedirectResponse($targetURL, $code));
    }
}
