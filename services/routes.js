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
      path: '/usage',
      title: 'Usage',
      templateUrl: 'partials/usage.html',
      controller: 'UsageCtrl'
    },
    {
      path: '/join',
      title: 'Join Demo',
      templateUrl: 'partials/join.html',
      controller: 'JoinDemoCtrl'
    },
    {
      path: '/groupby',
      title: 'Group By Demo',
      templateUrl: 'partials/groupby.html',
      controller: 'GroupByDemoCtrl'
    }
  ]
);
