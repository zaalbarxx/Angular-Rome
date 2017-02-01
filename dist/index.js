"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var angular=_interopDefault(require("angular")),rome=_interopDefault(require("rome")),moment=_interopDefault(require("moment")),merge=_interopDefault(require("lodash.merge")),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},romeModule=angular.module("rome",[]);romeModule.provider("romeDefaults",function(){return{options:{},$get:function(){return this.options},set:function(e){this.options=e}}}),romeModule.directive("rome",["romeDefaults","$interval",function(e,t){function n(e){return!e||"true"==e}function o(e){return"object"===("undefined"==typeof e?"undefined":_typeof(e))&&null!==e}function r(e,t){var n=e.romeBefore||e.romeBeforeEq||e.romeAfterEq||e.romeAfter;if(n){var o=0===n.indexOf("#"),r=void 0,a=angular.element(document.getElementsByTagName("rome")).find("input");if(o)r=angular.element(document.getElementById(n.substr(1)));else for(var i=0;i<a.length;i++)if(a[i].getAttribute("ng-model")==n){r=angular.element(a[i]);break}if(!r)throw new Error("Cannot find rome instance from that ng-model.");e.romeBefore?t.dateValidator=rome.val.before(r[0]):e.romeBeforeEq?t.dateValidator=rome.val.beforeEq(r[0]):e.romeAfter?t.dateValidator=rome.val.after(r[0]):e.romeAfterEq&&(t.dateValidator=rome.val.afterEq(r[0]))}else t.dateValidator=Function.prototype}return{restrict:"AE",transclude:"attributes",scope:{ngModel:"=",ngChange:"=?",options:"<"},require:"^ngModel",template:'<div class="rome-container"><input type="text" ng-transclude class="rome-input {{options.inputClass}}"></div>',link:function(a,i,l){function u(){a.ngModel=m.getDateString(l.viewFormat||e.labelValue)}var m=void 0,d=i.find("input"),f=merge({},e),s=o(a.options)?a.options:{},c=merge(f,{time:n(s.time),date:n(l.date),initialValue:s.initialValue||moment().millisecond(0).second(0).minute(0).hour(0),autoHideOnBlur:!0,weekStart:l.weekStart,monthsInCalendar:l.monthsInCalendar,min:l.min,max:l.max,inputFormat:l.inputFormat,timeInterval:l.timeInterval},s);m=rome(d[0],c),o(a.options)&&(a.options.getApi=function(){return m}),t(function(){r(l,c)},100,2),angular.forEach({id:l.id,name:l.name,disabled:l.disabled,readonly:l.readonly,required:l.required,novalidate:l.novalidate,"ng-value":l.ngValue,"ng-disabled":l.ngDisabled,"ng-change":l.ngChange,"ng-model":l.ngModel},function(e,t){angular.isDefined(e)&&(i.removeAttr(t),d.attr(t,e))}),m.on("ready",function(){a.$apply(function(){m.setValue(a.ngModel),u()})}),m.on("data",function(e){a.$apply(function(){u()})}),a.$watch("ngModel",function(e){e&&m.setValue(e)},!0),l.$observe("config",function(e){m.config(e)})}}}]);var moduleName=romeModule.name;module.exports=moduleName;
