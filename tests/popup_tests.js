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

describe('Wiremock popup view', function(){

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

  it('should create an additional request header entry when I focus on a header field', function(done) {
    dom.$('#requestHeaders #blankRequestHeader .key').focus();
    dom.$('#requestHeaders #blankRequestHeader .value').focus();

    expect(dom.$('.headerMatcher').length).to.equal(3);
    expect(dom.$('.headerMatcher a').length).to.equal(3);
    expect(dom.$('#blankRequestHeader').length).to.equal(1);

    dom.$('.headerMatcher a')[0].click();
    dom.$('.headerMatcher a')[0].click();

    done();
  });

  it('should delete a request header when clicking on the delete button', function(done){
    dom.$('#requestHeaders #blankRequestHeader .key').focus();

    dom.$('.headerMatcher a')[0].click();
    expect(dom.$('.headerMatcher').length).to.equal(1);
    expect(dom.$('.headerMatcher a').length).to.equal(0);

    done();
  });

  it('should have a single entry to create a matching query string', function(done){
    expect(dom.$('.queryStringMatcher').length).to.equal(1);
    expect(dom.$('.queryStringMatcher .delete').length).to.equal(0);

    done();
  });

  it('should create an additional request query string entry when I focus on a query string field', function(done) {
    dom.$('#requestQueryString #blankQueryString .key').focus();
    dom.$('#requestQueryString #blankQueryString .value').focus();

    expect(dom.$('.queryStringMatcher').length).to.equal(3);
    expect(dom.$('.queryStringMatcher a').length).to.equal(3);
    expect(dom.$('#blankQueryString').length).to.equal(1);

    dom.$('.queryStringMatcher a')[0].click();
    dom.$('.queryStringMatcher a')[0].click();

    done();
  });

  it('should delete a request header when clicking on the delete button', function(done){
    dom.$('#requestQueryString #blankQueryString .key').focus();

    dom.$('.queryStringMatcher a')[0].click();
    expect(dom.$('.queryStringMatcher').length).to.equal(1);
    expect(dom.$('.queryStringMatcher a').length).to.equal(0);

    done();
  });

  it('should have a text box to add a payload matcher', function(done){
    expect(dom.$('#requestPayload').length).to.equal(1);

    done();
  });

  it('should have a text box to enter a status code', function(done){
    expect(dom.$('#statusCode').length).to.equal(1);

    done();
  });

  it('should have a text box to enter priority for the stub', function(done){
    expect(dom.$('#priority').length).to.equal(1);

    done();
  });

});

describe('Wiremock integration check', function(){

  it('should be able to submit a simple GET request', function(done){
    dom.$('#requestPath').val('/path/test/1');
    dom.$('#requestType').val('PATH');
    dom.$('#requestMethod').val('POST');
    dom.$('#priority').val('1');

    dom.$('.queryStringMatcher .key').val('key1');
    dom.$('.queryStringMatcher .matcher').val('equalTo');
    dom.$('.queryStringMatcher .value').val('value1');

    dom.$('#requestQueryString #blankQueryString .key').focus();

    dom.$('.queryStringMatcher .key').eq(1).val('key2');
    dom.$('.queryStringMatcher .matcher').eq(1).val('matches');
    dom.$('.queryStringMatcher .value').eq(1).val('value2');

    dom.$('.headerMatcher .key').val('key1');
    dom.$('.headerMatcher .matcher').val('equalTo');
    dom.$('.headerMatcher .value').val('value1');

    dom.$('#requestHeaders #blankRequestHeader .key').focus();

    dom.$('.headerMatcher .key').eq(1).val('key2');
    dom.$('.headerMatcher .matcher').eq(1).val('matches');
    dom.$('.headerMatcher .value').eq(1).val('value2');

    var generatedPayload = JSON.stringify({
      "total_results": 4,
      "array_result": [
        {
          "result": 1
        },{
          "result": 2
        }
      ]
    })

    dom.$('#requestPayload').val(generatedPayload);

    dom.$('#statusCode').val('200');

    dom.$('#makeRequest').click();

    nock('http://localhost:8080')
      .post('/__admin/mappings/new',function(body){
        expect(body.request.url).to.equal('/path/test/1');
        expect(body.request.method).to.equal('POST');
        expect(body.priority).to.equal('1');
        expect(body.request.queryParameters['key1']['equalTo']).to.equal('value1');
        expect(body.request.queryParameters['key2']['matches']).to.equal('value2');
        expect(body.request.headers['key1']['equalTo']).to.equal('value1');
        expect(body.request.headers['key2']['matches']).to.equal('value2');
        expect(body.request.bodyPatterns[0].equalToJson).to.deep.equal(generatedPayload);
        expect(body.response.status).to.equal('200');
        done();
      })
      .reply(201);
  });

})
