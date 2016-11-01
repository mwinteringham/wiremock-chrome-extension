var chai   = require('chai'),
    helpers = require('./helpers.js'),
    expect = chai.expect,
    exec = require('child_process').exec,
    dom, child;

before(function(done){
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
    // Conditional based upon previous test - I can't get jsdom to refresh the damn popup!
    setTimeout(function(){
      dom.$('#mappings > li:nth-child(1) .mappingTitle').click();

      expect(dom.$('#mappings > li:nth-child(1) .mappingDetails:visible').length).to.equal(0);
      done();
    }, 1000);
  });

  it('should delete a mapping when clicking on the delete button', function(done){
    this.timeout(3000);

    dom.$('#mappingControl').click();
    dom.$('#mappings > li:nth-child(1) .deleteMapping').click();

    setTimeout(function(){
      expect(dom.$('#mappings .mappingTitle').length).to.equal(1);
      done();
    }, 2000);
  });

});
