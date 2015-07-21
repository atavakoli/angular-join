angular.module('angularJoinDemo')

.controller('JoinDemoCtrl', ['$scope', 'Join', function($scope, Join) {
  $scope.demos = [
    {
      name: 'Inner Join',
      data1: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      data2: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 5, y: 5 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      join: function(e1, e2) {
        if (!!e1 && !!e2) {
          return {
            x: e1.x,
            y1: e1.y,
            y2: e2.y
          };
        } else {
          return null;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'y1', 'y2']
    },

    {
      name: 'Left Outer Join',
      data1: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      data2: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 5, y: 5 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      join: function(e1, e2) {
        if (!!e1 && !!e2) {
          return {
            x: e1.x,
            y1: e1.y,
            y2: e2.y
          };
        } else if (e1) {
          return {
            x: e1.x,
            y1: e1.y,
            y2: null
          };
        } else {
          return null;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'y1', 'y2']
    },

    {
      name: 'Right Outer Join',
      data1: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      data2: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 5, y: 5 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      join: function(e1, e2) {
        if (!!e1 && !!e2) {
          return {
            x: e1.x,
            y1: e1.y,
            y2: e2.y
          };
        } else if (e2) {
          return {
            x: e2.x,
            y1: null,
            y2: e2.y
          };
        } else {
          return null;
        }

      },
      inFields: ['x', 'y'],
      outFields: ['x', 'y1', 'y2']
    },

    {
      name: 'Full Outer Join',
      data1: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      data2: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 5, y: 5 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      join: function(e1, e2) {
        if (!!e1 && !!e2) {
          return {
            x: e1.x,
            y1: e1.y,
            y2: e2.y
          };
        } else if (e1) {
          return {
            x: e1.x,
            y1: e1.y,
            y2: null
          };
        } else {
          return {
            x: e2.x,
            y1: null,
            y2: e2.y
          };
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'y1', 'y2']
    },

    {
      name: 'Cartesian Join',
      data1: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 }
      ],
      data2: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 }
      ],
      compare: function(e1, e2) {
        return 0; //everything is equal
      },
      hash: function(e) {
        return 1; //any value will do
      },
      join: function(e1, e2) {
        if (!!e1 && !!e2) {
          return {
            x1: e1.x,
            x2: e2.x,
            y1: e1.y,
            y2: e2.y
          };
        } else {
          return null;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x1', 'x2', 'y1', 'y2']
    },

  ];

  $scope.demos.forEach(function(demo) {
    demo.results = {
      merge: Join.mergeJoin(demo.data1, demo.data2, demo.compare, demo.join),
      hash: Join.hashJoin(demo.data1, demo.data2, demo.hash, demo.join)
    };
  });
}]);
