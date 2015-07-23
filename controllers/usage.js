'use strict';

angular.module('angularJoinDemo')

.controller('UsageCtrl', ['$scope', function($scope) {
  var prefix = 'partials/usage/';

  $scope.usages = [
    { title: 'hashJoin',  src: prefix + 'hashjoin.html' },
    { title: 'mergeJoin', src: prefix + 'mergejoin.html' },
    { title: 'hashGroupBy', src: prefix + 'hashgroupby.html' },
    { title: 'sortGroupBy', src: prefix + 'sortgroupby.html' }
  ];
}]);
