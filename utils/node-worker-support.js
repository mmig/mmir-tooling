
var logUtils = require('../utils/log-utils.js');
// var log = logUtils.log;
var warn = logUtils.warn;

//////// async / threaded grammar compiler support: ////////////////
var asyncSupport = false;
try {
    // log('#################### start detecting async grammar support...')
    var Threads = require('webworker-threads');
    var thread = Threads.create();
    thread.eval(function testAsync(){return true;}).eval('testAsync()', function(_err, _result){
        // log('#################### detected async grammar support -> ', _result, ', error? -> ', _err);
        thread.destroy();
    });

    //if we are here, assume that webworker-threads has been properly installed & compiled (i.e. is available)
    asyncSupport = true;

} catch(err){

    try {

        require('worker_threads');
        asyncSupport = true;

    } catch(err){
        warn('[INFO] could not load implementation for WebWorkers, e.g. (experimental) worker_threads or webworker-threads (>= version 0.8.x): cannot use WebWorkers/parallel threads for compling grammars etc.');
    }

}

module.exports = {
    isAsyncSupported: function(){ return asyncSupport; }
}
