angular.module('angularJoinDemo')

.directive('arrayTable', function() {
  return {
    restrict: 'E',
    scope: {
      fields: '=?',
      data: '=',
      readonly: '=?',
      change: '&onChange'
    },
    templateUrl: 'partials/directives/array-table.html',
    link: function(scope, element, attrs) {
      scope.newRow = {};

      if (!scope.hasOwnProperty('readonly') && attrs.readonly === "") {
        scope.readonly = true;
      }

      if (!scope.fields) {
        if (scope.data.length) {
          scope.fields = Object.keys(scope.data[0]);
        } else {
          scope.fields = [];
        }
      }

      scope.addEnabled = function() {
        return scope.fields.every(function(field) {
          return !!scope.newRow[field] || scope.newRow[field] === 0;
        });
      }

      scope.rm = function(idx) {
        scope.data.splice(idx, 1);
        scope.change();
      }

      scope.add = function() {
        scope.data.push(angular.copy(scope.newRow));
        scope.change();
      }
    }
  };
});
