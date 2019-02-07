var path = require('path');
var loaderUtils = require('loader-utils');
var fileUtils = require('./webpack-filepath-utils.js');

function getExportCodeFor(varName){
	return '\n' +
				// 'if(typeof module !== "undefined" && module.exports) {' +
					'module.exports = '+varName+';\n'
				// '}\n';
}


module.exports = function(content, map, meta) {
	var callback = this.async();

	var options = loaderUtils.getOptions(this) || {};
	// console.log('mmir-impl-loader: options -> ', options);//DEBU
	if(!options.mapping){
		callback('failed to parse implementation: missing list for impl. settings [{id: "the ID", file: "the file path", ...}, ...]');
		return;/////////////// EARLY EXIT /////////////////
	}

	var implFile = fileUtils.normalizePath(this.resource);
	// console.log('mmir-impl-loader: resource -> ', implFile);//DEBU
	var i = options.mapping.findIndex(function(impl){
		return impl.file === implFile;
	});
	var implInfo = options.mapping[i];

	console.log('mmir-impl-loader: options for resource -> ', implInfo);//DEBUG

	if(!implInfo || !implInfo.name){
		var error;
		if(options.mapping.length === 0){
			error = 'failed to parse implementation: empty list for impl. settings [{id: "the ID", file: "the file path", ...}, ...]';
		}
		else if(i === -1 || !implInfo){
			error = 'failed to parse implementation: could not find settings for impl. in impl.-settings list: '+JSON.stringfy(options.mapping);
		} else if(!implInfo.name){
			error = 'failed to parse implementation: missing field name for impl: '+JSON.stringfy(implInfo);
		} else {
			error = 'failed to parse implementation: invalid impl. settings in list: '+JSON.stringfy(options.mapping);
		}
		callback(error);
		return;/////////////// EARLY EXIT /////////////////
	}

	var implCode = content;

	if(implInfo.addModuleExport){
		var name = typeof implInfo.addModuleExport === 'string'? implInfo.addModuleExport : implInfo.name;
		console.log('mmir-impl-loader: adding module.exports for resource '+implInfo.id+' -> ', name);//DEBUG
		implCode += getExportCodeFor(name);
	}


	// console.log('mmir-impl-loader: emitting code for '+implInfo.id+' -> ', content);//DEBUG

	callback(null, implCode, map, meta);
  return;
};
