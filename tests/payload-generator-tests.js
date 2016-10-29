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
      dom.buildPayload('/path/test/1', 'PATH', 'GET', [], [], null, function(payload){
        expect(payload.request.url).to.equal('/path/test/1');

        done();
      });
  });

  it('should generate a payload with a regex matching path', function(done){
    dom.buildPayload('/thing/matching/[0-9]+', 'REGEX', 'GET', [], [], null, function(payload){
      expect(payload.request.urlPattern).to.equal('/thing/matching/[0-9]+');

      done();
    });
  });

  it('should generate a payload with a partial matching path', function(done){
    dom.buildPayload('/thing', 'PARTIAL', 'GET', [], [], null, function(payload){
      expect(payload.request.urlPath).to.equal('/thing');

      done();
    });
  });

  it('should generate a payload with a http method', function(done){
    dom.buildPayload('/thing', 'PATH', 'GET', [], [], null, function(payload){
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

    dom.buildPayload('/thing', 'PATH', 'GET', [], headerMatchersPayload, null, function(payload){
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

    dom.buildPayload('/thing', 'PATH', 'GET', queryStringMatchersPayload, [], null, function(payload){
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

    dom.buildPayload('/thing', 'PATH', 'POST', [], [], generatedPayload, function(payload){
      expect(payload.request.bodyPatterns[0].equalToJson).to.deep.equal(generatedPayload);
    });

    done();
  });

  it('should generate a matchesJsonPath payload when provided a JSON path', function(done){
    var jsonPath = "$.things[?(@.name == 'RequiredThing')]";

    dom.buildPayload('/thing', 'PATH', 'POST', [], [], jsonPath, function(payload){
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

    dom.buildPayload('/thing', 'PATH', 'POST', [], [], xmlPath, function(payload){
      expect(payload.request.bodyPatterns[0].equalToXml).to.equal(xmlPath);
    });

    done();
  });

  it('should generate a matchesXPath payload when provided an Xpath', function(done){
    var xPath = "/todo-list[count(todo-item) = 3]"

    dom.buildPayload('/thing', 'PATH', 'POST', [], [], xPath, function(payload){
      expect(payload.request.bodyPatterns[0].matchesXPath).to.equal(xPath);
    });

    done();
  });

});
