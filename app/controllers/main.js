'use strict';

angular.module('myApp')

.controller('MyCtrl', ['$scope', 'Join', 'DataSvc',
function($scope, Join, DataSvc) {
  function dataCompare(d1, d2) {
    var diff = d1.date.diff(d2.date);
    if (diff !== 0) {
      return diff;
    } else {
      return d1.person.localeCompare(d2.person);
    }
  }
  
  function dataHash(d) {
    return d.date.format('YYYY-MM-DD') + '|' + d.person;
  }
  
  $scope.data1 = DataSvc.makeData(100, 'cats', 8, 8);
  $scope.data2 = DataSvc.makeData(100, 'catsDa', 1, 8);
  $scope.data3 = Join.mergeJoin($scope.data1, $scope.data2, dataCompare,
    function(d1, d2) {
      if (d1 !== null && d2 !== null) {
        // inner join
        return {
          date: d1.date,
          person: d1.person,
          cats: d1.cats,
          catsDa: d2.catsDa
        };
      } else if (d1 !== null) {
        // left join
        return {
          date: d1.date,
          person: d1.person,
          cats: d1.cats,
          catsDa: 0
        };
      } else if (d2 !== null) {
        // right join
        return {
          date: d2.date,
          person: d2.person,
          cats: 0,
          catsDa: d2.catsDa
        };
      }
    },
    {sort: true});
  
  $scope.data4 = Join.hashJoin($scope.data1, $scope.data2, dataHash,
    function(d1, d2) {
      if (d1 !== null && d2 !== null) {
        // inner join
        return {
          date: d1.date,
          person: d1.person,
          cats: d1.cats,
          catsDa: d2.catsDa
        };
      } else if (d1 !== null) {
        // left join
        return {
          date: d1.date,
          person: d1.person,
          cats: d1.cats,
          catsDa: 0
        };
      } else if (d2 !== null) {
        // right join
        return {
          date: d2.date,
          person: d2.person,
          cats: 0,
          catsDa: d2.catsDa
        };
      }
    })
    .sort(dataCompare);
  
  $scope.getClass = function(d1, data, field) {
    var result = data.some(function(d2) {
      return (dataCompare(d1, d2) === 0 && d1[field] === d2[field]);
    }) ||
    data.every(function(d2) {
      return dataCompare(d1, d2) !== 0;
    }) && d1[field] === 0;

    if (result) {
      return 'success';
    } else {
      return 'danger';
    }
  };
}]);
