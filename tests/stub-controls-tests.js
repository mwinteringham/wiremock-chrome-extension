var chai   = require('chai'),
    helpers = require('./helpers.js'),
    expect = chai.expect,
    request = require('request'),
    nock = require('nock'),
    dom;

beforeEach(function(done){
  helpers.buildDom(function(window){
    dom = window;

    nock.cleanAll();

    done();
  })
})

describe('Wiremock extension - stub view controls', function(){

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
    expect(dom.$('.requestHeader').length).to.equal(1);
    expect(dom.$('.requestHeader .delete').length).to.equal(0);

    done();
  });

  it('should create an additional request header entry when I focus on a header field', function(done) {
    dom.$('#blankRequestHeader .key').focus();
    dom.$('#blankRequestHeader .value').focus();

    expect(dom.$('.requestHeader').length).to.equal(3);
    expect(dom.$('.requestHeader a').length).to.equal(2);
    expect(dom.$('#blankRequestHeader').length).to.equal(1);

    done();
  });

  it('should delete a request header when clicking on the delete button', function(done){
    dom.$('#blankRequestHeader .key').focus();

    dom.$('.requestHeader a')[0].click();
    expect(dom.$('.requestHeader').length).to.equal(1);
    expect(dom.$('.requestHeader a').length).to.equal(0);

    done();
  });

  it('should have a single entry to create a matching query string', function(done){
    expect(dom.$('.queryStringMatcher').length).to.equal(1);
    expect(dom.$('.queryStringMatcher .delete').length).to.equal(0);

    done();
  });

  it('should create an additional request query string entry when I focus on a query string field', function(done) {
    dom.$('#blankQueryString .key').focus();
    dom.$('#blankQueryString .value').focus();

    expect(dom.$('.queryStringMatcher').length).to.equal(3);
    expect(dom.$('.queryStringMatcher a').length).to.equal(2);
    expect(dom.$('#blankQueryString').length).to.equal(1);

    dom.$('.queryStringMatcher a')[0].click();
    dom.$('.queryStringMatcher a')[0].click();

    done();
  });

  it('should delete a request header when clicking on the delete button', function(done){
    dom.$('#blankQueryString .key').focus();

    dom.$('.queryStringMatcher a')[0].click();
    expect(dom.$('.queryStringMatcher').length).to.equal(1);
    expect(dom.$('.queryStringMatcher a').length).to.equal(0);

    done();
  });

  it('should have a text box to add a request payload matcher', function(done){
    expect(dom.$('.requestPayload textarea').length).to.equal(1);

    done();
  });

  it('should create an additional request payload matcher', function(done){
    dom.$('.requestPayload textarea').focus();

    expect(dom.$('.requestPayload').length).to.equal(2);

    done();
  });

  it('should delete a request payload matcher when clicking on the delete button', function(done){
    dom.$('.requestPayload textarea').focus();

    dom.$('.requestPayload a')[0].click();
    expect(dom.$('.requestPayload').length).to.equal(1);
    expect(dom.$('.requestPayload a').length).to.equal(0);

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

  it('should have a single entry to create a response header', function(done){
    expect(dom.$('.responseHeader').length).to.equal(1);
    expect(dom.$('.responseHeader .delete').length).to.equal(0);

    done();
  });

  it('should create an additional response header entry when I focus on a response header', function(done) {
    dom.$('#blankResponseHeader .key').focus();
    dom.$('#blankResponseHeader .value').focus();

    expect(dom.$('.responseHeader').length).to.equal(3);
    expect(dom.$('.responseHeader a').length).to.equal(2);
    expect(dom.$('#blankResponseHeader').length).to.equal(1);

    dom.$('.responseHeader a')[0].click();
    dom.$('.responseHeader a')[0].click();

    done();
  });

  it('should delete a request header when clicking on the delete button', function(done){
    dom.$('#blankResponseHeader .key').focus();

    dom.$('.responseHeader a')[0].click();
    expect(dom.$('.responseHeader').length).to.equal(1);
    expect(dom.$('.responseHeader a').length).to.equal(0);

    done();
  });

  it('should have a textbox to add a response payload', function(done){
    expect(dom.$('#responsePayload').length).to.equal(1);

    done();
  });

});

describe('Wiremock extension - stub view edit controls', function(){

  it('should turn into edit mode on submission of a succesful stub', function(done){
    this.timeout(3000);

    dom.$('#requestPath').val('/path/test/1');
    dom.$('#statusCode').val('200');
    dom.$('#makeRequest').click();

    setTimeout(function(){
      expect(dom.$('#newForm').text()).to.equal('Create new stub');
      expect(dom.$('#status').text()).to.equal('Stub created')
      expect(dom.$('#editId').val().length).to.not.equal(0);

      done();
    }, 2000);
  });

  it('should update a previously created stub when submitting an update', function(done){
    this.timeout(5000);

    dom.$('#newForm').click();

    dom.$('#requestPath').val('/path/test/1');
    dom.$('#statusCode').val('200');
    dom.$('#makeRequest').click();

    setTimeout(function(){
        var id = dom.$('#editId').val();

        dom.$('#requestPath').val('/path/test/2');
        dom.$('#statusCode').val('400');
        dom.$('#makeRequest').click();

        setTimeout(function(){
          request('http://localhost:8080/__admin/mappings/' + id, function(error, response, body){
            var parsedBody = JSON.parse(body);
            expect(parsedBody.request.url).to.equal('/path/test/2');
            expect(parsedBody.response.status).to.equal(400);
            done();
          })
        }, 2000)
    }, 2000)
  });

});

describe('Wiremock stub integration check', function(){

  it('should be able to submit a simple GET request', function(done){
    dom.$('#requestPath').val('/path/test/1');
    dom.$('#requestType').val('PATH');
    dom.$('#requestMethod').val('POST');
    dom.$('#priority').val('1');

    dom.$('.queryStringMatcher .key').val('key1');
    dom.$('.queryStringMatcher .matcher').val('equalTo');
    dom.$('.queryStringMatcher .value').val('value1');

    dom.$('#blankQueryString .key').focus();

    dom.$('.queryStringMatcher .key').eq(1).val('key2');
    dom.$('.queryStringMatcher .matcher').eq(1).val('matches');
    dom.$('.queryStringMatcher .value').eq(1).val('value2');

    dom.$('.requestHeader .key').val('key1');
    dom.$('.requestHeader .matcher').val('equalTo');
    dom.$('.requestHeader .value').val('value1');

    dom.$('#blankRequestHeader .key').focus();

    dom.$('.requestHeader .key').eq(1).val('key2');
    dom.$('.requestHeader .matcher').eq(1).val('matches');
    dom.$('.requestHeader .value').eq(1).val('value2');

    var generatedPayload = JSON.stringify({
      "total_results": 4,
      "array_result": [
        {
          "result": 1
        },{
          "result": 2
        }
      ]
    });

    dom.$('.requestPayload textarea').val(generatedPayload)

    dom.$('#blankRequestPayload textarea').focus();

    var xmlPath = "<total_results>4</total_results>" +
                   "<array_result>" +
                   "<result>1</result>" +
                   "<result>2</result>" +
                   "<array_result>";

    dom.$('.requestPayload textarea').eq(1).val(xmlPath)

    dom.$('#statusCode').val('200');

    dom.$('.responseHeader .key').val('key1');
    dom.$('.responseHeader .value').val('value1');

    dom.$('#blankResponseHeader .key').focus();

    dom.$('.responseHeader .key').eq(1).val('key2');
    dom.$('.responseHeader .value').eq(1).val('value2');

    var generatedPayload2 = JSON.stringify({
      "total_results": 2,
      "array_result": [
        {
          "result": "a"
        },{
          "result": "b"
        }
      ]
    });

    dom.$('#responsePayload').val(generatedPayload2);

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
        expect(body.request.bodyPatterns[1].equalToXml).to.equal(xmlPath);
        expect(body.response.status).to.equal('200');
        expect(body.response.headers['key1']).to.equal('value1');
        expect(body.response.headers['key2']).to.equal('value2');
        expect(body.response.body).to.deep.equal(generatedPayload2);
        done();
      })
      .reply(201);
  });

})
