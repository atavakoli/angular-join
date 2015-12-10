describe('using the fluent interface', function() {
  var Join
  var $timeout;
  var $rootScope;

  beforeEach(module('angular-join'));
  beforeEach(inject(function(_Join_, _$timeout_, _$rootScope_) {
    Join = _Join_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
  }));

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

  it('should create new queries from existing queries', function() {
    var firstQuery = Join.selectFrom(left);
    var childQuery = Join.selectFrom(firstQuery, 'x');
    expect(firstQuery).not.toBe(childQuery);
  });

  it('should create new queries for mutable operations', function() {
    var firstQuery = Join.selectFrom(left);
    var childQuery;

    childQuery = firstQuery.select('x');
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.map('x');
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.where(function() {});
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.having(function() {});
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.filter(function() {});
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.orderBy('x');
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.sort('x');
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.limit(1);
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.offset(1);
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.slice();
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.hashJoin(right, 'x', function() {});
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.mergeJoin(right, 'x', function() {});
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.hashGroupBy('x', function() {});
    expect(firstQuery).not.toBe(childQuery);

    childQuery = firstQuery.sortGroupBy('x', function() {});
    expect(firstQuery).not.toBe(childQuery);
  });

  it('should let base queries change without affecting child queries', function() {
    var firstQuery = Join.selectFrom(left);
    var childQuery = firstQuery.select('x');

    var result1 = childQuery.execute();
    firstQuery = firstQuery.select('y');
    var result2 = childQuery.execute();

    expect(result1).toEqual(result2);
  });

  it('should not use the cache when forced', function() {
    var spy = jasmine.createSpy('spy');

    var firstQuery = Join
      .selectFrom(left)
      .inspect(spy);

    var childQuery = firstQuery
      .select('x')
      .inspect(spy);


    firstQuery.execute();
    var childResults1 = childQuery.execute({ force: true });
    expect(spy.calls.count()).toEqual(3);

    var childResults2 = childQuery.execute({ force: true });
    expect(spy.calls.count()).toEqual(5);
    expect(childResults1).not.toBe(childResults2);

    childQuery = childQuery.inspect(spy);

    childQuery.execute({ force: true });
    expect(spy.calls.count()).toEqual(8);
  });

  it('should use the cache by default', function() {
    var spy = jasmine.createSpy('spy');

    var firstQuery = Join
      .selectFrom(left)
      .inspect(spy);

    var childQuery = firstQuery
      .select('x')
      .inspect(spy);

    firstQuery.execute();
    var childResults1 = childQuery.execute();
    expect(spy.calls.count()).toEqual(2);

    var childResults2 = childQuery.execute();
    expect(spy.calls.count()).toEqual(2);
    expect(childResults1).toBe(childResults2);

    childQuery = childQuery.inspect(spy);

    childQuery.execute();
    expect(spy.calls.count()).toEqual(3);
  });

  describe('in async mode', function() {
    it('should return a promise with the same results', function(done) {
      var query = Join
        .selectFrom(left)
        .select(['y']);

      var promise = query.execute({ async: true });
      var result = query.execute();

      expect(promise.then).toEqual(jasmine.any(Function));

      promise.then(function(asyncResult) {
        expect(result).toEqual(asyncResult);
        done();
      });
      $rootScope.$apply();
    });
  });
});
