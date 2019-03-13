
var loaderUtils = require('loader-utils');
var fileUtils = require('../utils/filepath-utils.js');

var scxml = require('@scion-scxml/scxml');

var MODULE_CODE_PREFIX = 'var ScxmlModel = ';

//TODO support optional prepare() arguments? ->
/**
 * Prepares an scxml model for execution by binding it to an execution context
 * @param  {prepareCallback} cb  Callback to execute with the prepared model or an error
 *   The prepared model is a function to be passed into a SCION StateChart object
 * @param  {vm.Context | object} [executionContext] The execution context  (e.g. v8 VM sandbox).
 *   If a vm.Context object is provided, then the compiled SCXML module code is evaluated in that context.
 *   Otherwise, if a regular object is provided, then the given object is "contextified", which means that it is passed to vm.createContext to create a new execution context. Object keys are exposed as global variables on the new context in which the generated SCXML module code is evaluated.
 * @param  {HostContext} [hostContext]  Context provided by the interpreter host
 */

var MODULE_CODE_SUFFIX = ';\n' +
						'ScxmlModel.prepare = function(prepareCallback, executionContext, hostContext) {' + //TODO support optional arguments executionContext & hostContext?
							//NOTE use setTimeout() for simulating async execution:
							'if(!prepareCallback) return; setTimeout(function(){prepareCallback(null, ScxmlModel)}, 0);' +
						'};\nmodule.exports = ScxmlModel;';


function toError(errList, file){
	if(Array.isArray(errList)){
		var sb = [];
		var len = errList.length;
		errList.forEach(function(err, index){
			if(err.tagname && err.reason){
				sb.push('SCXML ERROR ('+(index+1)+') in <'+err.tagname+'>: '+err.reason + '\n  at '+file+':'+err.line+':'+err.column);
			} else {
				sb.push(err && err.stack? err.stack : 'SCXML ERROR ('+(index+1)+') in file '+file+': '+err);
			}
		});
		return new Error('encountered '+len+' error'+(len === 1? '' : 's')+' while parsing SCXML:\n' + sb.join('\n'));
	}
	return errList instanceof Error? errList : new Error('SCXML ERROR in file '+file+': '+errList);
}

module.exports = function(content, map, meta) {
	var callback = this.async();

	var options = loaderUtils.getOptions(this) || {};
	// console.log('mmir-scxml-loader: options -> ', options);//DEBU
	if(!options.mapping){
		callback('failed to parse SCXML definition: missing list for SCXML settings [{id: "the ID", file: "the file path", ...}, ...]');
		return;/////////////// EARLY EXIT /////////////////
	}

	var scxmlFile = fileUtils.normalizePath(this.resource);
	// console.log('mmir-scxml-loader: resource -> ', scxmlFile);//DEBU
	var i = options.mapping.findIndex(function(g){
		return g.file === scxmlFile;
	});
	var scxmlInfo = options.mapping[i];

	// console.log('mmir-scxml-loader: options for resource -> ', scxmlInfo);//DEBU

	if(!scxmlInfo || !scxmlInfo.id){
		var error;
		if(options.mapping.length === 0){
			error = 'failed to parse SCXML definition: empty list for SCXML settings [{id: "the ID", file: "the file path", ...}, ...]';
		}
		else if(i === -1 || !scxmlInfo){
			error = 'failed to parse SCXML definition: could not find settings for SCXML in SCXML-settings list: '+JSON.stringfy(options.mapping);
		} else if(!scxmlInfo.id){
			error = 'failed to parse SCXML definition: missing field id for SCXML: '+JSON.stringfy(scxmlInfo);
		} else {
			error = 'failed to parse SCXML definition: invalid SCXML settings in list: '+JSON.stringfy(options.mapping);
		}
		callback(error);
		return;/////////////// EARLY EXIT /////////////////
	}

	// console.log('mmir-scxml-loader: resource ID at '+i+' -> ', scxmlInfo.id);//, ', parsing content: ', content);//DEBU

  //TODO ID optional settable via loader options?
  var id = scxmlInfo.id;
	var ignoreRuntimeErrors = scxmlInfo.ignoreErrors === true || options.ignoreErrors === true;
	// console.log('SCXML parsing, ignoreErrors -> ', ignoreRuntimeErrors, scxmlInfo, ', options.ignoreErrors: ', options.ignoreErrors)//DEBU
	scxml.documentStringToModel(id, content, function(err, model){

		if(err){
			callback(toError(err, scxmlFile));
			return;/////////////// EARLY EXIT /////////////////
		}

		// console.log('mmir-scxml-loader: successfully created model factory for '+id+'.');//DEBU

		model.prepare(function(err, fnModel) {

				if(err){
					callback(toError(err, scxmlFile));
					return;/////////////// EARLY EXIT /////////////////
				}

				var scxmlCode = MODULE_CODE_PREFIX + fnModel.toString() + MODULE_CODE_SUFFIX;

				// console.log('mmir-scxml-loader: created model for '+id+'.');//DEBU

		    callback(null, scxmlCode, map, meta);
		});

  }, {reportAllErrors: !ignoreRuntimeErrors})

  return;
};
