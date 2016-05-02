describe('slicing', function() {
  var expect = require('chai').expect;

  var Join = require('../../../angular-join.js');

  function makeNumeric(start, end) {
    var result = [];
    for (var i = start; i <= end; i++) {
      result.push({ x: i });
    }
    return result;
  }

  describe('should produce a subset of the input', function() {
    var input;

    beforeEach(function() {
      input = makeNumeric(1, 10);
    });

    it('using the slice function', function() {
      var slice = Join
        .selectFrom(input)
        .slice(1)
        .execute();
      expect(slice).to.eql(input.slice(1));

      slice = Join
        .selectFrom(input)
        .slice(1, 5)
        .execute();
      expect(slice).to.eql(input.slice(1, 5));

      slice = Join
        .selectFrom(input)
        .slice(0, input.length)
        .execute();
      expect(slice).to.eql(input);

      slice = Join
        .selectFrom(input)
        .slice(input.length)
        .execute();
      expect(slice).to.eql([]);
    });

    it('using the limit function', function() {
      var slice = Join
        .selectFrom(input)
        .limit(1)
        .execute();
      expect(slice).to.eql(input.slice(0, 1));

      slice = Join
        .selectFrom(input)
        .limit(1, 5)
        .execute();
      expect(slice).to.eql(input.slice(5, 6));

      slice = Join
        .selectFrom(input)
        .limit(input.length, 0)
        .execute();
      expect(slice).to.eql(input);

      slice = Join
        .selectFrom(input)
        .limit(0)
        .execute();
      expect(slice).to.eql([]);
    });

    it('using the offset function', function() {
      var slice = Join
        .selectFrom(input)
        .offset(1)
        .execute();
      expect(slice).to.eql(input.slice(1));

      slice = Join
        .selectFrom(input)
        .offset(0)
        .execute();
      expect(slice).to.eql(input);

      slice = Join
        .selectFrom(input)
        .offset(input.length)
        .execute();
      expect(slice).to.eql([]);
    });

  });

  describe('should produce a clone of the input', function() {
    var input;

    beforeEach(function() {
      input = makeNumeric(1, 10);
    });

    it('using the slice function', function() {
      var slice = Join
        .selectFrom(input)
        .slice(0, input.length)
        .execute();
      expect(slice).to.eql(input);
    });

    it('using the limit function', function() {
      var slice = Join
        .selectFrom(input)
        .limit(input.length, 0)
        .execute();
      expect(slice).to.eql(input);
    });

    it('using the offset function', function() {
      var slice = Join
        .selectFrom(input)
        .offset(0)
        .execute();
      expect(slice).to.eql(input);
    });

  });

  describe('should produce an empty array', function() {
    var input;

    beforeEach(function() {
      input = makeNumeric(1, 10);
    });

    it('using the slice function', function() {
      var slice = Join
        .selectFrom(input)
        .slice(input.length)
        .execute();
      expect(slice).to.eql([]);
    });

    it('using the limit function', function() {
      var slice = Join
        .selectFrom(input)
        .limit(0)
        .execute();
      expect(slice).to.eql([]);
    });

    it('using the offset function', function() {
      var slice = Join
        .selectFrom(input)
        .offset(input.length)
        .execute();
      expect(slice).to.eql([]);
    });

  });
});
