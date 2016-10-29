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
      dom.buildPayload('/path/test/1', 'PATH', 'GET', 1, [], [], null, 200, function(payload){
        expect(payload.request.url).to.equal('/path/test/1');

        done();
      });
  });

  it('should generate a payload with a regex matching path', function(done){
    dom.buildPayload('/thing/matching/[0-9]+', 'REGEX', 'GET', 1, [], [], null, 200, function(payload){
      expect(payload.request.urlPattern).to.equal('/thing/matching/[0-9]+');

      done();
    });
  });

  it('should generate a payload with a partial matching path', function(done){
    dom.buildPayload('/thing', 'PARTIAL', 'GET', 1, [], [], null, 200, function(payload){
      expect(payload.request.urlPath).to.equal('/thing');

      done();
    });
  });

  it('should generate a payload with a http method', function(done){
    dom.buildPayload('/thing', 'PATH', 'GET', 1, [], [], null, 200, function(payload){
      expect(payload.request.method).to.equal('GET');

      done();
    });
  });

  it('should generate a payload with headers', function(done) {
    var headerMatchersPayload = [
      {
        'key': 'key1',
        'matcher': 'equalTo',
        'value': 'value1'
      },{
        'key': 'key2',
        'matcher': 'matches',
        'value': 'value2'
      },{
        'key': 'key3',
        'matcher': 'doesNotMatch',
        'value': 'value3'
      },{
        'key': 'key4',
        'matcher': 'contains',
        'value': 'value4'
      }
    ];

    dom.buildPayload('/thing', 'PATH', 'GET', 1, [], headerMatchersPayload, null, 200, function(payload){
      expect(payload.request.headers['key1']['equalTo']).to.equal('value1');
      expect(payload.request.headers['key2']['matches']).to.equal('value2');
      expect(payload.request.headers['key3']['doesNotMatch']).to.equal('value3');
      expect(payload.request.headers['key4']['contains']).to.equal('value4');

      done();
    });

  });

  it('should generate a payload with query strings matchers', function(done) {
    var queryStringMatchersPayload = [
      {
        'key': 'key1',
        'matcher': 'equalTo',
        'value': 'value1'
      },{
        'key': 'key2',
        'matcher': 'matches',
        'value': 'value2'
      },{
        'key': 'key3',
        'matcher': 'doesNotMatch',
        'value': 'value3'
      },{
        'key': 'key4',
        'matcher': 'contains',
        'value': 'value4'
      }
    ];

    dom.buildPayload('/thing', 'PATH', 'GET', 1, queryStringMatchersPayload, [], null, 200, function(payload){
      expect(payload.request.queryParameters['key1']['equalTo']).to.equal('value1');
      expect(payload.request.queryParameters['key2']['matches']).to.equal('value2');
      expect(payload.request.queryParameters['key3']['doesNotMatch']).to.equal('value3');
      expect(payload.request.queryParameters['key4']['contains']).to.equal('value4');

      done();
    });

  });

  it('should generate an equalToJson payload when provided a JSON payload', function(done){
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

    dom.buildPayload('/thing', 'PATH', 'POST', 1, [], [], generatedPayload, 200, function(payload){
      expect(payload.request.bodyPatterns[0].equalToJson).to.deep.equal(generatedPayload);
    });

    done();
  });

  it('should generate a matchesJsonPath payload when provided a JSON path', function(done){
    var jsonPath = "$.things[?(@.name == 'RequiredThing')]";

    dom.buildPayload('/thing', 'PATH', 'POST', 1, [], [], jsonPath, 200, function(payload){
      expect(payload.request.bodyPatterns[0].matchesJsonPath).to.equal(jsonPath);
    });

    done();
  });

  it('should generate a equalToXml payload when provided a XML payload', function(done){
    var xmlPath = "<total_results>4</total_results>" +
                   "<array_result>" +
                   "<result>1</result>" +
                   "<result>2</result>" +
                   "<array_result>";

    dom.buildPayload('/thing', 'PATH', 'POST', 1, [], [], xmlPath, 200, function(payload){
      expect(payload.request.bodyPatterns[0].equalToXml).to.equal(xmlPath);
    });

    done();
  });

  it('should generate a matchesXPath payload when provided an Xpath', function(done){
    var xPath = "/todo-list[count(todo-item) = 3]"

    dom.buildPayload('/thing', 'PATH', 'POST', 1, [], [], xPath, 200, function(payload){
      expect(payload.request.bodyPatterns[0].matchesXPath).to.equal(xPath);
    });

    done();
  });

  it('should generate a response status code when provided a status code', function(done){
    var statusCode = 200;

    dom.buildPayload('/thing', 'PATH', 'POST', 1, [], [], null, statusCode, function(payload){
      expect(payload.response.status).to.equal(statusCode);
    });

    done();
  });

  it('should generate a priority when provided a priority number', function(done) {
    var priority = "1";

    dom.buildPayload('/thing', 'PATH', 'POST', priority, [], [], null, 200, function(payload){
      expect(payload.priority).to.equal(priority);
    });

    done();
  });

  it('should generate a default priority when not provided a priority number', function(done) {
    dom.buildPayload('/thing', 'PATH', 'POST', '', [], [], null, 200, function(payload){
      expect(payload.priority).to.equal('1');
    });

    done();
  });

});
