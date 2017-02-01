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
      '<input type="text" ng-transclude class="rome-input"></div>',
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
      let config = merge(temp_config, {
        time: stringToBool(attrs.romeTime),
        date: stringToBool(attrs.romeDate),
        initialValue: attrs.romeInitialValue || moment().millisecond(0).second(0).minute(0).hour(0),
        autoHideOnBlur: true,
        weekStart: attrs.romeWeekStart,
        monthsInCalendar: attrs.romeMonthsInCalendar,
        min: attrs.romeMin,
        max: attrs.romeMax,
        inputFormat: attrs.romeInputFormat,
        timeInterval: attrs.romeTimeInterval
      }, scope.options);

      /**
       * Initialize Rome with the merged config from above.
       */
      romeInstance = rome(input[0], config);

      scope.options.getApi = function() {
        return romeInstance;
      };

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

      function formatDate() {
        scope.ngModel = romeInstance.getDateString(attrs.viewFormat || romeDefaults.labelValue);
      }

      romeInstance.on('ready', function() {
        scope.$apply(function () {
          romeInstance.setValue(scope.ngModel);
          formatDate();
        });
      });

      romeInstance.on('data', function (value) {
        scope.$apply(function () {
          formatDate();
        });
      });

      scope.$watch('ngModel', function(value) {
        if (value) {
          romeInstance.setValue(value);
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
