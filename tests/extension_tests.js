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
    expect(dom.$('#requestPath').length).to.equal(1);

    done();
  });

  it('should have a dropdown to select path type', function(done){
    expect(dom.$('#requestType').length).to.equal(1);

    done();
  });

  it('should have a dropdown to select the request method', function(done){
    expect(dom.$('#requestMethod').length).to.equal(1);

    done();
  });

  it('should have a single entry to create a matching header', function(done){
    expect(dom.$('.headerMatcher').length).to.equal(1);
    expect(dom.$('.headerMatcher .delete').length).to.equal(0);

    done();
  });

  it('should create an additional request header entry when I click a header field', function(done) {
    dom.$('#requestHeaders #blankRequestHeader .key').click();
    dom.$('#requestHeaders #blankRequestHeader .value').click();

    expect(dom.$('.headerMatcher').length).to.equal(3);
    expect(dom.$('.headerMatcher a').length).to.equal(3);
    expect(dom.$('#blankRequestHeader').length).to.equal(1);

    dom.$('.headerMatcher a')[0].click();
    dom.$('.headerMatcher a')[0].click();

    done();
  });

  it('should delete a request header when clicking on the delete button', function(done){
    dom.$('#requestHeaders #blankRequestHeader .key').click();

    dom.$('.headerMatcher a')[0].click();
    expect(dom.$('.headerMatcher').length).to.equal(1);
    expect(dom.$('.headerMatcher a').length).to.equal(0);

    done();
  });

});

describe('Wiremock integration check', function(){

  it('should be able to submit a simple GET request', function(done){
    dom.$('#requestPath').val('/path/test/1');
    dom.$('#requestType').val('PATH');
    dom.$('#requestMethod').val('POST');
    dom.$('#makeRequest').click();

    nock('http://localhost:8080')
      .post('/__admin/mappings/new',function(body){
        expect(body.request.url).to.equal('/path/test/1');
        expect(body.request.method).to.equal('POST');
        done();
      })
      .reply(201);
  });

})
