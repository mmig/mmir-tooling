'use strict';
var path = require('path');
var fs = require('fs');

var reNormalize = path.sep !== '/'? new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g') : null;
var idFromPath = function(path){
  if(reNormalize){
    path = path.replace(reNormalize, '/');
  }
  return path;
}

// function isDir(path){
// 	return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
// }

function getModId(_modPaths, path) {
	var clpath = path.replace(/\.js$/i, '');
	clpath = clpath === path? null : clpath;
	var val;
	for (var p in _modPaths) {
		val = _modPaths[p];
		if (val === path || val === clpath) {
			return p;
		} else if(clpath && clpath.indexOf(val) === 0){
			// console.log('  handle package alias "'+clpath+'" -> ', p + idFromPath(clpath.substring(val.length)));//DEBUG
			return p + idFromPath(clpath.substring(val.length));
		}
	}
}

//from https://stackoverflow.com/a/34637718/4278324

class ReplaceModuleIdPlugin {
	constructor(alias, mmirLibDir) {
		this.alias = alias || {};
		this.mmirDir = mmirLibDir;
	}

	apply(compiler) {

		var processModules = (modules) => {
			// console.log('ReplaceModuleIdPlugin.beforeModuleIds: ', modules);

			var aliasLookup = this.alias;
			var dir = __dirname;

			// console.log('ReplaceModuleIdPlugin.beforeModuleIds: current dir "'+dir+'", mmir-lib dir "'+this.mmirDir+'", checking '+JSON.stringify(aliasLookup)); //DEBUG

			var fix_index;

			modules.forEach(function(module) {
				if (module.id === null && module.libIdent) {
					var id = path.normalize( module.libIdent({
						context: compiler.options.context
					}));
					var fullpath = path.resolve(dir, id);
					if(!fs.existsSync(fullpath)){
						fullpath = path.resolve(this.mmirDir, id);
					}

					// console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ', id, ', fullpath ', path.resolve(targetDir, id)); //, ', module ', module);//DEBUG

					// if (fs.existsSync(fullpath)) {

						// console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ', id, ', fullpath ', fullpath); //, ', module ', module);//DEBUG

						var lookUpId = getModId(aliasLookup, fullpath);

						// //FIXME
						// if(!lookUpId && (fix_index = fullpath.indexOf('tools'+path.sep+'util_purejs'))!==-1){
						// 	lookUpId = 'mmirf/util/' + fullpath.substring(fix_index + ('tools'+path.sep+'util_purejs').length + 1).replace(/\.js/i, '');
						// 	// console.log('  FIX id -> ', lookUpId);//DEBUG
						// }

						// console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ',id, ', fullpath ', fullpath, ' -> ', lookUpId? lookUpId : 'UNKNOWN');//, ', module ', module);//DEBUG

						if (lookUpId) {

							// console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ',id, ' -> ', lookUpId,', fullpath ', fullpath);//, ', module ', module);//DEBUG

							id = lookUpId;

							module.libIdent = function() {
								return id;
							}

							module.id = id;
						}
					// }
				}
			}, this);
		};

		if (!compiler.hooks || !compiler.hooks.compilation) {
			compiler.plugin('compilation', function(compilation) {
				compilation.plugin("before-module-ids", processModules)
			});
		} else {
			compiler.hooks.compilation.tap('ReplaceModuleIdPlugin', compilation => {
				compilation.hooks.beforeModuleIds.tap('ReplaceModuleIdPlugin', processModules);
			});
		}

	}
}

module.exports = ReplaceModuleIdPlugin;
