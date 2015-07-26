angular.module('angularJoinDemo')


.controller('FluentDemoCtrl', ['$scope', 'Formatter', 'Join',
function($scope, Formatter, Join) {
  $scope.demos = [
    {
      name: 'Complex Query (Synchronous)',
      left: [
        { x:1, y:1 },
        { x:2, y:2 },
        { x:3, y:3 },
        { x:4, y:4 }
      ],
      right: [
        { x:1, y:4 },
        { x:1, y:5 },
        { x:1, y:6 },
        { x:2, y:5 },
        { x:2, y:6 },
        { x:3, y:7 },
        { x:4, y:1 }
      ],
      steps: [],
      sqlfiddleLink: 'http://sqlfiddle.com/#!9/2511e/2/0',
      query: function(left, right) {
        this.steps = [];

        var steps = this.steps;
        function snapshot(title) {
          return function(step) {
            steps.push({ title: title, result: step });
          }
        }

        //EXCLUDE:^ *\.inspect.*$
        //START
        return Join
          .selectFrom(left)
          .inspect(snapshot('SELECT ... FROM L'))
          .hashJoin(right, 'x', function(L, R) {
            if (L && R) {
              return { x:L.x, 'L.y':L.y, 'R.y':R.y };
            }
          })
          .inspect(snapshot('... INNER JOIN R USING (x)'))
          .where(function(e) { return e['L.y'] < 4; })
          .inspect(snapshot('... WHERE L.y < 4'))
          .hashGroupBy('L.y', function(prev, e) {
            if (!prev) {
              return { 'L.y':e['L.y'], 'SUM(R.y)':e['R.y'] };
            } else {
              prev['SUM(R.y)'] += e['R.y'];
              return prev;
            }
          })
          .inspect(snapshot('... SUM(R.y) ... GROUP BY L.y'))
          .having(function(e) { return e['SUM(R.y)'] > 10; })
          .inspect(snapshot('... HAVING SUM(R.y) > 10'))
          .orderBy('SUM(R.y)')
          .inspect(snapshot('... ORDER BY SUM(R.y)'))
          .limit(1)
          .inspect(snapshot('... LIMIT 1'))
          .select(function(e) { return { y:e['L.y'], sum:e['SUM(R.y)'] }; })
          .inspect(snapshot("SELECT L.y AS y, SUM(R.y) AS 'sum' ..."))
          .execute();
        //END
      },
      inFields: ['x', 'y'],
      outFields: ['y', 'sum']
    }

  ];

  $scope.updateDemo = function(demo) {
    demo.result = demo.query(demo.left, demo.right);
    demo.code = Formatter.toFilteredSource(demo.query, '');
  }

  $scope.demos.forEach(function(demo) {
    demo.showing = 'table';
    $scope.updateDemo(demo);
  });
}]);
