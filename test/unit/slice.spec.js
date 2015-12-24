describe('slicing', function() {
  var Join;

  beforeEach(module('angular-join'));
  beforeEach(inject(function(_Join_) {
    Join = _Join_;
  }));

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
      expect(slice).toEqual(input.slice(1));

      slice = Join
        .selectFrom(input)
        .slice(1, 5)
        .execute();
      expect(slice).toEqual(input.slice(1, 5));

      slice = Join
        .selectFrom(input)
        .slice(0, input.length)
        .execute();
      expect(slice).toEqual(input);

      slice = Join
        .selectFrom(input)
        .slice(input.length)
        .execute();
      expect(slice).toEqual([]);
    });

    it('using the limit function', function() {
      var slice = Join
        .selectFrom(input)
        .limit(1)
        .execute();
      expect(slice).toEqual(input.slice(0, 1));

      slice = Join
        .selectFrom(input)
        .limit(1, 5)
        .execute();
      expect(slice).toEqual(input.slice(5, 6));

      slice = Join
        .selectFrom(input)
        .limit(input.length, 0)
        .execute();
      expect(slice).toEqual(input);

      slice = Join
        .selectFrom(input)
        .limit(0)
        .execute();
      expect(slice).toEqual([]);
    });

    it('using the offset function', function() {
      var slice = Join
        .selectFrom(input)
        .offset(1)
        .execute();
      expect(slice).toEqual(input.slice(1));

      slice = Join
        .selectFrom(input)
        .offset(0)
        .execute();
      expect(slice).toEqual(input);

      slice = Join
        .selectFrom(input)
        .offset(input.length)
        .execute();
      expect(slice).toEqual([]);
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
      expect(slice).toEqual(input);
    });

    it('using the limit function', function() {
      var slice = Join
        .selectFrom(input)
        .limit(input.length, 0)
        .execute();
      expect(slice).toEqual(input);
    });

    it('using the offset function', function() {
      var slice = Join
        .selectFrom(input)
        .offset(0)
        .execute();
      expect(slice).toEqual(input);
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
      expect(slice).toEqual([]);
    });

    it('using the limit function', function() {
      var slice = Join
        .selectFrom(input)
        .limit(0)
        .execute();
      expect(slice).toEqual([]);
    });

    it('using the offset function', function() {
      var slice = Join
        .selectFrom(input)
        .offset(input.length)
        .execute();
      expect(slice).toEqual([]);
    });

  });
});
