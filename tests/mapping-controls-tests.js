var chai   = require('chai'),
    helpers = require('./helpers.js'),
    expect = chai.expect,
    exec = require('child_process').exec,
    dom, child;

before(function(done){
  helpers.buildDom(function(window){
    dom = window;
  })

  // Horrible hack to have Wiremock up and running to test mappings, I'm not happy about it but it's easier than attempting to get
  // the scope between production JS and nock to work at this current time.
  child = exec('java -jar "' + __dirname + '/bin/wiremock-standalone-2.2.2.jar" --root-dir "' + __dirname + '/bin/"');
  child.stdout.on('data', function(data){
    if(data.indexOf('port:') > -1){
        done();
    }
  });
});

after(function(done){
  child.kill("SIGINT");
  done();
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
      dom.$('#mappings > li:nth-child(1)').click();

      expect(dom.$('#mappings > li:nth-child(1) .mappingDetails:visible').length).to.equal(1);
      done();
    }, 1000);
  });

  it('should hide JSON details for a mapping when clicking twice on a mapping entry', function(done){
    // Race condition based upon previous test - I can't get jsdom to refresh the damn popup!
    setTimeout(function(){
      dom.$('#mappings > li:nth-child(1)').click();

      expect(dom.$('#mappings > li:nth-child(1) .mappingDetails:visible').length).to.equal(0);
      done();
    }, 1000);
  });

});
