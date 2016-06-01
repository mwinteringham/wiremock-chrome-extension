var jsdom  = require('jsdom'),
    path   = require('path');

module.exports = exports = {};

exports.buildDom = function(callback){
  jsdom.env({
    file: path.join(__dirname, '../src/index.html'),
    scripts: ['http://code.jquery.com/jquery-1.11.2.min.js'],
    features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
    },
    done: function(errors, window){
      if(errors != null) console.log('Errors', errors);

      callback(window);
    }
  });
}
