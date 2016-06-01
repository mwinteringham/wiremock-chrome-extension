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

describe('Wiremock chrome extension', function(){

  it('should have a passing check', function(done){
    dom.$('#makeRequest').click();
    expect(dom.$('#result').text()).to.equal('success');

    done();
  });

  it('should have a frame size of 485x675px', function(done){
    expect(dom.$('body').height()).to.equal(675);
    expect(dom.$('body').width()).to.equal(485);
    
    done();
  });

  it('should have a input box for entering paths', function(done){
    expect(dom.$('input[name="requestPath"]').length).to.equal(1);

    done();
  });

});
