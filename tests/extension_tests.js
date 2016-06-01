var chai   = require('chai'),
    helpers = require('./helpers.js'),
    expect = chai.expect,
    nock = require('nock'),
    dom;

before(function(done){
  helpers.buildDom(function(window){
    dom = window;
    done();
  })
});

beforeEach(function(done){
  nock.cleanAll();

  done();
})

describe('Wiremock pop view', function(){

  it('should have a frame size of 485x675px', function(done){
    expect(dom.$('body').height()).to.equal(675);
    expect(dom.$('body').width()).to.equal(485);

    done();
  });

  it('should have a input box for entering paths', function(done){
    expect(dom.$('input[name="requestPath"]').length).to.equal(1);

    done();
  });

  it('should have a dropdown to select path type', function(done){
    expect(dom.$('select[name="requestType"]').length).to.equal(1);

    done();
  });

});

describe('Wiremock integration check', function(){

  it('should be able to submit a simple GET request', function(done){
    dom.$('input[name="requestPath"]').val('/path/test/1');
    dom.$('select[name="requestType"]').val('PATH');
    dom.$('#makeRequest').click();

    nock('http://localhost:8080')
      .post('/__admin/mappings/new',function(body){
        expect(body.request.url).to.equal('/path/test/1');
        done();
      })
      .reply(201);
  });

})
