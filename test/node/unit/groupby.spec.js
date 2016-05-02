describe('grouping', function() {
  var expect = require('chai').expect;

  var Join = require('../../../angular-join.js');

  var input = [
    { x: 1, y: 'a', z: 1 },
    { x: 1, y: 'a', z: 2 },
    { x: 2, y: 'b', z: 3 },
    { x: 2, y: 'b', z: 4 },
    { x: 3, y: 'c', z: 5 },
    { x: 3, y: 'c', z: 6 }
  ];

  function hashFcn(e) {
    return e.x;
  }

  function comparator(e1, e2) {
    return e1.x - e2.x;
  }

  var tests = [
    {
      name: 'counts',
      input: input,
      hash: hashFcn, comparator: comparator,
      options: [null, { localeCompare: true }],
      field: 'x', fields: ['x', 'y'],
      groupBy: function(prev, e) {
        if (!prev) {
          prev = { x: e.x, y: e.y, count: 0 };
        }
        prev.count++;
        return prev;
      },
      expected: [
        { x: 1, y: 'a', count: 2 },
        { x: 2, y: 'b', count: 2 },
        { x: 3, y: 'c', count: 2 }
      ]
    },
    {
      name: 'sums',
      input: input,
      hash: hashFcn, comparator: comparator,
      options: [null, { localeCompare: true }],
      field: 'x', fields: ['x', 'y'],
      groupBy: function(prev, e) {
        if (!prev) {
          prev = { x: e.x, y: e.y, sum: 0 };
        }
        prev.sum += e.z;
        return prev;
      },
      expected: [
        { x: 1, y: 'a', sum: 3 },
        { x: 2, y: 'b', sum: 7 },
        { x: 3, y: 'c', sum: 11 }
      ]
    },
    {
      name: 'ranges',
      input: input,
      hash: function(e) {
        return Math.floor(e.z / 3) * 3;
      },
      comparator: function(e1, e2) {
        return Math.floor(e1.z / 3) * 3 - Math.floor(e2.z / 3) * 3;
      },
      groupBy: function(prev, e) {
        var start = Math.floor(e.z / 3) * 3;
        if (!prev) {
          prev = { start: start, end: start + 2, count: 0 };
        }
        prev.count++;
        return prev;
      },
      expected: [
        { start: 0, end: 2, count: 2 },
        { start: 3, end: 5, count: 3 },
        { start: 6, end: 8, count: 1 }
      ]
    },

  ];

  describe('using a hashGroupBy algorithm', function() {
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
              var result = Join.hashGroupBy(t.input, t.hash, t.groupBy);
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('field')) {
            it('with a string', function() {
              var result = Join.hashGroupBy(t.input, t.field, t.groupBy);
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('fields')) {
            it('with an array', function() {
              var result = Join.hashGroupBy(t.input, t.fields, t.groupBy);
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
                .selectFrom(t.input)
                .hashGroupBy(t.hash, t.groupBy)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('field')) {
            it('with a string', function() {
              var result = Join
                .selectFrom(t.input)
                .hashGroupBy(t.field, t.groupBy)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }

          if (t.hasOwnProperty('fields')) {
            it('with an array', function() {
              var result = Join
                .selectFrom(t.input)
                .hashGroupBy(t.fields, t.groupBy)
                .execute();
              expect(result).to.deep.include.members(t.expected);
              expect(t.expected).to.deep.include.members(result);
            });
          }
        });
      });
    });

  });

  describe('using a sortGroupBy algorithm', function() {
    describe('called statically', function() {
      tests.forEach(function(t) {
        describe('should do ' + t.name, function() {
          var options = t.options || [null];

          options.forEach(function(opt) {
          describe('with ' + JSON.stringify(opt) + ' options', function() {
            if (t.hasOwnProperty('comparator')) {
              it('with a function', function() {
                var result = Join.sortGroupBy(t.input, t.comparator, t.groupBy, opt);
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('field')) {
              it('with a string', function() {
                var result = Join.sortGroupBy(t.input, t.field, t.groupBy, opt);
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('fields')) {
              it('with an array', function() {
                var result = Join.sortGroupBy(t.input, t.fields, t.groupBy, opt);
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
                  .selectFrom(t.input)
                  .sortGroupBy(t.comparator, t.groupBy, opt)
                  .execute();
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('field')) {
              it('with a string', function() {
                var result = Join
                  .selectFrom(t.input)
                  .sortGroupBy(t.field, t.groupBy, opt)
                  .execute();
                expect(result).to.eql(t.expected);
              });
            }

            if (t.hasOwnProperty('fields')) {
              it('with an array', function() {
                var result = Join
                  .selectFrom(t.input)
                  .sortGroupBy(t.fields, t.groupBy, opt)
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
