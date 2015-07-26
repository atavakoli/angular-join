'use strict';

angular.module('angularJoinDemo')

.controller('UsageCtrl', ['$scope', 'Formatter', function($scope, Formatter) {
  var prefix = 'partials/usage/';

  $scope.usages = [
    { title: 'selectFrom', src: prefix + '/selectfrom.html' },
    { title: 'execute', src: prefix + '/execute.html' },
    { titles: ['select', 'map'], src: prefix + '/select.html' },
    { titles: ['where', 'having', 'filter'], src: prefix + '/where.html' },
    { titles: ['orderBy', 'sort'], src: prefix + '/orderby.html' },
    { titles: ['limit', 'offset'], src: prefix + '/limit.html' },
    { title: 'slice', src: prefix + '/slice.html' },
    { title: 'hashJoin',  src: prefix + '/hashjoin.html' },
    { title: 'mergeJoin', src: prefix + '/mergejoin.html' },
    { title: 'hashGroupBy', src: prefix + '/hashgroupby.html' },
    { title: 'sortGroupBy', src: prefix + '/sortgroupby.html' },
    { title: 'inspect', src: prefix + '/inspect.html' },
  ];

  $scope.examples = [
    {
      js: function(myTable) {
        //START
        // This is just a shallow copy of the myTable array
        return Join
          .selectFrom(myTable)
          .execute();
        //END
      },
      sql: 'SELECT * FROM myTable;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable, 'x')
          .execute();
        //END
      },
      sql: 'SELECT x FROM myTable;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable, ['x', 'y'])
          .execute();
        //END
      },
      sql: 'SELECT x, y FROM myTable;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable, function(e) {
            return { sqrt: Math.sqrt(e.x) };
          })
          .execute();
        //END
      },
      sql: 'SELECT SQRT(x) as "sqrt" FROM myTable;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .orderBy('x')
          .execute();
        //END
      },
      sql: 'SELECT *\n' +
           '  FROM myTable\n' +
           '  ORDER BY x;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .orderBy(['x', 'y'])
          .execute();
        //END
      },
      sql: 'SELECT *\n' +
           '  FROM myTable\n' +
           '  ORDER BY x, y;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .orderBy(function(e1, e2) { return e2.x - e1.x; })
          .execute();
        //END
      },
      sql: 'SELECT *\n' +
           '  FROM myTable\n' +
           '  ORDER BY x DESC;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .orderBy('x')
          .limit(100)
          .execute();
        //END
      },
      sql: 'SELECT *\n' +
           '  FROM myTable\n' +
           '  ORDER BY x\n' +
           '  LIMIT 100;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .orderBy('x')
          .offset(20)
          .execute();
        //END
      },
      sql: 'SELECT *\n' +
           '  FROM myTable\n' +
           '  ORDER BY x\n' +
           '  OFFSET 20;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .orderBy('x')
          .limit(100, 20) // equivalent to .offset(20).limit(100)
          .execute();
        //END
      },
      sql: 'SELECT *\n' +
           '  FROM myTable\n' +
           '  ORDER BY x\n' +
           '  LIMIT 100 OFFSET 20;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .where(function(e) { return e.x < 3; })
          .execute();
        //END
      },
      sql: 'SELECT *\n' +
           '  FROM myTable\n' +
           '  WHERE x < 3;'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .where(function(e) { return 'x' in e; })
          .execute();
        //END
      },
      sql: 'SELECT *\n' +
           '  FROM myTable\n' +
           '  WHERE x IS NOT NULL;'
    },

    {
      js: function(L, R) {
        //START
        return Join
          .selectFrom(L)
          .hashJoin(R, 'x', function(L, R) {
            // INNER JOIN R USING (x)
            if (L && R) {
              return { x: L.x, y1: L.y, y2: R.y };
            }
          })
          .execute();
        //END
      },
      sql: 'SELECT x, L.y AS y1, R.y AS y2\n' +
           '  FROM L\n' +
           '  INNER JOIN R USING (x);'
    },

    {
      js: function(L, R) {
        //START
        return Join
          .selectFrom(L)
          .hashJoin(R, ['x', 'y'], function(L, R) {
            // INNER JOIN R USING (x, y)
            if (L && R) {
              return { x: L.x, y: L.y, z1: L.z, z2: R.z };
            }
          })
          .execute();
        //END
      },
      sql: 'SELECT x, y, L.z as z1, R.z as z2\n' +
           '  FROM L\n' +
           '  INNER JOIN R USING (x, y);'
    },

    {
      js: function(myTable) {
        //START
        return Join
          .selectFrom(myTable)
          .hashGroupBy('x', function(prev, e) {
            // SELECT ... COUNT(x) AS n ... GROUP BY x
            if (!prev) {
              return { x: e.x, n: 1 };
            } else {
              prev.n++;
              return prev;
            }
          })
          .execute();
        //END
      },
      sql: 'SELECT x, COUNT(x) AS n\n' +
           '  FROM myTable\n' +
           '  GROUP BY x;'
    },

    {
      js: function(L, R) {
        //START
        return Join
          .selectFrom(myTable)
          .hashGroupBy('x', function(prev, e) {
            // SELECT x, SUM(y) AS "sum" ... GROUP BY x
            if (!prev) {
              return { x: e.x, sum: e.y };
            } else {
              prev.sum += e.y;
              return prev;
            }
          })
          .having(function(e) { return e.sum > 3; })
          .execute();
        //END
      },
      sql: 'SELECT x, SUM(y) AS "sum"\n' +
           '  FROM myTable\n' +
           '  GROUP BY x\n' +
           '  HAVING SUM(y) > 3;'
    },

    {
      js: function(L, R) {
        //START
        return Join
          .selectFrom(myTable)
          .hashGroupBy(['x', 'y'], function(prev, e) {
            // SELECT x, y, SUM(z) AS "sum" ... GROUP BY x, y
            if (!prev) {
              return { x: e.x, y: e.y, sum: e.z };
            } else {
              prev.sum += e.z;
              return prev;
            }
          })
          .execute();
        //END
      },
      sql: 'SELECT x, y, SUM(z) AS "sum"\n' +
           '  FROM myTable\n' +
           '  GROUP BY x, y;'
    },

    {
      js: function(L, R) {
        //START
        return Join
          .selectFrom(L)
          .hashJoin(R, 'x', function(L, R) {
            // INNER JOIN R USING (x)
            if (L && R) {
              return { x: L.x, y1: L.y, y2: R.y };
            }
          })
          .where(function(e) { return e.y1 < 3; })
          .hashGroupBy('y1', function(prev, e) {
            // SELECT L.y as y, SUM(R.y) AS "sum" ... GROUP BY L.y
            if (!prev) {
              return { y: e.y1, sum: e.y2 };
            } else {
              prev.sum += e.y2;
              return prev;
            }
          })
          .having(function(e) { return e.sum > 3; })
          .orderBy('sum')
          .execute();
        //END
      },
      sql: 'SELECT L.y AS y, SUM(R.y) AS "sum"\n' +
           '  FROM L INNER JOIN R USING (x)\n' +
           '  WHERE L.y < 3\n' +
           '  GROUP BY L.y\n' +
           '  HAVING SUM(R.y) > 3\n' +
           '  ORDER BY sum;'
    }

  ];

  $scope.examples = $scope.examples.map(function(example) {
    return {
      js: Formatter.toFilteredSource(example.js, '', true),
      sql: example.sql
    };
  });

}]);
