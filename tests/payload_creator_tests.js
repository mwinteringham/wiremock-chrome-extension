var chai   = require('chai'),
    helpers = require('./helpers.js'),
    expect = chai.expect,
    dom;

before(function(done){
  helpers.buildDom(function(window){
    dom = window;
    done();
  })
});

describe('Generate payload function', function(){

  it('Should generate a payload with a standard payload', function(done){
      dom.buildPayload('/path/test/1', function(payload){
        expect(payload.request.url).to.equal('/path/test/1');

        done();
      });
  });

});
