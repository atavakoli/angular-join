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

  function hashFcn(e) {
    return e.x;
  }

  function comparator(e1, e2) {
    return e1.x - e2.x;
  }

  var tests = [
    {
      name: 'inner',
      left: left, right: right,
      hash: hashFcn, comparator: comparator, field: 'x',
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x:  e1.x,
            y1: e1.y,
            y2: e2.y
          };
        } else {
          return null;
        }
      },
      expected: [
        { x: 1, y1: 1, y2: 5 },
        { x: 2, y1: 2, y2: 6 },
        { x: 3, y1: 3, y2: 7 }
      ]
    },
    {
      name: 'left',
      left: left, right: right,
      hash: hashFcn, comparator: comparator, field: 'x',
      join: function(e1, e2) {
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
      },
      expected: [
        { x: 1, y1: 1, y2: 5 },
        { x: 2, y1: 2, y2: 6 },
        { x: 3, y1: 3, y2: 7 },
        { x: 4, y1: 4, y2: null }
      ]
    },
    {
      name: 'right',
      left: left, right: right,
      hash: hashFcn, comparator: comparator, field: 'x',
      join: function(e1, e2) {
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
      },
      expected: [
        { x: 1, y1: 1,    y2: 5 },
        { x: 2, y1: 2,    y2: 6 },
        { x: 3, y1: 3,    y2: 7 },
        { x: 5, y1: null, y2: 8 }
      ]
    },
    {
      name: 'full',
      left: left, right: right,
      hash: hashFcn, comparator: comparator, field: 'x',
      join: function(e1, e2) {
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
      },
      expected: [
        { x: 1, y1: 1,    y2: 5 },
        { x: 2, y1: 2,    y2: 6 },
        { x: 3, y1: 3,    y2: 7 },
        { x: 4, y1: 4,    y2: null },
        { x: 5, y1: null, y2: 8 }
      ]
    }

  ];

  describe('using a hash-join algorithm', function() {
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

    describe('called statically', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name + '-join', function() {
          it('with a function', function() {
            var result = Join.hashJoin(t.left, t.right, t.hash, t.join);
            expect(result).toEqual(permutationOf(t.expected));
          });

          it('with a string', function() {
            var result = Join.hashJoin(t.left, t.right, t.field, t.join);
            expect(result).toEqual(permutationOf(t.expected));
          });

          it('with an array', function() {
            var result = Join.hashJoin(t.left, t.right, [t.field], t.join);
            expect(result).toEqual(permutationOf(t.expected));
          });
        });
      });

      it('should do cross join');
    });

    describe('called fluently', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name + '-join', function() {
          it('with a function', function() {
            var result = Join
              .selectFrom(t.left)
              .hashJoin(t.right, t.hash, t.join)
              .execute();
            expect(result).toEqual(permutationOf(t.expected));
          });

          it('with a string', function() {
            var result = Join
              .selectFrom(t.left)
              .hashJoin(t.right, t.field, t.join)
              .execute();
            expect(result).toEqual(permutationOf(t.expected));
          });

          it('with an array', function() {
            var result = Join
              .selectFrom(t.left)
              .hashJoin(t.right, [t.field], t.join)
              .execute();
            expect(result).toEqual(permutationOf(t.expected));
          });
        });
      });

      it('should do cross join');
    });

  });

  describe('using a merge-join algorithm', function() {
    describe('called statically', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name + '-join', function() {
          it('with a function', function() {
            var result = Join.mergeJoin(t.left, t.right, t.comparator, t.join);
            expect(result).toEqual(t.expected);
          });

          it('with a string', function() {
            var result = Join.mergeJoin(t.left, t.right, t.field, t.join);
            expect(result).toEqual(t.expected);
          });

          it('with an array', function() {
            var result = Join.mergeJoin(t.left, t.right, [t.field], t.join);
            expect(result).toEqual(t.expected);
          });
        });
      });

      it('should do cross join');
    });

    describe('called fluently', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name + '-join', function() {
          it('with a function', function() {
            var result = Join
              .selectFrom(t.left)
              .mergeJoin(t.right, t.comparator, t.join)
              .execute();
            expect(result).toEqual(t.expected);
          });

          it('with a string', function() {
            var result = Join
              .selectFrom(t.left)
              .mergeJoin(t.right, t.field, t.join)
              .execute();
            expect(result).toEqual(t.expected);
          });

          it('with an array', function() {
            var result = Join
              .selectFrom(t.left)
              .mergeJoin(t.right, [t.field], t.join)
              .execute();
            expect(result).toEqual(t.expected);
          });
        });
      });

      it('should do cross join');
    });

  });

});
