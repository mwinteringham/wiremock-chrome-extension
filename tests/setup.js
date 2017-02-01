var exec = require('child_process').exec,
    helpers = require('./helpers.js'),
    child;

before(function(done){
  // Horrible hack to have Wiremock up and running to test mappings, I'm not happy about it but it's easier than attempting to get
  // the scope between production JS and nock to work at this current time.
  child = exec('java -jar "' + __dirname + '/bin/wiremock-standalone-2.5.1.jar" --root-dir "' + __dirname + '/bin/"');
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
