/**
 * HELPER for converting requirejs shims into AMD modules:
 *
 * reads the MMIR framework's requirejs config and tries to convert all shim-entries
 * to a AMD modules and stores them at buildUrl (/build/lib/mmir-build/mod/), appending
 * the suffix "_amd" to file name.
 *
 *
 */

var path = require('path'),
	fs = require('fs');

var esprima = require('esprima');

var getSubDirName = require('./get-sub-dir.js');
var minProc = require('./minify.js');

//HELPER for retrieving module-HACKS: either to prepend or append to the module code
//-> use the module-id from the requirejs config
//-> the HACKS are located in the templates directory:
//  * for prepending stored in file: <module name>-prefix.template
//  * for appending stored in file: <module name>-suffix.template
var getModuleHacks = require('./get-module-hacks.js');

var shimConfig = require('./config/requirejs-shim-config.js');

//name prefix for requirejs module-IDs (of mmir framework modules)
var moduleNamePrefix = 'mmirf/';

//newline char/String that will be used when creating the AMD modules
var nl = '\n';


///////////////////////////////// start conversion code: //////////////////////////////////

//console.log(shimConfig.shim);

var getInitArgsList = function(parsedFunc){

	//NOTE the parsed function was prefixed with "var init = "
	// -> the function will be available at parsedFunc.body.declarations...
	var params = parsedFunc.body[0].declarations[0].init.params;

	var reModPrefix = new RegExp('^'+moduleNamePrefix);
	var list = [], name;
	for(var i=0,size=params.length; i < size; ++i){
		name = params[i].name.replace(reModPrefix, '');
		list.push(name);
	}

	return list;
};

var getInitCode = function(parsedFunc, funcStr){

	//NOTE the parsed function was prefixed with "var init = "
	// -> the function will be available at parsedFunc.body.declarations...
	var funcBody = parsedFunc.body[0].declarations[0].init.body.body;
	var size = funcBody.length;

	if(size > 0){

		var start = funcBody[0].range[0];
		var end = funcBody[size-1].range[1];

		return funcStr.substring(start, end);
	}

	return '';
};

var hasInitExports = function(parsedFunc){

	//NOTE the parsed function was prefixed with "var init = "
	// -> the function will be available at parsedFunc.body.declarations...
	var funcBody = parsedFunc.body[0].declarations[0].init.body.body;

	for(var i=0,size=funcBody.length; i < size; ++i){
		if(funcBody[i].type = 'ReturnStatement'){

			//TODO verify/check, if this is the last (non-comment) entry?
			return true;
		}
	}
};

var wrapAsModule = function(name, deps, code, exports, depArgNames, initCode){

	//console.log('wrappping module ', name, ' with dependencies ', deps, ', exports ', exports, ', depNames '+ depArgNames, ', initCode ' + initCode);

	var depArray = '';
	var depArgs = '';

	var preModuleCode = '';

	if(deps){
			var reModPrefix = new RegExp('^'+moduleNamePrefix);
			depArray = '[\'' +  deps.join('\', \'') + '\'], ';
			depArgs = depArgNames? depArgNames.join(', ') : deps.map(function(dep){ return dep.replace(reModPrefix, '');}).join(', ');
	}

	if(exports){
		exports = nl+'return '+exports+';'+nl;
	} else {
		exports = '';
	}

	var moduleHacks = getModuleHacks(name);
	if(moduleHacks){

		if(moduleHacks.prefix){
			preModuleCode = nl + moduleHacks.prefix + nl;
		}

		if(moduleHacks.suffix){
			exports = nl + moduleHacks.suffix + nl + exports;
		}
	}

	if(initCode){
		exports = nl+ initCode + nl + (exports? exports + ';' + nl : '');
	}

	return nl +'define('+depArray+'function('+depArgs+'){' + nl + preModuleCode + nl + code + nl + exports + nl + '});' + nl;
};

var getAsModule = function(name, shim, code){

	//EXAMPLE shim-object:
//	{
//		ES3Lexer: { deps: [ 'mmirf/antlr3' ], exports: 'ES3Lexer' },
//		jqm: [ 'jquery' ],
//	    ...
//	}

	if(Array.isArray(shim)){
		shim = {deps: shim};
	}

	var argNames;
	if(shim.init){

		var funcStr = 'var init = ' + shim.init.toString();
		var parsedInit = esprima.parse(funcStr, {range: true});
//		console.log(JSON.stringify(parsedInit, null, 4));

		argNames = getInitArgsList(parsedInit);

		if(shim.exports && hasInitExports(parsedInit, funcStr)){
			shim.exports = '';
		}

		shim.init = getInitCode(parsedInit, funcStr);
	}

	return wrapAsModule(name, shim.deps, code, shim.exports, argNames, shim.init);
};

module.exports = {
  process: function(inputLibPath, outputDir){

    var baseUrl = inputLibPath;// ~~> .../mmirf/
    var buildUrl = outputDir;

    for(var name in shimConfig.shim){

    	var shim = shimConfig.shim[name];
    	var uri = shimConfig.paths[name];

    	var fileName = path.basename(uri);
      var outSubDir = getSubDirName(uri);

    	var filePath = path.join(baseUrl, uri + '.js');
    	var outPath = path.join(buildUrl, outSubDir, fileName + '_amd.js');

    	var code = fs.readFileSync(filePath, 'utf-8');

    	code = getAsModule(name, shim, code);

    	console.log('writing converted AMD module to '+outPath);
    	fs.writeFileSync(outPath, code, 'utf-8');

      var result = minProc.minify(path.basename(outPath), code);

      var minFilename = outPath.replace(/\.js/, '.min.js');
      fs.writeFileSync(minFilename, result.code, 'utf-8');
      fs.writeFileSync(minFilename + '.map', result.map, 'utf-8');

    }
  }
}
