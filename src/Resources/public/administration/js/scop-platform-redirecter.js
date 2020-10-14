(this.webpackJsonp=this.webpackJsonp||[]).push([["scop-platform-redirecter"],{"0LYW":function(t,e){t.exports='{% block scop_platform_redirect_list %}\r\n\t<sw-page class="scop-platform-redirect-list">\r\n\t\t<template slot="smart-bar-actions">\r\n\t\t\t{% block scop_platform_redirect_list_smarbar %}\r\n\t\t\t\t<sw-button variant="primary" :routerLink="{name: \'scop.platform.redirect.create\'}">\r\n\t\t\t\t\t{{ $t(\'scopplatformredirecter.list.createButton\') }}\r\n\t\t\t\t</sw-button>\r\n\t\t\t{% endblock %}\r\n\t\t</template>\r\n\t\t<template slot="content">\r\n\t\t\t{% block scop_platform_redirect_list_content %}\r\n\t\t\t\t<sw-entity-listing\r\n\t\t\t\t\tv-if="redirect"\r\n\t\t\t\t\t:items="redirect"\r\n\t\t\t\t\t:repository="repository"\r\n\t\t\t\t\t:columns="columns" \r\n\t\t\t\t\tdetailRoute="scop.platform.redirect.details">\r\n\t\t\t\t</sw-entity-listing>\r\n\t\t\t{% endblock %}\r\n\t\t</template>\r\n\t</sw-page>\r\n{% endblock %}'},"20ze":function(t){t.exports=JSON.parse('{"scopplatformredirecter":{"general":{"title":"Redirects","mainMenuItem":"Redirects"},"list":{"columnSourceUrl":"Source URL","columnTargetUrl":"Target URL","columnHttpCode":"Http Code","createButton":"Add Redirect"},"detail":{"sourceUrlLabel":"Source URL","targetUrlLabel":"Target URL","httpCodeLabel":"Http Code","cancelButton":"Cancel","saveButton":"Save","errorTitle":"Error","httpCodeLabelValues":{"301":"301 (Moved Permanently)","302":"302 (Found / Moved Temporarily)"}}}}')},"97qz":function(t,e){t.exports='{% block scop_platform_redirect_details %}\r\n<sw-page class="scop-platform-redirect-details">\r\n<template slot="smart-bar-actions">\r\n\t<sw-button :routerLink="{name: \'scop.platform.redirect.list\'}">\r\n\t{{ $t(\'scopplatformredirecter.detail.cancelButton\') }}</sw-button>\r\n\t<sw-button-process :isLoading="isLoading"\r\n\t\t:processSuccess="processSuccess" variant="primary"\r\n\t\t@process-finish="saveFinish" @click="onClickSave">\r\n\t{{ $t(\'scopplatformredirecter.detail.saveButton\') }}</sw-button-process>\r\n</template>\r\n<template slot="content">\r\n\t<sw-card-view>\r\n\t\t<sw-card v-if="redirect" :isLoading="isLoading">\r\n\t\t\t<sw-field :label="$t(\'scopplatformredirecter.detail.sourceUrlLabel\')" v-model="redirect.sourceURL" validation="required"></sw-field>\r\n\t\t\t<sw-field :label="$t(\'scopplatformredirecter.detail.targetUrlLabel\')" v-model="redirect.targetURL" validation="required"></sw-field>\r\n\t\t\t<sw-select-number-field :label="$t(\'scopplatformredirecter.detail.httpCodeLabel\')" v-model="redirect.httpCode" validation="required">\r\n\t\t\t\t<option value=301>{{ $t(\'scopplatformredirecter.detail.httpCodeLabelValues.301\') }}</option>\r\n\t\t\t\t<option value=302>{{ $t(\'scopplatformredirecter.detail.httpCodeLabelValues.302\') }}</option>\r\n\t\t\t</sw-select-number-field>\r\n\t\t</sw-card>\r\n\t</sw-card-view>\r\n</template>\r\n</sw-page>\r\n{% endblock %}'},VqAp:function(t,e){Shopware.Component.extend("scop-platform-redirect-create","scop-platform-redirect-details",{methods:{getRedirect(){this.redirect=this.repository.create(Shopware.Context.api),this.redirect.httpCode=302},onClickSave(){this.isLoading=!0,this.repository.save(this.redirect,Shopware.Context.api).then(()=>{this.isLoading=!1,this.$router.push({name:"scop.platform.redirect.details",params:{id:this.redirect.id}})}).catch(t=>{this.isLoading=!1,this.createNotificationError({title:this.$tc("scopplatformredirecter.detail.errorTitle"),message:t})})}}})},aBtA:function(t){t.exports=JSON.parse('{"scopplatformredirecter":{"general":{"title":"Weiterleitungen","mainMenuItem":"Weiterleitungen"},"list":{"columnSourceUrl":"Quell URL","columnTargetUrl":"Ziel URL","columnHttpCode":"Http Code","createButton":"Weiterleitung anlegen"},"detail":{"sourceUrlLabel":"Quell URL","targetUrlLabel":"Ziel URL","httpCodeLabel":"Http Code","cancelButton":"Abbrechen","saveButton":"Speichern","errorTitle":"Fehler","httpCodeLabelValues":{"301":"301 (Permanent verschoben)","302":"302 (Gefunden / Temporär verschoben)"}}}}')},"tTi+":function(t,e,r){"use strict";r.r(e);var o=r("0LYW"),i=r.n(o);const a=Shopware.Data.Criteria;Shopware.Component.register("scop-platform-redirect-list",{template:i.a,inject:["repositoryFactory"],data:()=>({repository:null,redirect:null}),metaInfo(){return{title:this.$createTitle()}},computed:{columns(){return[{property:"sourceURL",dataIndex:"sourceURL",label:this.$tc("scopplatformredirecter.list.columnSourceUrl"),routerLink:"scop.platform.redirect.details",inlineEdit:"string",allowResize:!0,primary:!0},{property:"targetURL",dataIndex:"targetURL",label:this.$tc("scopplatformredirecter.list.columnTargetUrl"),inlineEdit:"string",allowResize:!0},{property:"httpCode",dataIndex:"httpCode",label:this.$tc("scopplatformredirecter.list.columnHttpCode"),allowResize:!0}]}},created(){this.repository=this.repositoryFactory.create("scop_platform_redirecter_redirect"),this.repository.search(new a,Shopware.Context.api).then(t=>{this.redirect=t})}});var s=r("97qz"),l=r.n(s);const{Component:c,Mixin:n}=Shopware;c.register("scop-platform-redirect-details",{template:l.a,inject:["repositoryFactory"],mixins:[n.getByName("notification")],metaInfo(){return{title:this.$createTitle()}},data:()=>({redirect:null,isLoading:!1,processSuccess:!1,repository:null}),created(){this.repository=this.repositoryFactory.create("scop_platform_redirecter_redirect"),this.getRedirect()},methods:{getRedirect(){this.repository.get(this.$route.params.id,Shopware.Context.api).then(t=>{this.redirect=t})},onClickSave(){this.isLoading=!0,this.repository.save(this.redirect,Shopware.Context.api).then(()=>{this.getRedirect(),this.isLoading=!1,this.processSuccess=!0}).catch(t=>{this.isLoading=!1,this.createNotificationError({title:this.$tc("scopplatformredirecter.detail.errorTitle"),message:t})})},saveFinish(){this.processSuccess=!1}}});r("VqAp");var p=r("aBtA"),d=r("20ze");Shopware.Module.register("scop-platform-redirect",{type:"plugin",name:"scop-platform-redirect",title:"scopplatformredirecter.general.title",description:"XXX",color:"#2288FF",icon:"small-arrow-large-double-right",routes:{list:{component:"scop-platform-redirect-list",path:"list"},details:{component:"scop-platform-redirect-details",path:"details"},create:{component:"scop-platform-redirect-create",path:"create"}},navigation:[{label:"scopplatformredirecter.general.mainMenuItem",color:"#2288FF",path:"scop.platform.redirect.list",icon:"small-arrow-large-double-right",position:100}],snippets:{"de-DE":p,"en-GB":d}})}},[["tTi+","runtime"]]]);