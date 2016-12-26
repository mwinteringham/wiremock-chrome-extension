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

describe('Wiremock extension - global controls', function(){

  it('should have a frame size of 485x600px', function(done){
    expect(dom.$('body').height()).to.equal(600);
    expect(dom.$('body').width()).to.equal(485);

    done();
  });

  it('should have controls to switch between stub, mappings and about view', function(done){
    expect(dom.$('#stubControl').length).to.equal(1);
    expect(dom.$('#mappingControl').length).to.equal(1);
    expect(dom.$('#settingsControl').length).to.equal(1);

    done();
  });

  it('should show the mapping view when mapping is clicked on', function(done) {
    dom.$('#mappingControl').click();

    expect(dom.$('#stubView:visible').length).to.equal(0);
    expect(dom.$('#mappingView:visible').length).to.equal(1);
    expect(dom.$('#aboutView:visible').length).to.equal(0);

    done();
  });

  it('should show the about view when about is clicked on', function(done) {
    dom.$('#settingsControl').click();

    expect(dom.$('#stubView:visible').length).to.equal(0);
    expect(dom.$('#mappingView:visible').length).to.equal(0);
    expect(dom.$('#aboutView:visible').length).to.equal(1);

    done();
  });

  it('should show the stub view when stub is clicked on', function(done) {
    dom.$('#settingsControl').click();
    dom.$('#stubControl').click();

    expect(dom.$('#stubView:visible').length).to.equal(1);
    expect(dom.$('#mappingView:visible').length).to.equal(0);
    expect(dom.$('#aboutView:visible').length).to.equal(0);

    done();
  });

});
