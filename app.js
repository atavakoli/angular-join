'use strict';

angular.module('angularJoinDemo',
  ['ngRoute', 'ui.bootstrap', 'hljs', 'headroom', 'angular-join'])

.config(['$routeProvider', '$locationProvider', 'Routes',
function($routeProvider, $locationProvider, Routes) {
  Routes.reduce(function(curr, prev) {
    return curr.when(prev.path, prev);
  }, $routeProvider)

  $routeProvider.otherwise(Routes[0].path);
}]);
