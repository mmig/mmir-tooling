

//////// async / threaded grammar compiler support: ////////////////
var asyncSupport = false;
try {
	// console.log('#################### start detecting async grammar support...')
	var Threads = require('webworker-threads');
	var thread = Threads.create();
	thread.eval(function testAsync(){return true;}).eval('testAsync()', function(_err, _result){
		// console.log('#################### detected async grammar support -> ', _result, ', error? -> ', _err);
		thread.destroy();
	});

	//if we are here, assume that webworker-threads has been properly installed & compiled (i.e. is available)
	asyncSupport = true;

} catch(err){

	try {

		require('worker_threads');
		asyncSupport = true;

	} catch(err){

		console.log('[INFO] could not load implementation for WebWorkers: cannot use WebWorkers/parallel threads for compling grammars etc.');
		console.log('[INFO]   try enabling WebWorkers for node:');
		console.log('[INFO]     * install npm package webworker-threads (>= version 8.x)');
		console.log('[INFO]     * enable experimental node worker_threads via command line argument:');
		console.log('[INFO]       node --experimental-worker ...');
		console.log('[INFO]       npm --node-options --experimental-worker ...');
	}

}

module.exports = {
	isAsyncSupported: function(){ return asyncSupport; }
}
