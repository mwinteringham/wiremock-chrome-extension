var chai   = require('chai'),
    helpers = require('./helpers.js'),
    expect = chai.expect,
    exec = require('child_process').exec,
    dom, child;

beforeEach(function(done){
  helpers.buildDom(function(window){
    dom = window;
    done();
  })
});

describe('Wiremock extension - mapping view controls', function(){

  it('should render a list of current mappings stored in wiremock', function(done){
    dom.$('#mappingControl').click();

    setTimeout(function(){
        expect(dom.$('#mappings > li:nth-child(1) .mappingTitle').text()).to.equal('POST /some/thing/else - 400');
        expect(dom.$('#mappings > li:nth-child(2) .mappingTitle').text()).to.equal('GET /some/thing - 200');
        done();
    }, 1000);
  });

  it('should render JSON details for a mapping when clicking on a mapping entry', function(done){
    dom.$('#mappingControl').click();

    setTimeout(function(){
      dom.$('#mappings > li:nth-child(1) .mappingTitle').click();

      expect(dom.$('#mappings > li:nth-child(1) .mappingDetails:visible').length).to.equal(1);
      done();
    }, 1000);
  });

  it('should hide JSON details for a mapping when clicking twice on a mapping entry', function(done){
    dom.$('#mappingControl').click();

    setTimeout(function(){
      dom.$('#mappings > li:nth-child(1) .mappingTitle').click();
      dom.$('#mappings > li:nth-child(1) .mappingTitle').click();

      expect(dom.$('#mappings > li:nth-child(1) .mappingDetails:visible').length).to.equal(0);
      done();
    }, 1000);
  });

  it('should delete a mapping when clicking on the delete button', function(done){
    this.timeout(3000);

    dom.$('#mappingControl').click();
    setTimeout(function(){
      dom.$('#mappings > li:nth-child(1) .deleteMapping').click();
      setTimeout(function(){
        expect(dom.$('#mappings .mappingTitle').length).to.equal(2);
        done();
      }, 1000);
    }, 1000)
  });

  it('should move to edit stub view when selecting edit for a mapping', function(done){
    this.timeout(3000);

    dom.$('#mappingControl').click();

    setTimeout(function(){
      var id = dom.$('#mappings > li:nth-child(2) a').attr('href').split('/')[1];
      dom.$('#mappings > li:nth-child(2) .editMapping').click();

      setTimeout(function(){
        expect(dom.$('#stubView:visible').length).to.equal(1);

        // Request values
        expect(dom.$('#requestPath').val()).to.equal('/new/mapping');
        expect(dom.$('#requestType').val()).to.equal('PARTIAL');
        expect(dom.$('#requestMethod').val()).to.equal('PUT');
        expect(dom.$('#priority').val()).to.equal('2');

        // Query string matcher values
        var queryStringRows = dom.$('#form > .queryStringMatcher .key').map(function(){return dom.$(this).val();}).get();
        var queryStringMatchers = dom.$('#form > .queryStringMatcher .matcher').map(function(){return dom.$(this).val();}).get();
        var queryStringValues = dom.$('#form > .queryStringMatcher .value').map(function(){return dom.$(this).val();}).get();

        expect(queryStringRows[0]).to.equal('query1');
        expect(queryStringMatchers[0]).to.equal('equalTo');
        expect(queryStringValues[0]).to.equal('abc');
        expect(queryStringRows[1]).to.equal('query2');
        expect(queryStringMatchers[1]).to.equal('matches');
        expect(queryStringValues[1]).to.equal('def');
        expect(queryStringRows[2]).to.equal('query3');
        expect(queryStringMatchers[2]).to.equal('doesNotMatch');
        expect(queryStringValues[2]).to.equal('ghi');
        expect(queryStringRows[3]).to.equal('query4');
        expect(queryStringMatchers[3]).to.equal('contains');
        expect(queryStringValues[3]).to.equal('jkl');

        // Headers matcher values
        expect(dom.$('#requestHeaders > li:nth-child(1) .key').val()).to.equal('header1');
        expect(dom.$('#requestHeaders > li:nth-child(1) .matcher').val()).to.equal('equalTo');
        expect(dom.$('#requestHeaders > li:nth-child(1) .value').val()).to.equal('123');
        expect(dom.$('#requestHeaders > li:nth-child(2) .key').val()).to.equal('header2');
        expect(dom.$('#requestHeaders > li:nth-child(2) .matcher').val()).to.equal('matches');
        expect(dom.$('#requestHeaders > li:nth-child(2) .value').val()).to.equal('456');
        expect(dom.$('#requestHeaders > li:nth-child(3) .key').val()).to.equal('header3');
        expect(dom.$('#requestHeaders > li:nth-child(3) .matcher').val()).to.equal('doesNotMatch');
        expect(dom.$('#requestHeaders > li:nth-child(3) .value').val()).to.equal('789');
        expect(dom.$('#requestHeaders > li:nth-child(4) .key').val()).to.equal('header4');
        expect(dom.$('#requestHeaders > li:nth-child(4) .matcher').val()).to.equal('contains');
        expect(dom.$('#requestHeaders > li:nth-child(4) .value').val()).to.equal('135');

        // Request body matcher value
        expect(dom.$('#requestPayload').val()).to.equal('{\n \"body\":\"matcher\"\n}');

        // Response values
        expect(dom.$('#responseHeaders > li:nth-child(1) .key').val()).to.equal('responseheader1');
        expect(dom.$('#responseHeaders > li:nth-child(1) .value').val()).to.equal('abc');

        expect(dom.$('#statusCode').val()).to.equal('200');
        expect(dom.$('#responsePayload').val()).to.equal('{\n \"response\":\"body\"\n}');

        expect(dom.$('#makeRequest').val()).to.equal('Update');
        expect(dom.$('#newForm').val()).to.equal('New stub');
        expect(dom.$('#editId').val()).to.equal(id);

        done();
      }, 1000);
    }, 1000);
  });

});
