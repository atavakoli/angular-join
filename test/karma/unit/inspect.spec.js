describe('inspecting', function() {
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

  it('should return a query object', function() {
    var query = Join.selectFrom(input);
    var inspectQuery = query.inspect(function() {})
    expect(inspectQuery).toEqual(jasmine.any(query.constructor));
  });

  it("should present the previous operation's result", function() {
    var spy = jasmine.createSpy('spy');

    var query = Join
      .selectFrom(input)
      .inspect(function(inspected) {
        spy();
        expect(inspected).toEqual(input);
      })
      .select(function(e) { return { x: e.x * 2 }; })
      .inspect(function(inspected) {
        spy();
        expect(inspected).toEqual([
          { x: 2 },
          { x: 4 },
          { x: 6 }
        ]);
      })
      .execute();

    expect(spy.calls.count()).toEqual(2);
  });

});
