describe('using the fluent interface', function() {
  var chai = require('chai');
  var sinon = require('sinon');
  chai.use(require('sinon-chai'));
  var expect = chai.expect;

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

  it('should create new queries from existing queries', function() {
    var firstQuery = Join.selectFrom(left);
    var childQuery = Join.selectFrom(firstQuery, 'x');
    expect(firstQuery).to.not.equal(childQuery);
  });

  it('should create new queries for mutable operations', function() {
    var firstQuery = Join.selectFrom(left);
    var childQuery;

    childQuery = firstQuery.select('x');
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.map('x');
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.where(function() {});
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.having(function() {});
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.filter(function() {});
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.orderBy('x');
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.sort('x');
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.limit(1);
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.offset(1);
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.slice();
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.hashJoin(right, 'x', function() {});
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.mergeJoin(right, 'x', function() {});
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.hashGroupBy('x', function() {});
    expect(firstQuery).to.not.equal(childQuery);

    childQuery = firstQuery.sortGroupBy('x', function() {});
    expect(firstQuery).to.not.equal(childQuery);
  });

  it('should let base queries change without affecting child queries', function() {
    var firstQuery = Join.selectFrom(left);
    var childQuery = firstQuery.select('x');

    var result1 = childQuery.execute();
    firstQuery = firstQuery.select('y');
    var result2 = childQuery.execute();

    expect(result1).to.eql(result2);
  });

  it('should not use the cache when forced', function() {
    var spy = sinon.spy();

    var firstQuery = Join
      .selectFrom(left)
      .inspect(spy);

    var childQuery = firstQuery
      .select('x')
      .inspect(spy);


    firstQuery.execute();
    var childResults1 = childQuery.execute({ force: true });
    expect(spy).to.have.been.calledThrice;

    var childResults2 = childQuery.execute({ force: true });
    expect(spy).to.have.callCount(5);
    expect(childResults1).to.eql(childResults2);
    expect(childResults1).to.not.equal(childResults2);

    childQuery = childQuery.inspect(spy);

    childQuery.execute({ force: true });
    expect(spy).to.have.callCount(8);
  });

  it('should use the cache by default', function() {
    var spy = sinon.spy();

    var firstQuery = Join
      .selectFrom(left)
      .inspect(spy);

    var childQuery = firstQuery
      .select('x')
      .inspect(spy);

    firstQuery.execute();
    var childResults1 = childQuery.execute();
    expect(spy).to.have.been.calledTwice;

    var childResults2 = childQuery.execute();
    expect(spy).to.have.been.calledTwice;
    expect(childResults1).to.eql(childResults2);

    childQuery = childQuery.inspect(spy);

    childQuery.execute();
    expect(spy).to.have.been.calledThrice;
  });

  describe('in async mode', function() {
    it('should return a promise with the same results', function(done) {
      var query = Join
        .selectFrom(left)
        .select(['y']);

      var promise = query.execute({ async: true });
      var result = query.execute();

      expect(promise.then).to.be.a('function');

      promise.then(function(asyncResult) {
        expect(result).to.eql(asyncResult);
        done();
      });
    });

    it('should not use the cache when forced', function(done) {
      var spy = sinon.spy();

      var firstQuery = Join
        .selectFrom(left)
        .inspect(spy);
      var childQuery = firstQuery
        .select('x')
        .inspect(spy);

      var childResults1;

      firstQuery
        .execute({ async: true, force: true })
        .then(function(results) {
          expect(spy).to.have.been.calledOnce;
          return childQuery.execute({ async: true, force: true });
        })
        .then(function(results) {
          childResults1 = results;
          expect(spy).to.have.been.calledThrice;
          return childQuery.execute({ async: true, force: true });
        })
        .then(function(results) {
          expect(childResults1).to.eql(results);
          expect(childResults1).to.not.equal(results);
          expect(spy).to.have.callCount(5);
          return childQuery
            .inspect(spy)
            .execute({ async: true, force: true });
        })
        .then(function(results) {
          expect(spy).to.have.callCount(8);
          done();
        });
    });

    it('should use the cache by default', function(done) {
      var spy = sinon.spy();

      var firstQuery = Join
        .selectFrom(left)
        .inspect(spy);
      var childQuery = firstQuery
        .select('x')
        .inspect(spy);

      var childResults1;

      firstQuery
        .execute({ async: true })
        .then(function(results) {
          expect(spy).to.have.been.calledOnce;
          return childQuery.execute({ async: true });
        })
        .then(function(results) {
          childResults1 = results;
          expect(spy).to.have.been.calledTwice;
          return childQuery.execute({ async: true });
        })
        .then(function(results) {
          expect(childResults1).to.eql(results);
          expect(spy).to.have.been.calledTwice;
          return childQuery
            .inspect(spy)
            .execute({ async: true });
        })
        .then(function(results) {
          expect(spy).to.have.been.calledThrice;
          done();
        });
    });

  });
});
