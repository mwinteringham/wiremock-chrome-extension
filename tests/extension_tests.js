var chai   = require('chai'),
    jsdom  = require('jsdom'),
    path   = require('path'),
    expect = chai.expect;

var buildDom = function(callback){
  jsdom.env({
    file: path.join(__dirname, '../src/index.html'),
    scripts: ['http://code.jquery.com/jquery-1.11.2.min.js'],
    features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
    },
    done: function(errors, window){
      if(errors != null) console.log('Errors', errors);

      callback(window);
    }
  });
}

describe('Wiremock chrome extension', function(){

  it('should have a passing check', function(done){
      buildDom(function(dom){
        dom.$('#makeRequest').click();
        expect(dom.$('#result').text()).to.equal('success');

        done();
      })
  });

  it('should have a frame size of 485x675px', function(done){
    buildDom(function(dom){
      expect(dom.$('body').height()).to.equal(675);
      expect(dom.$('body').width()).to.equal(485);
      done();
    })
  });

  it('should have a input box for entering paths', function(done){
    buildDom(function(dom){
      expect(dom.$('input[name="requestPath"]').length).to.equal(1);
      done();
    })
  });

});
