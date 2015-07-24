angular.module('angularJoinDemo')

.controller('JoinDemoCtrl', ['$scope', 'Formatter', 'Join',
function($scope, Formatter, Join) {
  $scope.demos = [
    {
      name: 'Inner Join',
      left: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      right: [
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
        if (e1 && e2) {
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
      name: 'Inner Join with Duplicates',
      left: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3.1 },
        { x: 3, y: 3.2 },
        { x: 4, y: 4 }
      ],
      right: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3.3 },
        { x: 3, y: 3.4 },
        { x: 5, y: 5 }
      ],
      compare: function(e1, e2) {
        return e1.x - e2.x;
      },
      hash: function(e) {
        return e.x;
      },
      join: function(e1, e2) {
        if (e1 && e2) {
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
      left: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      right: [
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
        if (e1 && e2) {
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
      left: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      right: [
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
        if (e1 && e2) {
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
      left: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      right: [
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
        if (e1 && e2) {
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
      name: 'Cartesian/Cross Join',
      left: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 }
      ],
      right: [
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
        if (e1 && e2) {
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

    {
      name: 'Left Anti-Join',
      left: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      right: [
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
        if (e1 && !e2) {
          return e1;
        } else {
          return null;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'y']
    },

    {
      name: 'Right Anti-Join',
      left: [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 }
      ],
      right: [
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
        if (e2 && !e1) {
          return e2;
        } else {
          return null;
        }
      },
      inFields: ['x', 'y'],
      outFields: ['x', 'y']
    },

  ];

  $scope.updateDemo = function(demo) {
    demo.results = {
      merge: Join.mergeJoin(demo.left, demo.right, demo.compare, demo.join),
      hash: Join.hashJoin(demo.left, demo.right, demo.hash, demo.join)
    };

    demo.code = {
      merge: Formatter.fcnCall(
        'joined', 'Join.mergeJoin', ['left', 'right', demo.compare, demo.join]
      ),
      hash: Formatter.fcnCall(
        'joined', 'Join.hashJoin', ['left', 'right', demo.hash, demo.join]
      )
    };
  }

  $scope.demos.forEach(function(demo) {
    demo.showing = 'table';
    $scope.updateDemo(demo);
  });
}]);
