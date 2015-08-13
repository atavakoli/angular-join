describe('join', function() {
  var Join;

  beforeEach(module('angular-join'));
  beforeEach(inject(function(_Join_) {
    Join = _Join_;
  }));

  var left =  [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 }
  ];

  var right = [
    { x: 1, y: 5 },
    { x: 2, y: 6 },
    { x: 3, y: 7 },
    { x: 5, y: 8 }
  ];

  function innerJoin(e1, e2) {
    if (e1 && e2) {
      return {
        x:  e1.x,
        y1: e1.y,
        y2: e2.y
      };
    } else {
      return null;
    }
  }

  var innerExpected = [
    { x: 1, y1: 1, y2: 5 },
    { x: 2, y1: 2, y2: 6 },
    { x: 3, y1: 3, y2: 7 }
  ];

  function leftJoin(e1, e2) {
    if (e1 && e2) {
      return {
        x:  e1.x,
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
  }

  var leftExpected = [
    { x: 1, y1: 1, y2: 5 },
    { x: 2, y1: 2, y2: 6 },
    { x: 3, y1: 3, y2: 7 },
    { x: 4, y1: 4, y2: null }
  ];

  function rightJoin(e1, e2) {
    if (e1 && e2) {
      return {
        x:  e1.x,
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
  }

  var rightExpected = [
    { x: 1, y1: 1,    y2: 5 },
    { x: 2, y1: 2,    y2: 6 },
    { x: 3, y1: 3,    y2: 7 },
    { x: 5, y1: null, y2: 8 }
  ];

  function fullJoin(e1, e2) {
    if (e1 && e2) {
      return {
        x:  e1.x,
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
  }

  var fullExpected = [
    { x: 1, y1: 1,    y2: 5 },
    { x: 2, y1: 2,    y2: 6 },
    { x: 3, y1: 3,    y2: 7 },
    { x: 4, y1: 4,    y2: null },
    { x: 5, y1: null, y2: 8 }
  ];

  describe('using a hash function', function() {
    var permutationOf = function(a2) {
      return {
        asymmetricMatch: function(a1) {
          var a2Copy = a2.slice();
          for (var i = a1.length - 1; i >= 0; i--) {
            var match = false;
            for (var j = 0; j < a2Copy.length; j++) {
              if (angular.equals(a1[i], a2Copy[j])) {
                a2Copy.splice(j, 1);
                match = true;
                break;
              }
            }
            if (!match) {
              return false;
            }
          }
          return (a2Copy.length === 0);
        }
      }
    }

    function hashFcn(e) {
      return e.x;
    }

    describe('using the static method', function() {
      it('should do inner join with a function', function() {
        var result = Join.hashJoin(left, right, hashFcn, innerJoin);
        expect(result).toEqual(permutationOf(innerExpected));
      });

      it('should do inner join with a string', function() {
        var result = Join.hashJoin(left, right, 'x', innerJoin);
        expect(result).toEqual(permutationOf(innerExpected));
      });

      it('should do left join with a function', function() {
        var result = Join.hashJoin(left, right, hashFcn, leftJoin);
        expect(result).toEqual(permutationOf(leftExpected));
      });

      it('should do left join with a string', function() {
        var result = Join.hashJoin(left, right, 'x', leftJoin);
        expect(result).toEqual(permutationOf(leftExpected));
      });

      it('should do right join with a function', function() {
        var result = Join.hashJoin(left, right, hashFcn, rightJoin);
        expect(result).toEqual(permutationOf(rightExpected));
      });

      it('should do right join with a string', function() {
        var result = Join.hashJoin(left, right, 'x', rightJoin);
        expect(result).toEqual(permutationOf(rightExpected));
      });

      it('should do full join with a function', function() {
        var result = Join.hashJoin(left, right, hashFcn, fullJoin);
        expect(result).toEqual(permutationOf(fullExpected));
      });

      it('should do full join with a string', function() {
        var result = Join.hashJoin(left, right, 'x', fullJoin);
        expect(result).toEqual(permutationOf(fullExpected));
      });

      it('should do cross join with a function');
      it('should do cross join with a string');
    });

    describe('using the fluent method', function() {
      it('should do inner join with a function', function() {
        var result = Join
          .selectFrom(left)
          .hashJoin(right, hashFcn, innerJoin)
          .execute();
        expect(result).toEqual(permutationOf(innerExpected));
      });

      it('should do inner join with a string', function() {
        var result = Join
          .selectFrom(left)
          .hashJoin(right, 'x', innerJoin)
          .execute();
        expect(result).toEqual(permutationOf(innerExpected));
      });

      it('should do left join with a function', function() {
        var result = Join
          .selectFrom(left)
          .hashJoin(right, hashFcn, leftJoin)
          .execute();
        expect(result).toEqual(permutationOf(leftExpected));
      });

      it('should do left join with a string', function() {
        var result = Join
          .selectFrom(left)
          .hashJoin(right, 'x', leftJoin)
          .execute();
        expect(result).toEqual(permutationOf(leftExpected));
      });

      it('should do right join with a function', function() {
        var result = Join
          .selectFrom(left)
          .hashJoin(right, hashFcn, rightJoin)
          .execute();
        expect(result).toEqual(permutationOf(rightExpected));
      });

      it('should do right join with a string', function() {
        var result = Join
          .selectFrom(left)
          .hashJoin(right, 'x', rightJoin)
          .execute();
        expect(result).toEqual(permutationOf(rightExpected));
      });

      it('should do full join with a function', function() {
        var result = Join
          .selectFrom(left)
          .hashJoin(right, hashFcn, fullJoin)
          .execute();
        expect(result).toEqual(permutationOf(fullExpected));
      });

      it('should do full join with a string', function() {
        var result = Join
          .selectFrom(left)
          .hashJoin(right, 'x', fullJoin)
          .execute();
        expect(result).toEqual(permutationOf(fullExpected));
      });

      it('should do cross join with a function');
      it('should do cross join with a string');
    });

  });

  describe('using a comparator function', function() {
    function comparator(e1, e2) {
      return e1.x - e2.x;
    }

    describe('using the static method', function() {
      it('should do inner join with a function', function() {
        var result = Join.mergeJoin(left, right, comparator, innerJoin);
        expect(result).toEqual(innerExpected);
      });

      it('should do inner join with a string', function() {
        var result = Join.mergeJoin(left, right, 'x', innerJoin);
        expect(result).toEqual(innerExpected);
      });

      it('should do left join with a function', function() {
        var result = Join.mergeJoin(left, right, comparator, leftJoin);
        expect(result).toEqual(leftExpected);
      });

      it('should do left join with a string', function() {
        var result = Join.mergeJoin(left, right, 'x', leftJoin);
        expect(result).toEqual(leftExpected);
      });

      it('should do right join with a function', function() {
        var result = Join.mergeJoin(left, right, comparator, rightJoin);
        expect(result).toEqual(rightExpected);
      });

      it('should do right join with a string', function() {
        var result = Join.mergeJoin(left, right, 'x', rightJoin);
        expect(result).toEqual(rightExpected);
      });

      it('should do full join with a function', function() {
        var result = Join.mergeJoin(left, right, comparator, fullJoin);
        expect(result).toEqual(fullExpected);
      });

      it('should do full join with a string', function() {
        var result = Join.mergeJoin(left, right, 'x', fullJoin);
        expect(result).toEqual(fullExpected);
      });

      it('should do cross join with a function');
      it('should do cross join with a string');
    });

    describe('using the fluent method', function() {
      it('should do inner join with a function', function() {
        var result = Join
          .selectFrom(left)
          .mergeJoin(right, comparator, innerJoin)
          .execute();
        expect(result).toEqual(innerExpected);
      });

      it('should do inner join with a string', function() {
        var result = Join
          .selectFrom(left)
          .mergeJoin(right, 'x', innerJoin)
          .execute();
        expect(result).toEqual(innerExpected);
      });

      it('should do left join with a function', function() {
        var result = Join
          .selectFrom(left)
          .mergeJoin(right, comparator, leftJoin)
          .execute();
        expect(result).toEqual(leftExpected);
      });

      it('should do left join with a string', function() {
        var result = Join
          .selectFrom(left)
          .mergeJoin(right, 'x', leftJoin)
          .execute();
        expect(result).toEqual(leftExpected);
      });

      it('should do right join with a function', function() {
        var result = Join
          .selectFrom(left)
          .mergeJoin(right, comparator, rightJoin)
          .execute();
        expect(result).toEqual(rightExpected);
      });

      it('should do right join with a string', function() {
        var result = Join
          .selectFrom(left)
          .mergeJoin(right, 'x', rightJoin)
          .execute();
        expect(result).toEqual(rightExpected);
      });

      it('should do full join with a function', function() {
        var result = Join
          .selectFrom(left)
          .mergeJoin(right, comparator, fullJoin)
          .execute();
        expect(result).toEqual(fullExpected);
      });

      it('should do full join with a string', function() {
        var result = Join
          .selectFrom(left)
          .mergeJoin(right, 'x', fullJoin)
          .execute();
        expect(result).toEqual(fullExpected);
      });

      it('should do cross join with a function');
      it('should do cross join with a string');
    });

  });
});
