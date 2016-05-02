describe('selecting', function() {
  var expect = require('chai').expect;

  var Join = require('../../../angular-join');

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
      expect(select).to.eql(inputX);
    });

    it('with arrays', function() {
      var select = Join
        .selectFrom(input, ['x', 'y'])
        .execute();
      expect(select).to.eql(inputXY);
    });

    it('with functions', function() {
      var select = Join
        .selectFrom(input, function(e) {
          return {x: e.x * e.x };
        })
        .execute();
      expect(select).to.eql(inputXSquared);
    });

  });

  describe('should work using select', function() {
    it('with strings', function() {
      var select = Join
        .selectFrom(input)
        .select('x')
        .execute();
      expect(select).to.eql(inputX);
    });

    it('with arrays', function() {
      var select = Join
        .selectFrom(input)
        .select(['x', 'y'])
        .execute();
      expect(select).to.eql(inputXY);
    });

    it('with functions', function() {
      var select = Join
        .selectFrom(input)
        .select(function(e) {
          return {x: e.x * e.x };
        })
        .execute();
      expect(select).to.eql(inputXSquared);
    });

  });

  describe('should work using map', function() {
    it('with strings', function() {
      var select = Join
        .selectFrom(input)
        .map('x')
        .execute();
      expect(select).to.eql(inputX);
    });

    it('with arrays', function() {
      var select = Join
        .selectFrom(input)
        .map(['x', 'y'])
        .execute();
      expect(select).to.eql(inputXY);
    });

    it('with functions', function() {
      var select = Join
        .selectFrom(input)
        .map(function(e) {
          return {x: e.x * e.x };
        })
        .execute();
      expect(select).to.eql(inputXSquared);
    });

  });

});
