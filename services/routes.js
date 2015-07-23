'use strict';

angular.module('angularJoinDemo')

.constant('Routes',
  [
    {
      path: '/',
      title: 'Getting Started',
      templateUrl: 'partials/intro.html',
      controller: 'IntroCtrl'
    },
    {
      path: '/join',
      title: 'Join Demo',
      templateUrl: 'partials/join.html',
      controller: 'JoinDemoCtrl'
    }
  ]
);
