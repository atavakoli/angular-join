angular.module('angularJoinDemo')

.controller('GroupByDemoCtrl', ['$scope', 'Formatter', 'Join',
function($scope, Formatter, Join) {
  $scope.demos = [
    {
      name: 'Count By X',
      input: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 6 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      group: function(previousValue, e) {
        if (!previousValue) {
          return {
            x: e.x,
            count: 1
          };
        } else {
          previousValue.count++;
          return previousValue;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'count']
    },

    {
      name: 'Sum By X',
      input: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 6 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      group: function(previousValue, e) {
        if (!previousValue) {
          return {
            x: e.x,
            ySum: e.y
          };
        } else {
          previousValue.ySum += e.y || 0;
          return previousValue;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'ySum']
    },

    {
      name: 'Average By X',
      input: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 6 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      group: function(previousValue, e) {
        if (!previousValue) {
          previousValue = {
            x: e.x,
            count: 1,
            ySum: e.y
          };
        } else {
          previousValue.count++;
          previousValue.ySum += e.y || 0;
        }
        previousValue.yAverage = previousValue.ySum / previousValue.count;
        return previousValue;
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'yAverage']
    },

    {
      name: 'Standard Deviation By X',
      input: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
        { x: 2, y: 5 },
        { x: 3, y: 6 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      group: function(prev, e) {
        if (!prev) {
          prev = {
            x: e.x,
            n: 1,
            s1: e.y,
            s2: Math.pow(e.y, 2)
          };
        } else {
          prev.n++;
          prev.s1 += e.y || 0;
          prev.s2 += Math.pow(e.y || 0, 2);
        }
        prev.ySD =
          Math.sqrt(prev.n * prev.s2 - Math.pow(prev.s1, 2))
          / prev.n;
        return prev;
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'ySD']
    },

    {
      name: 'Count By Ranges of X',
      input: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 },
        { x: 10, y: 5 },
        { x: 11, y: 6 },
        { x: 17, y: 6 },
        { x: 20, y: 7 },
        { x: 25, y: 8 }
      ],
      compare: function(e1, e2) {
        return Math.floor(e1.x / 10) * 10 -
               Math.floor(e2.x / 10) * 10;
      },
      hash: function(e) {
        return Math.floor(e.x / 10) * 10;
      },
      group: function(previousValue, e) {
        if (!previousValue) {
          var xStart = Math.floor(e.x / 10) * 10;
          return {
            xStart: xStart,
            xEnd: xStart + 9,
            count: 1
          };
        } else {
          previousValue.count++;
          return previousValue;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['xStart', 'xEnd', 'count']
    },

    {
      name: 'Min/Max By X',
      input: [
        { x: 1, y: 1 },
        { x: 1, y: 3 },
        { x: 1, y: 2 },
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 3, y: 6 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      group: function(previousValue, e) {
        if (!previousValue) {
          previousValue = {
            x: e.x,
            yMin: e.y,
            yMax: e.y
          };
        } else if (e.y < previousValue.yMin) {
          previousValue.yMin = e.y;
        } else if (e.y > previousValue.yMax) {
          previousValue.yMax = e.y;
        }
        return previousValue;
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'yMin', 'yMax']
    },

    {
      name: 'First/Last By X',
      input: [
        { x: 1, y: 1 },
        { x: 1, y: 3 },
        { x: 1, y: 2 },
        { x: 2, y: 5 },
        { x: 2, y: 4 },
        { x: 3, y: 6 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      group: function(previousValue, e) {
        if (!previousValue) {
          return {
            x: e.x,
            yFirst: e.y,
            yLast: e.y
          };
        } else {
          previousValue.yLast = e.y;
          return previousValue;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'yFirst', 'yLast']
    }

  ];

  $scope.demos.forEach(function(demo) {
    demo.showing = 'table';

    demo.results = {
      sort: Join.sortGroupBy(demo.input, demo.compare, demo.group),
      hash: Join.hashGroupBy(demo.input, demo.hash, demo.group)
    };

    demo.code = {
      sort: Formatter.fcnCall(
        'grouped', 'Join.sortGroupBy', ['input', demo.compare, demo.group]
      ),
      hash: Formatter.fcnCall(
        'grouped', 'Join.hashGroupBy', ['input', demo.hash, demo.group]
      )
    };
  });
}]);
