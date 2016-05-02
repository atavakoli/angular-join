describe('selecting', function() {
  var Join;

  beforeEach(module('angular-join'));
  beforeEach(inject(function(_Join_) {
    Join = _Join_;
  }));

  var input = [
    { x: 1, y: 1, z: 1 },
    { x: 2, y: 2, z: 2 },
    { x: 3, y: 3, z: 3 }
  ];

  var inputX = [
    { x: 1 },
    { x: 2 },
    { x: 3 }
  ];

  var inputXY = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 }
  ];

  var inputXSquared = [
    { x: 1 },
    { x: 4 },
    { x: 9 }
  ];

  describe('should work using selectFrom', function() {
    it('with strings', function() {
      var select = Join
        .selectFrom(input, 'x')
        .execute();
      expect(select).toEqual(inputX);
    });

    it('with arrays', function() {
      var select = Join
        .selectFrom(input, ['x', 'y'])
        .execute();
      expect(select).toEqual(inputXY);
    });

    it('with functions', function() {
      var select = Join
        .selectFrom(input, function(e) {
          return {x: e.x * e.x };
        })
        .execute();
      expect(select).toEqual(inputXSquared);
    });

  });

  describe('should work using select', function() {
    it('with strings', function() {
      var select = Join
        .selectFrom(input)
        .select('x')
        .execute();
      expect(select).toEqual(inputX);
    });

    it('with arrays', function() {
      var select = Join
        .selectFrom(input)
        .select(['x', 'y'])
        .execute();
      expect(select).toEqual(inputXY);
    });

    it('with functions', function() {
      var select = Join
        .selectFrom(input)
        .select(function(e) {
          return {x: e.x * e.x };
        })
        .execute();
      expect(select).toEqual(inputXSquared);
    });

  });

  describe('should work using map', function() {
    it('with strings', function() {
      var select = Join
        .selectFrom(input)
        .map('x')
        .execute();
      expect(select).toEqual(inputX);
    });

    it('with arrays', function() {
      var select = Join
        .selectFrom(input)
        .map(['x', 'y'])
        .execute();
      expect(select).toEqual(inputXY);
    });

    it('with functions', function() {
      var select = Join
        .selectFrom(input)
        .map(function(e) {
          return {x: e.x * e.x };
        })
        .execute();
      expect(select).toEqual(inputXSquared);
    });

  });

});
