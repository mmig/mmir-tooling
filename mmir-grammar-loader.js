var path = require('path');
var loaderUtils = require('loader-utils');
var fileUtils = require('./webpack-filepath-utils.js');

var mmir = require('./mmir-init.js');
var semantic = mmir.require('mmirf/semanticInterpreter');

//////// async / threaded grammar compiler support: ////////////////
var asyncSupport = false;
try {
	// console.log('#################### start detecting async grammar support...')
	var Threads = require('webworker-threads');
	var thread = Threads.create();
	thread.eval(function testAsync(){return true;}).eval('testAsync()', function(err, result){
		// console.log('#################### detected async grammar support -> ', result, ', error? -> ', err);
		thread.destroy();
	});

	//if we are here, assume that webworker-threads has been properly installed & compiled (i.e. is available)
	asyncSupport = true;

} catch(err){
	// console.log('#################### no support for async grammar generation');//DEBUG
}

//helpers for keeping track of pending grammar-compile tasks when in async compile mode
// -> will not try to destroy the compiler thread as long as there a still tasks for that compiler engine
function createPendingAsyncGrammarsInfo(){
	return {
		jison: 0,
		jscc: 0,
		pegjs: 0,
		reset: function(){
			this.jison = 0;
			this.jscc = 0;
			this.pegjs = 0;
		}
	};
}
var pendingAsyncGrammars;
//////// END: async / threaded grammar compiler ////////////////


function getEngine(grammarInfo, options){
	return grammarInfo.engine || (options.config && options.config.engine) || /*default: */ 'jscc';
}

module.exports = function(content, map, meta) {
	var callback = this.async();
	// someAsyncOperation(content, function(err, result, sourceMaps, meta) {
	// 	if (err) return callback(err);
	// 	callback(null, result, sourceMaps, meta);
	// });
  var grammar;
  try{
    grammar = JSON.parse(content);
  } catch(err){
		// console.error('ERROR parsing JSON grammar at '+this.resource+' -> ', JSON.stringify(content), arguments, ', [this:] ', this);//DEBUG
    callback(err);
		return;/////////////// EARLY EXIT /////////////////
  }
  // console.log('mmir-grammer-loader: ', JSON.stringify(grammar));


	// var loaderData = this.data;
	// console.log('mmir-grammer-loader: this.data -> ', this.data);

	var options = loaderUtils.getOptions(this) || {};
	// console.log('mmir-grammer-loader: options -> ', options);//DEBUG
	if(!options || !options.mapping){
		callback('failed to parse JSON grammar: missing list for grammar settings [{id: "the ID", file: "the file path", ...}, ...]');
		return;/////////////// EARLY EXIT /////////////////
	}

	var grammarFile = fileUtils.normalizePath(this.resource);
	// console.log('mmir-grammer-loader: resource -> ', grammarFile);//DEBUG
	var i = options.mapping.findIndex(function(g){
		return g.file === grammarFile;
	});
	var grammarInfo = options.mapping[i];

	if(!grammarInfo || !grammarInfo.id){
		var error;
		if(options.mapping.length === 0){
			error = 'failed to parse JSON grammar: empty list for grammar settings [{id: "the ID", file: "the file path", ...}, ...]';
		}
		else if(i === -1 || !grammarInfo){
			error = 'failed to parse JSON grammar: could not find settings for grammar in grammar-settings list: '+JSON.stringfy(options.mapping);
		} else if(!grammarInfo.id){
			error = 'failed to parse JSON grammar: missing field id for grammar: '+JSON.stringfy(grammarInfo);
		} else {
			error = 'failed to parse JSON grammar: invalid grammar settings in list: '+JSON.stringfy(options.mapping);
		}
		callback(error);
		return;/////////////// EARLY EXIT /////////////////
	}

	// console.log('mmir-grammer-loader: resource ID at '+i+' -> ', grammarInfo.id);//DEBUG

	//TODO(?):
			// //TODO impl. automated sync/async loading&execution for compiled grammars
			// //				var grammarExecMode = configurationManager.get('grammarExecMode');
			// //				if(typeof grammarExecMode !== 'undefined'){
			// //					semanticInterpreter.setGrammarExecMode(grammarExecMode);//TODO add async-loaded grammars to ignoreGrammarFiles-list (to prevent loading them in "sync-exec mode")
			// //				}
			//
			// TODO add ignored (and excluded) grammars to ignore-list of mmir.conf
			// var ignoreGrammarIds = configurationManager.get('ignoreGrammarFiles', void(0));

	var engine = getEngine(grammarInfo, options);
  // console.log('mmir-grammer-loader: setting compiler "'+engine+'" for grammar "'+grammarInfo.id+'"...');//DEBUG

	// var async = grammarInfo.async || (options.config && options.config.async) || /*default: */ false;
	// async = true;//FIXME currently WebWorker library does not handle relative paths for importScripts() correctly -> DISABLE async mode

	var async = asyncSupport && (!options.config || options.config.asyncCompile !== false);
  console.log('mmir-grammer-loader: using '+(async? 'async' : 'SYNC')+' mode ('+engine+') for grammar "'+grammarInfo.id+'" ...');//DEBUG

  semantic.setGrammarEngine(engine, async);

  //TODO ID optional settable via loader options?
  var id = grammarInfo.id;
  semantic.createGrammar(grammar, id, function(result){

    // console.log('mmir-grammer-loader: grammar compiled...');//DEBUG
		var grammarCode = ';' + result.js_grammar_definition;
    // console.log('mmir-grammer-loader: grammar code size ', grammarCode.length);//DEBUG

		// try{
			if(async){
				var pending = pendingAsyncGrammars;
				--pending[engine];
				// console.log('mmir-grammer-loader: updated pending async grammar ('+engine+') for grammar "'+grammarInfo.id+'": ', pending);//DEBUG
				if(pending[engine] <= 0){
					// console.log('mmir-grammer-loader: stopping grammer generator for '+engine+'...');//DEBUG
					mmir.require('mmirf/'+engine+'AsyncGen').destroy();
				}
			}
		// } catch(err){
		// 	console.log('could not destroy async grammar engine '+engine, err);//DEBUG
		// }

		// console.log('mmir-grammer-loader: emitting grammar code for ('+engine+') for grammar "'+grammarInfo.id+'"...');//DEBUG

    callback(null, grammarCode, map, meta);
  });

  return;
};

//HACK force prevention of json-loader
var jsonLoaderPath;
module.exports.pitch = function(remainingRequest, precedingRequest, data) {

	// console.log('mmir-grammer-loader: PITCHing | remaining: ', remainingRequest, ' | preceding: ', precedingRequest, ' | data: ', data);//DEBUG
	// console.log('mmir-grammer-loader: PITCHing options -> ',loaderUtils.getOptions(this));//DEBUG

	if(asyncSupport && !pendingAsyncGrammars){
		var options = loaderUtils.getOptions(this);
		// console.log('mmir-grammer-loader: PITCHing [ASYNC PREPARATION] options -> ', options);//DEBUG
		var pending = createPendingAsyncGrammarsInfo();
		if(options && options.mapping){
			options.mapping.forEach(function(g){
				var engine = getEngine(g, options);
				++pending[engine];
			});
			// data.pendingAsyncGrammars = pending;
			pendingAsyncGrammars = pending;//NOTE: store into "global"/module var, since this should keep trac of all ALL pending grammar jobs, not just the current one
			// console.log('mmir-grammer-loader: PITCHing [ASYNC PREPARATION] pending grammars -> ', pendingAsyncGrammars, data);//DEBUG
		}
	}

	//HACK for webpack < 4.x the Rule.type property for indicating the conversion JSON -> javascript is not allowed
	//     -> for webpack >= 2.x the json-loader may register itself for the JSON grammar which would produce errors
	//        since it will receive the javascript code emitted by the grammar-loader
	//     WORKAROUND/HACK: try to detect json-loader, and remove it if present:
	var options = loaderUtils.getOptions(this);
	if(options && options.isRuleTypeDisabled){//<- this will be set, if Rule.type had to be removed due to webpack version < 4.x

		if(!jsonLoaderPath){
			try{
				jsonLoaderPath = fileUtils.normalizePath(require.resolve('json-loader'));
			} catch(err){
				//-> json-loader is not available
				// console.log('mmir-grammer-loader: PITCHing phase, [WARN] json-loader prevention WORKAROUND - options.isRuleTypeDisabled is set, but json-loader module cannot be resolved, arguments: | remainingRequest: ', remainingRequest, ' | precedingRequest: ', precedingRequest, ' | data: ', data);
				//-> ignore: no use trying to remove json-loader from this.loaders...
				return;////////////// EARLY EXIT /////////////////////////
			}
		}

		for(var i=this.loaders.length-1; i >= 0; --i){
			// console.log('mmir-grammer-loader: checking loaders at ', i, ' -> ', this.loaders[i]);//DEBUG
			// for(var n in this.loaders[i]) console.log('mmir-grammer-loader: loaders ', i, '['+n+'] -> ', this.loaders[i][n])//DEBUG
			if(fileUtils.normalizePath(this.loaders[i].path) === jsonLoaderPath){
				// console.log('mmir-grammer-loader: removing default json-loader at ', i);//DEBUG
				this.loaders.splice(i,1)
			}
		}
	}
};
