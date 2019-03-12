
/**
 * HELPER function(NAME): reads files from
 * <working dir>/build/lib/mmir-build/templates/
 *
 * with
 *  [NAME]-prefix.template
 *  [NAME]-suffix.template
 *
 * and returns an object
 * {
 * 	prefix: STRING | void
 * 	suffix: STRING | void
 * }
 *
 * or VOID if neither prefix nor suffix were present.
 */


var fs = require('fs');
var path = require('path');


var moduleHacksDir = path.join(__dirname, 'templates');

var moduleHackPrefixName = '-prefix';
var moduleHackSuffixName = '-suffix';
var ext = '.template'

//name prefix for requirejs module-IDs (of mmir framework modules)
var reModuleNamePrefix = /^mmirf\//;


function getCodeHack(moduleName, hackTypeName){

	var name = moduleName.replace(reModuleNamePrefix, '');//remove module prefix
	var filePath = path.join(moduleHacksDir, name + hackTypeName + ext);
	if(fs.existsSync(filePath)){
		return fs.readFileSync(filePath, 'utf-8');
	}
}

module.exports = function(moduleName){

	var hacks = {
		prefix: getCodeHack(moduleName, moduleHackPrefixName),
		suffix: getCodeHack(moduleName, moduleHackSuffixName)
	}

	if(!hacks.prefix && !hacks.suffix){
		return;
	}

	return hacks;
}
