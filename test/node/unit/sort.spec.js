describe('sorting', function() {
  var chai = require('chai');
  var sinon = require('sinon');
  chai.use(require('sinon-chai'));
  var expect = chai.expect;

  var Join = require('../../../angular-join.js');

  function makeNumeric(start, end) {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push({ x: i });
    }
    return result;
  }

  function makeNumeric2D(xStart, xEnd, yStart, yEnd) {
    var result = [];
    makeNumeric(xStart, xEnd).forEach(function(e1) {
      makeNumeric(yStart, yEnd).forEach(function(e2) {
        result.push({ x: e1.x, y: e2.x });
      });
    });
    return result;
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }

  function comparator2D(e1, e2) {
    var diff = e1.x - e2.x;
    return diff !== 0 ? diff : e1.y.localeCompare(e2.y);
  }

  function comparator(e1, e2) {
    return e1.x - e2.x;
  }

  function stringComparator(e1, e2) {
    return e1.x.localeCompare(e2.x);
  }

  describe('should work with numbered keys', function() {
    var sorted, shuffled;

    beforeEach(function() {
      sorted = makeNumeric(1, 100);
      shuffled = shuffle(sorted.slice());
    });

    it('using a function', function() {
      var newlySorted = Join
        .selectFrom(shuffled)
        .sort(comparator)
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy(comparator)
        .execute();
      expect(newlySorted).to.eql(sorted);
    });

    it('using a string', function() {
      var newlySorted = Join
        .selectFrom(shuffled)
        .sort('x')
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy('x')
        .execute();
      expect(newlySorted).to.eql(sorted);
    });

    it('using an array', function() {
      var newlySorted = Join
        .selectFrom(shuffled)
        .sort(['x'])
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy(['x'])
        .execute();
      expect(newlySorted).to.eql(sorted);
    });

  });

  describe('should work with string keys', function() {
    var sorted, shuffled;

    beforeEach(function() {
      var A = 'A'.charCodeAt(0);

      // e.x = 'A' .. 'Z'
      sorted = makeNumeric(0, 25).map(function(e) {
        return {x: String.fromCharCode(A + e.x) };
      });
      shuffled = shuffle(sorted.slice());
    });

    it('using a function', function() {
      var newlySorted = Join
        .selectFrom(shuffled)
        .sort(stringComparator)
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy(stringComparator)
        .execute();
      expect(newlySorted).to.eql(sorted);
    });

    it('using a string', function() {
      var spy = sinon.spy(String.prototype, 'localeCompare');

      var newlySorted = Join
        .selectFrom(shuffled)
        .sort('x')
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy('x')
        .execute();
      expect(newlySorted).to.eql(sorted);

      expect(spy).to.not.have.been.called;
      spy.restore();
    });

    it('using a string with localeCompare', function() {
      var spy = sinon.spy(String.prototype, 'localeCompare');

      var newlySorted = Join
        .selectFrom(shuffled)
        .sort('x', { localeCompare: true })
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy('x', { localeCompare: true })
        .execute();
      expect(newlySorted).to.eql(sorted);

      expect(spy).to.have.been.called;
      spy.restore();
    });

    it('using an array', function() {
      var spy = sinon.spy(String.prototype, 'localeCompare');

      var newlySorted = Join
        .selectFrom(shuffled)
        .sort(['x'])
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy(['x'])
        .execute();
      expect(newlySorted).to.eql(sorted);

      expect(spy).not.to.have.been.called;
      spy.restore();
    });

    it('using an array with localeCompare', function() {
      var spy = sinon.spy(String.prototype, 'localeCompare');

      var newlySorted = Join
        .selectFrom(shuffled)
        .sort(['x'], { localeCompare: true })
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy(['x'], { localeCompare: true })
        .execute();
      expect(newlySorted).to.eql(sorted);

      expect(spy).to.have.been.called;
      spy.restore();
    });

  });

  describe('should work with multiple keys', function() {
    var sorted, shuffled;

    beforeEach(function() {
      var A = 'A'.charCodeAt(0);

      // e = {x: 1 .. 10, y: 'A' .. 'Z'}
      sorted = makeNumeric2D(1, 10, 0, 25).map(function(e) {
        return { x: e.x, y: String.fromCharCode(A + e.y) };
      });
      shuffled = shuffle(sorted.slice());
    });

    it('using a function', function() {
      var newlySorted = Join
        .selectFrom(shuffled)
        .sort(comparator2D)
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy(comparator2D)
        .execute();
      expect(newlySorted).to.eql(sorted);
    });

    it('using an array', function() {
      var spy = sinon.spy(String.prototype, 'localeCompare');

      var newlySorted = Join
        .selectFrom(shuffled)
        .sort(['x', 'y'])
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy(['x', 'y'])
        .execute();
      expect(newlySorted).to.eql(sorted);

      expect(spy).to.not.have.been.called;
      spy.restore();
    });

    it('using an array with localeCompare', function() {
      var spy = sinon.spy(String.prototype, 'localeCompare');

      var newlySorted = Join
        .selectFrom(shuffled)
        .sort(['x', 'y'], { localeCompare: true })
        .execute();
      expect(newlySorted).to.eql(sorted);

      newlySorted = Join
        .selectFrom(shuffled)
        .orderBy(['x', 'y'], { localeCompare: true })
        .execute();
      expect(newlySorted).to.eql(sorted);

      expect(spy).to.have.been.called;
      spy.restore();
    });

  });
});
