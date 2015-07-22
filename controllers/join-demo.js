angular.module('angularJoinDemo')

.controller('JoinDemoCtrl', ['$scope', 'Join', function($scope, Join) {
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

  ];

  var indentRegex = /^ */;
  function toSource(fcn, indent) {
    var fcnSource = fcn.toString();

    // Find the shortest indent after the 1st line (1st line is unindented)
    var shortest = fcnSource
      .split(/\n/)
      .slice(1)
      .reduce(function(prev, line) {
        var thisIndent = indentRegex.exec(line)[0];
        if (!prev || thisIndent.length < prev.length) {
          return thisIndent;
        } else {
          return prev;
        }
      }, null);

    // Replace the shortest indent with the provided indent
    if (shortest) {
      var shortestRegex = RegExp('^' + shortest, 'mg');
      return fcnSource.replace(shortestRegex, indent);
    } else {
      return fcnSource;
    }
  }

  function buildDemoCode(demo, type) {
    var indent = '  ';
    var fcnNameString;
    var compareFcnString;
    if (type === 'hash') {
      fcnNameString = 'Join.hashJoin';
      compareFcnString = toSource(demo.hash, indent);
    } else {
      fcnNameString = 'Join.mergeJoin';
      compareFcnString = toSource(demo.compare, indent);
    }

    var joinFcnString = toSource(demo.join, indent);

    return 'var joined = ' + fcnNameString + '(\n' +
           '  left,\n' +
           '  right,\n' +
           '  ' + compareFcnString + ',\n' +
           '  ' + joinFcnString + '\n' +
           ');';
  }

  $scope.demos.forEach(function(demo) {
    demo.showing = 'table';

    demo.results = {
      merge: Join.mergeJoin(demo.left, demo.right, demo.compare, demo.join),
      hash: Join.hashJoin(demo.left, demo.right, demo.hash, demo.join)
    };

    demo.code = {
      merge: buildDemoCode(demo, 'merge'),
      hash: buildDemoCode(demo, 'hash')
    };
  });
}]);
