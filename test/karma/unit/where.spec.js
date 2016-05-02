describe('filtering', function() {
  var Join;

  beforeEach(module('angular-join'));
  beforeEach(inject(function(_Join_) {
    Join = _Join_;
  }));

  var input = [
    { x: 1 },
    { x: 2 },
    { x: 3 }
  ];

  var filteredInput = [
    { x: 2 },
    { x: 3 }
  ];

  function filter(e) {
    return e.x > 1;
  };

  it('should work using where', function() {
    var filtered = Join
      .selectFrom(input)
      .where(filter)
      .execute();
    expect(filtered).toEqual(filteredInput);
  });

  it('should work using having', function() {
    var filtered = Join
      .selectFrom(input)
      .having(filter)
      .execute();
    expect(filtered).toEqual(filteredInput);
  });

  it('should work using filter', function() {
    var filtered = Join
      .selectFrom(input)
      .filter(filter)
      .execute();
    expect(filtered).toEqual(filteredInput);
  });

});
