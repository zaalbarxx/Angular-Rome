import angular from 'angular';
import rome from 'rome';
import moment from 'moment';
import merge from 'lodash.merge';

let romeModule = angular.module('rome', []);

romeModule.provider('romeDefaults', function romeDefaultsProvider() {
  return {
    options: {},
    $get: function() {
      return this.options;
    },
    set: function(obj) {
      this.options = obj;
    }
  }
});

romeModule.directive('rome', ['romeDefaults', '$interval', function romeDirective(romeDefaults, $interval) {
  "use strict";

  function stringToBool(str) {
    return (str) ? ((str == 'true') ? true : false) : true
  }

  function isObject(object) {
    return typeof object === 'object' && object !== null
  }
  /**
   * Validation
   * Pass rome-* a the ng-model of a rome element
   */
  function rangeValidation(attrs, config) {
    let romeValidator = attrs.romeBefore || attrs.romeBeforeEq || attrs.romeAfterEq || attrs.romeAfter;
    if (romeValidator) {
      let has_id = romeValidator.indexOf('#') === 0;
      let matched_element;
      let search_attr;
      let rome_elements = angular.element(document.getElementsByTagName('rome')).find('input');
      let search_element;
      if (has_id) {
        matched_element = angular.element(document.getElementById(romeValidator.substr(1)));
      } else {
        for (let i = 0; i < rome_elements.length; i++) {
          if (rome_elements[i].getAttribute('ng-model') == romeValidator) {
            matched_element = angular.element(rome_elements[i]);
            break;
          }
        }
      }

      if (matched_element) {
        if (attrs.romeBefore) {
          config.dateValidator = rome.val.before(matched_element[0]);
        } else if (attrs.romeBeforeEq) {
          config.dateValidator = rome.val.beforeEq(matched_element[0]);
        } else if (attrs.romeAfter) {
          config.dateValidator = rome.val.after(matched_element[0]);
        } else if (attrs.romeAfterEq) {
          config.dateValidator = rome.val.afterEq(matched_element[0]);
        }
      } else {
        throw new Error('Cannot find rome instance from that ng-model.');
      }
    } else {
      config.dateValidator = Function.prototype;
    }
  }

  return {
    restrict: 'AE',
    transclude: 'attributes',
    scope: {
      ngModel: '=',
      ngChange: '=?',
      options: '<',
    },
    require: '^ngModel',
    template: '<div class="rome-container">' +
      '<input type="text" ng-transclude class="rome-input {{options.inputClass}}"></div>',
    link: function (scope, el, attrs) {
      let romeInstance;
      let input = el.find('input');
      /**
       * Rome Config
       *
       * Merges with romeDefaultsProvider value, which then merges with the rome default values.
       * Merge romeDefaults with an object to avoid romeDefaults being modified in the merge.
       */
      let temp_config = merge({}, romeDefaults);
      let options = isObject(scope.options) ? scope.options : {};

      let config = merge(temp_config, {
        time: stringToBool(options.time),
        date: stringToBool(attrs.date),
        initialValue: scope.ngModel || moment().millisecond(0).second(0).minute(0).hour(0),
        autoHideOnBlur: true,
        weekStart: attrs.weekStart,
        monthsInCalendar: attrs.monthsInCalendar,
        min: attrs.min,
        max: attrs.max,
        inputFormat: attrs.inputFormat,
        timeInterval: attrs.timeInterval
      }, options);

      /**
       * Initialize Rome with the merged config from above.
       */
      romeInstance = rome(input[0], config);

      if(isObject(scope.options)) {
        scope.options.getApi = function() {
          return romeInstance;
        };
      }


      // Hack to ensure all other rome directives are loaded so range validation will find a matching element.
      $interval(function () {
        rangeValidation(attrs, config);
      }, 100, 2);

      /**
       * Input Attributes
       * Hat tip to Ionic for this idea.
       */
      angular.forEach({
        'id': attrs.id,
        'name': attrs.name,
        'disabled': attrs.disabled,
        'readonly': attrs.readonly,
        'required': attrs.required,
        'novalidate': attrs.novalidate,
        'ng-value': attrs.ngValue,
        'ng-disabled': attrs.ngDisabled,
        'ng-change': attrs.ngChange,
        'ng-model': attrs.ngModel
      }, function (value, name) {
        if (angular.isDefined(value)) {
          el.removeAttr(name);
          input.attr(name, value);
        }
      });

      function getFormattedDate() {
        return romeInstance.getDateString(attrs.viewFormat || romeDefaults.labelValue);
      }

      romeInstance.on('ready', function() {
        scope.$apply(function () {
          romeInstance.setValue(scope.ngModel);
          scope.ngModel = getFormattedDate();
        });
      });

      romeInstance.on('data', function (value) {
        scope.$apply(function () {
          scope.ngModel = getFormattedDate();
        });
      });

      scope.$watch('ngModel', function(value) {
        if (value) {
          romeInstance.setValue(value);
          input[0].value = getFormattedDate();
        }
      }, true);

      attrs.$observe('config', function(newConfig) {
        romeInstance.config(newConfig);
      })
    }
  };
}]);

const moduleName = romeModule.name;
export default moduleName;
