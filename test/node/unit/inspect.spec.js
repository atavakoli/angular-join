describe('inspecting', function() {
  var chai = require('chai');
  var sinon = require('sinon');
  chai.use(require('sinon-chai'));
  var expect = chai.expect;

  var Join = require('../../../angular-join.js');

  var input = [
    { x: 1 },
    { x: 2 },
    { x: 3 }
  ];

  it('should return a query object', function() {
    var query = Join.selectFrom(input);
    var inspectQuery = query.inspect(function() {})
    expect(inspectQuery).to.be.an.instanceof(query.constructor);
  });

  it("should present the previous operation's result", function() {
    var spy = sinon.spy();

    var query = Join
      .selectFrom(input)
      .inspect(function(inspected) {
        spy();
        expect(inspected).to.eql(input);
      })
      .select(function(e) { return { x: e.x * 2 }; })
      .inspect(function(inspected) {
        spy();
        expect(inspected).to.eql([
          { x: 2 },
          { x: 4 },
          { x: 6 }
        ]);
      })
      .execute();

    expect(spy).to.have.been.calledTwice;
  });

});
