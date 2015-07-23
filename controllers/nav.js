'use strict';

angular.module('angularJoinDemo')

.controller('NavCtrl', ['$scope', '$rootScope', 'Routes',
function($scope, $rootScope, Routes) {
  $scope.collapsed = true;
  $scope.routes = Routes;

  $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
    $scope.currPath = current.path;
  });
}]);
