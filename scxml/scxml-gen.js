
var scxml = require('@scion-scxml/scxml');

//FIXME do fix datamodel declaration in generated scxml model FIXES @scion-scxml/scxml@4.3.25
//TODO remove when not neccessary any more
require('./scxml-fix-datamodel-declaration').fixRawCompileInjectDataModule(scxml);

// var logUtils = require('../utils/log-utils.js');
// var log = logUtils.log;

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

var AMD_PREFIX = 'define(["module"],  function(module){\n';
var AMD_SUFFIX = '\n});';
var STRICT_MODE = '"use strict";\n';

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

/**
 * compile an SCXML file to exectuable scion statechart model
 *
 * @param  {string} content the SCXML definition as string
 * @param  {string} scxmlFile the path of the SCXML file (for debugging/error information)
 * @param  {ScxmlLoadOptions} options the ScxmlLoadOptions with property mapping (list of ScxmlOptions)
 * @param  {Function} callback the callback when SCXML compilation has been completed: callback(error | null, compiledStatechart, map, meta)
 * @param  {any} [_map] source mapping (unused)
 * @param  {any} [_meta] meta data (unused)
 */
function compile(content, scxmlFile, options, callback, _map, _meta) {

	// log('mmir-scxml-loader: resource -> ', scxmlFile);//DEBU
	var i = options.mapping.findIndex(function(g){
		return g.file === scxmlFile;
	});
	var scxmlInfo = options.mapping[i];

	// log('mmir-scxml-loader: options for resource -> ', scxmlInfo);//DEBU

	if(!scxmlInfo || !scxmlInfo.id){
		var error;
		if(options.mapping.length === 0){
			error = 'failed to parse SCXML definition: empty list for SCXML settings [{id: "the ID", file: "the file path", ...}, ...]';
		}
		else if(i === -1 || !scxmlInfo){
			error = 'failed to parse SCXML definition: could not find settings for SCXML in SCXML-settings list: '+JSON.stringify(options.mapping);
		} else if(!scxmlInfo.id){
			error = 'failed to parse SCXML definition: missing field id for SCXML: '+JSON.stringify(scxmlInfo);
		} else {
			error = 'failed to parse SCXML definition: invalid SCXML settings in list: '+JSON.stringify(options.mapping);
		}
		callback(error, null, _map, _meta);
		return;/////////////// EARLY EXIT /////////////////
	}

	// log('mmir-scxml-loader: resource ID at '+i+' -> ', scxmlInfo.id);//, ', parsing content: ', content);//DEBU

	//TODO ID optional settable via loader options?
	var id = scxmlInfo.id;
	var ignoreRuntimeErrors = typeof scxmlInfo.ignoreErrors === 'boolean'? scxmlInfo.ignoreErrors : (options.config && options.config.ignoreErrors === true);
	// log('SCXML parsing, ignoreErrors -> ', ignoreRuntimeErrors, ', options.ignoreErrors: ', options.config, scxmlInfo)//DEBU
	var moduleType = scxmlInfo.moduleType? scxmlInfo.moduleType : (options.config && options.config.moduleType);
	//log('SCXML parsing, moduleType -> ', moduleType, ', options.config: ', options.config, scxmlInfo)//DEBU
	var strictMode = typeof scxmlInfo.strict === 'boolean'? scxmlInfo.strict : (options.config && typeof options.config.strict === 'boolean'? options.config.strict : true);
	//log('SCXML parsing, strictMode -> ', strictMode, ', options.config: ', options.config, scxmlInfo)//DEBU

	scxml.documentStringToModel(id, content, function(err, model){

		if(err){
			callback(toError(err, scxmlFile, _map, _meta));
			return;/////////////// EARLY EXIT /////////////////
		}

		// log('mmir-scxml-loader: successfully created model factory for '+id+'.');//DEBU

		model.prepare(function(err, fnModel) {

				if(err){
					callback(toError(err, scxmlFile, _map, _meta));
					return;/////////////// EARLY EXIT /////////////////
				}

				var scxmlCode = MODULE_CODE_PREFIX + fnModel.toString() + MODULE_CODE_SUFFIX;

				if(moduleType === 'amd'){
					scxmlCode = AMD_PREFIX + (strictMode? STRICT_MODE : '') + scxmlCode + AMD_SUFFIX;
				}

				// log('mmir-scxml-loader: created model for '+id+'.');//DEBU

				callback(null, scxmlCode, _map, _meta);
		});

	}, {reportAllErrors: !ignoreRuntimeErrors})

	return;
};

module.exports = {
	compile: compile
}
