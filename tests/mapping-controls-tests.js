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
      var mappingRows = dom.$('.mapping .mappingTitle').map(function(){return dom.$(this).text();}).get();

      expect(mappingRows[0]).to.equal('   POST      /some/thing/else      400    ');
      expect(mappingRows[1]).to.equal('   GET      /some/thing      200    ');
      done();
    }, 1000);
  });

  it('should render JSON details for a mapping when clicking on a mapping entry', function(done){
    this.timeout(3000);

    dom.$('#mappingControl').click();

    setTimeout(function(){
      dom.$('.mappingTitle')[0].click();
      expect(dom.$('.mappingDetails:visible').length).to.equal(1);
      done();
    }, 1000);
  });

  it('should hide JSON details for a mapping when clicking twice on a mapping entry', function(done){
    this.timeout(3000);

    dom.$('#mappingControl').click();

    setTimeout(function(){
      dom.$('.mapping')[0].click();
      dom.$('.mapping')[0].click();

      expect(dom.$('.mappingDetails:visible').length).to.equal(0);
      done();
    }, 1000);
  });

  it('should delete a mapping when clicking on the delete button', function(done){
    this.timeout(3000);

    dom.$('#mappingControl').click();
    setTimeout(function(){
      dom.$('.deleteMapping')[0].click();
      setTimeout(function(){
        expect(dom.$('.mappingTitle').length).to.equal(2);
        done();
      }, 1000);
    }, 1000)
  });

  it('should move to edit stub view when selecting edit for a mapping', function(done){
    this.timeout(3000);

    dom.$('#mappingControl').click();

    setTimeout(function(){
      var idArray = dom.$('.mapping .deleteMapping').map(function(){return dom.$(this).attr('href');}).get();
      var id = idArray[1].split('/')[1];
      var editArray = dom.$('.mapping .editMapping').map(function(){return dom.$(this);}).get();
      editArray[1].click();

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
        var headerStringRows = dom.$('#form > .requestHeader .key').map(function(){return dom.$(this).val();}).get();
        var headerStringMatchers = dom.$('#form > .requestHeader .matcher').map(function(){return dom.$(this).val();}).get();
        var headerStringValues = dom.$('#form > .requestHeader .value').map(function(){return dom.$(this).val();}).get();

        expect(headerStringRows[0]).to.equal('header1');
        expect(headerStringMatchers[0]).to.equal('equalTo');
        expect(headerStringValues[0]).to.equal('123');
        expect(headerStringRows[1]).to.equal('header2');
        expect(headerStringMatchers[1]).to.equal('matches');
        expect(headerStringValues[1]).to.equal('456');
        expect(headerStringRows[2]).to.equal('header3');
        expect(headerStringMatchers[2]).to.equal('doesNotMatch');
        expect(headerStringValues[2]).to.equal('789');
        expect(headerStringRows[3]).to.equal('header4');
        expect(headerStringMatchers[3]).to.equal('contains');
        expect(headerStringValues[3]).to.equal('135');

        // Request body matcher value
        var requestPayloads = dom.$('#form > .requestPayload textarea').map(function(){return dom.$(this).val();}).get();

        expect(requestPayloads[0]).to.equal('{\n \"body\":\"matcher\"\n}');
        expect(requestPayloads[1]).to.equal('<total_results>4</total_results>');

        // Response values
        expect(dom.$('#statusCode').val()).to.equal('200');

        // Response headers
        expect(dom.$('.responseHeader .key').val()).to.equal('responseheader1');
        expect(dom.$('.responseHeader .value').val()).to.equal('abc');

        expect(dom.$('#responsePayload').val()).to.equal('{\n \"response\":\"body\"\n}');

        expect(dom.$('#makeRequest').text()).to.equal('Update');
        expect(dom.$('#newForm').text()).to.equal('Create new stub');
        expect(dom.$('#editId').val()).to.equal(id);

        done();
      }, 1000);
    }, 1000);
  });

});
