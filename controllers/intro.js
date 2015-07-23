'use strict';

angular.module('angularJoinDemo')

.controller('IntroCtrl', ['$scope', function($scope) {
  // Necessary because I can't have the </script> below in a text/ng-template
  $scope.setup1 = '<script src="path/to/angular-join.js"></script>';
}]);
