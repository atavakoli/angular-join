'use strict';

angular.module('myApp')

.controller('MyCtrl', ['$scope', 'Join', 'DataSvc', 'Yield',
function($scope, Join, DataSvc, Yield) {
  $scope.modes = {
    simple: {
      compare: function(d1, d2) {
        return (d1.i - d2.i);
      },
      hash: function(d) {
        return d.i;
      },
      join: function(d1, d2) {
        if (d1 !== null && d2 !== null) {
          // inner join
          return {
            i: d1.i,
            cats: d1.cats,
            catsDa: d2.catsDa
          };
        } else if (d1 !== null) {
          // left join
          return {
            i: d1.i,
            cats: d1.cats,
            catsDa: 0
          };
        } else if (d2 !== null) {
          // right join
          return {
            i: d2.i,
            cats: 0,
            catsDa: d2.catsDa
          };
        }
      },
      data: DataSvc.makeSimpleData
    },
    complex: {
      compare: function(d1, d2) {
        var diff = d1.ts - d2.ts; // d1.date.diff(d2.date);
        if (diff !== 0) {
          return diff;
        } else {
          return d1.person.localeCompare(d2.person);
        }
      },
      hash: function(d) {
        return d.ts + '|' + d.person;
      },
      join: function(d1, d2) {
        if (d1 !== null && d2 !== null) {
          // inner join
          return {
            date: d1.date,
            ts: d1.ts,
            person: d1.person,
            cats: d1.cats,
            catsDa: d2.catsDa
          };
        } else if (d1 !== null) {
          // left join
          return {
            date: d1.date,
            ts: d1.ts,
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
      data: DataSvc.makeComplexData
    }
  }

  $scope.size = 100;
  $scope.mode = $scope.modes['simple'];

  $scope.chart = {
    data: {
      type: 'line',
      x: 'size',
      rows: [
        ['size', 'mergeJoin', 'mergeJoin (pre-sorted)', 'hashJoin']
      ]
    },
    axis: {
      y: {label: 'rows/s'},
      x: {tick: {format: function(d) { return Math.pow(10, d).toFixed(2); }}}
    }
  };

  function log10(x) {
    return (Math.log(x) / Math.LN10);
  }
  
  $scope.runTest = function(modeKey) {
    $scope.lastMode = modeKey;
    $scope.chart.data.rows.push($scope.runSingleTest(modeKey, $scope.size));
  }

  $scope.runFullTest = function(modeKey) {
    $scope.lastMode = modeKey;
    var sizes = [];
    [100, 1000, 10000, 100000].forEach(function(start) {
      for (var i = start; i < start * 10; i += start) {
        sizes.push(i);
      }
    });
    sizes.push(1000000);
    Yield.forEach(sizes, function(size) {
      $scope.chart.data.rows.push([
        $scope.runSingleTest(modeKey, size),
        $scope.runSingleTest(modeKey, size),
      ].reduce(function(memo, curr) {
        if (!memo.length) {
          return curr;
        } else {
          return [
            memo[0],
            (memo[1] + curr[1]) / 2,
            (memo[2] + curr[2]) / 2,
            (memo[3] + curr[3]) / 2
          ];
        }
      }, []));
    }, 1, 400);
  }

  $scope.runSingleTest = function(modeKey, size) {
    $scope.mode = $scope.modes[modeKey];

    var t0 = performance.now();
    $scope.data1 = $scope.mode.data(0, size, 'cats', 8, 8);
    $scope.data2 = $scope.mode.data(0, size, 'catsDa', 1, 8);
    $scope.dataBuildTime = performance.now() - t0;

    t0 = performance.now();
    $scope.data1.sort($scope.mode.compare);
    $scope.data2.sort($scope.mode.compare);
    $scope.sortTime = performance.now() - t0;

    t0 = performance.now();
    $scope.data3 = Join.mergeJoin($scope.data1, $scope.data2,
                                  $scope.mode.compare, $scope.mode.join,
                                  {sorted: true});
    $scope.mergeTime = performance.now() - t0;
  
    t0 = performance.now();
    $scope.data4 = Join.hashJoin($scope.data1, $scope.data2,
                                 $scope.mode.hash, $scope.mode.join);
    $scope.hashTime = performance.now() - t0;

    // $scope.data4.sort($scope.mode.compare);

    return([
      log10(size),
      Math.floor(1000 * size / ($scope.sortTime + $scope.mergeTime)),
      Math.floor(1000 * size / $scope.mergeTime),
      Math.floor(1000 * size / $scope.hashTime)
    ]);
  }

  $scope.getClass = function(d1, data, field) {
    var mode = $scope.modes[$scope.lastMode];
    var result = data.some(function(d2) {
      return (mode.compare(d1, d2) === 0 && d1[field] === d2[field]);
    }) ||
    data.every(function(d2) {
      return mode.compare(d1, d2) !== 0;
    }) && d1[field] === 0;

    if (result) {
      return 'success';
    } else {
      return 'danger';
    }
  };
}]);
