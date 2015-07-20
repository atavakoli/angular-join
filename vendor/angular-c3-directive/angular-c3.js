(function() {
'use strict';

angular.module('c3', [])

.directive('c3', function() {
  console.log('loading directive');
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      var chart;
      var unwatchFcn = scope.$watch(attrs.c3, function(value) {
        if (value) {
          var config = angular.extend({}, value, { bindto: elem[0] });
          chart = c3.generate(config);
        } else {
          if (chart && typeof chart.destroy === 'function') {
            chart = chart.destroy();
          }
        }
      }, true);
      
      elem.on('$destroy', function() {
        if (chart && typeof chart.destroy === 'function') {
          chart = chart.destroy();
        }
      });
      
      scope.$on('$destroy', function() {
        if (chart && typeof chart.destroy === 'function') {
          chart = chart.destroy();
        }
      });
    }
  };
});

}());
