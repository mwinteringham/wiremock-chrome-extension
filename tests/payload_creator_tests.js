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

  it('should generate a payload with a standard path', function(done){
      dom.buildPayload('/path/test/1', 'PATH', function(payload){
        expect(payload.request.url).to.equal('/path/test/1');

        done();
      });
  });

  it('should generate a payload with a regex matching path', function(done){
    dom.buildPayload('/thing/matching/[0-9]+', 'REGEX', function(payload){
      expect(payload.request.urlPattern).to.equal('/thing/matching/[0-9]+');

      done();
    });
  });

  it('should generate a payload with a partial matching path', function(done){
    dom.buildPayload('/thing', 'PARTIAL', function(payload){
      expect(payload.request.urlPath).to.equal('/thing');

      done();
    });
  })

});
