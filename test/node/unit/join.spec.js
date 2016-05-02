describe('joining', function() {
  var expect = require('chai').expect;

  var Join = require('../../../angular-join.js');

  var left =  [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 }
  ];

  var right = [
    { x: 1, y: 1, z: 5 },
    { x: 2, y: 2, z: 6 },
    { x: 3, y: 3, z: 7 },
    { x: 5, y: 5, z: 8 }
  ];

  var leftString =  [
    { x: 'a', y: 1 },
    { x: 'b', y: 2 },
    { x: 'c', y: 3 },
    { x: 'd', y: 4 }
  ];

  var rightString = [
    { x: 'a', y: 1, z: 5 },
    { x: 'b', y: 2, z: 6 },
    { x: 'c', y: 3, z: 7 },
    { x: 'e', y: 5, z: 8 }
  ];

  function hashFcn(e) {
    return e.x;
  }

  function comparator(e1, e2) {
    return e1.x - e2.x;
  }

  var tests = [
    {
      name: 'inner join',
      left: left, right: right,
      hash: hashFcn, comparator: comparator,
      field: 'x', fields: ['x', 'y'],
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x: e1.x,
            y: e1.y,
            z: e2.z
          };
        } else {
          return null;
        }
      },
      expected: [
        { x: 1, y: 1, z: 5 },
        { x: 2, y: 2, z: 6 },
        { x: 3, y: 3, z: 7 }
      ]
    },
    {
      name: 'left outer join',
      left: left, right: right,
      hash: hashFcn, comparator: comparator,
      field: 'x', fields: ['x', 'y'],
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x: e1.x,
            y: e1.y,
            z: e2.z
          };
        } else if (e1) {
          return {
            x: e1.x,
            y: e1.y,
            z: null
          };
        } else {
          return null;
        }
      },
      expected: [
        { x: 1, y: 1, z: 5 },
        { x: 2, y: 2, z: 6 },
        { x: 3, y: 3, z: 7 },
        { x: 4, y: 4, z: null }
      ]
    },
    {
      name: 'right outer join',
      left: left, right: right,
      hash: hashFcn, comparator: comparator,
      field: 'x', fields: ['x', 'y'],
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x: e1.x,
            y: e1.y,
            z: e2.z
          };
        } else if (e2) {
          return {
            x: e2.x,
            y: null,
            z: e2.z
          };
        } else {
          return null;
        }
      },
      expected: [
        { x: 1, y: 1,    z: 5 },
        { x: 2, y: 2,    z: 6 },
        { x: 3, y: 3,    z: 7 },
        { x: 5, y: null, z: 8 }
      ]
    },
    {
      name: 'full outer join',
      left: left, right: right,
      hash: hashFcn, comparator: comparator,
      field: 'x', fields: ['x', 'y'],
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x: e1.x,
            y: e1.y,
            z: e2.z
          };
        } else if (e1) {
          return {
            x: e1.x,
            y: e1.y,
            z: null
          };
        } else {
          return {
            x: e2.x,
            y: null,
            z: e2.z
          };
        }
      },
      expected: [
        { x: 1, y: 1,    z: 5 },
        { x: 2, y: 2,    z: 6 },
        { x: 3, y: 3,    z: 7 },
        { x: 4, y: 4,    z: null },
        { x: 5, y: null, z: 8 }
      ]
    },
    {
      name: 'cross join',
      left: left, right: right,
      hash: function(e) { return 1; },
      comparator: function(e1, e2) { return 0; },
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x1: e1.x,
            x2: e2.x,
            y1: e1.y,
            y2: e2.y,
            z: e2.z
          };
        } else {
          return null;
        }
      },
      expected: [
        { x1: 1, x2: 1, y1: 1, y2: 1, z: 5 },
        { x1: 1, x2: 2, y1: 1, y2: 2, z: 6 },
        { x1: 1, x2: 3, y1: 1, y2: 3, z: 7 },
        { x1: 1, x2: 5, y1: 1, y2: 5, z: 8 },
        { x1: 2, x2: 1, y1: 2, y2: 1, z: 5 },
        { x1: 2, x2: 2, y1: 2, y2: 2, z: 6 },
        { x1: 2, x2: 3, y1: 2, y2: 3, z: 7 },
        { x1: 2, x2: 5, y1: 2, y2: 5, z: 8 },
        { x1: 3, x2: 1, y1: 3, y2: 1, z: 5 },
        { x1: 3, x2: 2, y1: 3, y2: 2, z: 6 },
        { x1: 3, x2: 3, y1: 3, y2: 3, z: 7 },
        { x1: 3, x2: 5, y1: 3, y2: 5, z: 8 },
        { x1: 4, x2: 1, y1: 4, y2: 1, z: 5 },
        { x1: 4, x2: 2, y1: 4, y2: 2, z: 6 },
        { x1: 4, x2: 3, y1: 4, y2: 3, z: 7 },
        { x1: 4, x2: 5, y1: 4, y2: 5, z: 8 }
      ]
    },

    {
      name: 'inner join with string values',
      left: leftString, right: rightString,
      field: 'x', fields: ['x', 'y'],
      options: [null, { localeCompare: true }],
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x: e1.x,
            y: e1.y,
            z: e2.z
          };
        } else {
          return null;
        }
      },
      expected: [
        { x: 'a', y: 1, z: 5 },
        { x: 'b', y: 2, z: 6 },
        { x: 'c', y: 3, z: 7 }
      ]
    },
    {
      name: 'left outer join with string values',
      left: leftString, right: rightString,
      field: 'x', fields: ['x', 'y'],
      options: [null, { localeCompare: true }],
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x: e1.x,
            y: e1.y,
            z: e2.z
          };
        } else if (e1) {
          return {
            x: e1.x,
            y: e1.y,
            z: null
          };
        } else {
          return null;
        }
      },
      expected: [
        { x: 'a', y: 1, z: 5 },
        { x: 'b', y: 2, z: 6 },
        { x: 'c', y: 3, z: 7 },
        { x: 'd', y: 4, z: null }
      ]
    },
    {
      name: 'right outer join with string values',
      left: leftString, right: rightString,
      field: 'x', fields: ['x', 'y'],
      options: [null, { localeCompare: true }],
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x: e1.x,
            y: e1.y,
            z: e2.z
          };
        } else if (e2) {
          return {
            x: e2.x,
            y: null,
            z: e2.z
          };
        } else {
          return null;
        }
      },
      expected: [
        { x: 'a', y: 1,    z: 5 },
        { x: 'b', y: 2,    z: 6 },
        { x: 'c', y: 3,    z: 7 },
        { x: 'e', y: null, z: 8 }
      ]
    },
    {
      name: 'full outer join with string values',
      left: leftString, right: rightString,
      field: 'x', fields: ['x', 'y'],
      options: [null, { localeCompare: true }],
      join: function(e1, e2) {
        if (e1 && e2) {
          return {
            x: e1.x,
            y: e1.y,
            z: e2.z
          };
        } else if (e1) {
          return {
            x: e1.x,
            y: e1.y,
            z: null
          };
        } else {
          return {
            x: e2.x,
            y: null,
            z: e2.z
          };
        }
      },
      expected: [
        { x: 'a', y: 1,    z: 5 },
        { x: 'b', y: 2,    z: 6 },
        { x: 'c', y: 3,    z: 7 },
        { x: 'd', y: 4,    z: null },
        { x: 'e', y: null, z: 8 }
      ]
    }
  ];

  describe('using the hashJoin algorithm', function() {
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
        describe('should do ' + t.name, function() {
          if (t.hasOwnProperty('hash')) {
            it('with a function', function() {
              var result = Join.hashJoin(t.left, t.right, t.hash, t.join);
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('field')) {
            it('with a string', function() {
              var result = Join.hashJoin(t.left, t.right, t.field, t.join);
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('fields')) {
            it('with an array', function() {
              var result = Join.hashJoin(t.left, t.right, t.fields, t.join);
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }
        });
      });
    });

    describe('called fluently', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name, function() {
          if (t.hasOwnProperty('hash')) {
            it('with a function', function() {
              var result = Join
                .selectFrom(t.left)
                .hashJoin(t.right, t.hash, t.join)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('field')) {
            it('with a string', function() {
              var result = Join
                .selectFrom(t.left)
                .hashJoin(t.right, t.field, t.join)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('fields')) {
            it('with an array', function() {
              var result = Join
                .selectFrom(t.left)
                .hashJoin(t.right, t.fields, t.join)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }
        });
      });
    });

    describe('called fluently with two queries', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name, function() {
          var rightQuery;
          beforeEach(function() {
            rightQuery = Join.selectFrom(t.right);
          });

          if (t.hasOwnProperty('hash')) {
            it('with a function', function() {
              var result = Join
                .selectFrom(t.left)
                .hashJoin(rightQuery, t.hash, t.join)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('field')) {
            it('with a string', function() {
              var result = Join
                .selectFrom(t.left)
                .hashJoin(rightQuery, t.field, t.join)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('fields')) {
            it('with an array', function() {
              var result = Join
                .selectFrom(t.left)
                .hashJoin(rightQuery, t.fields, t.join)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }
        });
      });
    });

  });

  describe('using the mergeJoin algorithm', function() {
    describe('called statically', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name, function() {
          var options = t.options || [null];

          options.forEach(function(opt) {
          describe('with ' + JSON.stringify(opt) + ' options', function() {
            if (t.hasOwnProperty('comparator')) {
              it('with a function', function() {
                var result = Join.mergeJoin(t.left, t.right, t.comparator, t.join, opt);
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('field')) {
              it('with a string', function() {
                var result = Join.mergeJoin(t.left, t.right, t.field, t.join, opt);
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('fields')) {
              it('with an array', function() {
                var result = Join.mergeJoin(t.left, t.right, t.fields, t.join, opt);
                expect(result).to.eql(t.expected);
              });
            }
          });
          });
        });
      });
    });

    describe('called fluently', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name, function() {
          var options = t.options || [null];

          options.forEach(function(opt) {
          describe('with ' + JSON.stringify(opt) + ' options', function() {
            if (t.hasOwnProperty('comparator')) {
              it('with a function', function() {
                var result = Join
                  .selectFrom(t.left)
                  .mergeJoin(t.right, t.comparator, t.join, opt)
                  .execute();
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('field')) {
              it('with a string', function() {
                var result = Join
                  .selectFrom(t.left)
                  .mergeJoin(t.right, t.field, t.join, opt)
                  .execute();
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('fields')) {
              it('with an array', function() {
                var result = Join
                  .selectFrom(t.left)
                  .mergeJoin(t.right, t.fields, t.join, opt)
                  .execute();
                expect(result).to.eql(t.expected);
              });
            }
          });
          });
        });
      });
    });

    describe('called fluently with two queries', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name, function() {
          var options = t.options || [null];

          options.forEach(function(opt) {
          describe('with ' + JSON.stringify(opt) + ' options', function() {
            var rightQuery;
            beforeEach(function() {
              rightQuery = Join.selectFrom(t.right);
            });

            if (t.hasOwnProperty('comparator')) {
              it('with a function', function() {
                var result = Join
                  .selectFrom(t.left)
                  .mergeJoin(rightQuery, t.comparator, t.join, opt)
                  .execute();
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('field')) {
              it('with a string', function() {
                var result = Join
                  .selectFrom(t.left)
                  .mergeJoin(rightQuery, t.field, t.join, opt)
                  .execute();
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('fields')) {
              it('with an array', function() {
                var result = Join
                  .selectFrom(t.left)
                  .mergeJoin(rightQuery, t.fields, t.join, opt)
                  .execute();
                expect(result).to.eql(t.expected);
              });
            }
          });
          });
        });
      });
    });

  });

});
