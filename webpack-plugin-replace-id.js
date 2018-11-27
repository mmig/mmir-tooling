'use strict';
var path = require('path');
var fs = require('fs');

var dir = __dirname;

var reNormalize = path.sep !== '/'? new RegExp(path.sep.replace(/\\/g, '\\\\'), 'g') : null;
var idFromPath = function(path){
  if(reNormalize){
    path = path.replace(reNormalize, '/');
  }
  return path;
}

function getModId(_modPaths, path) {
	if(!path){
		return '';
	}
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

function doGetAbsolutePath(ctxPath, list, id) {
	var fullpath = path.resolve(ctxPath, id);
	if(fs.existsSync(fullpath)){
		return fullpath;
	}
	for(var i = 0, size = list.length - 1; i < size; ++i){
		fullpath = path.resolve(list[i], id);
		if(fs.existsSync(fullpath)){
			return fullpath;
		}
	}
}

function getAbsolutePath(compiler, mmirDir, id) {
	return doGetAbsolutePath(compiler.options.context, [process.cwd(), dir, mmirDir], id);
}

//based on https://stackoverflow.com/a/34637718/4278324

class ReplaceModuleIdPlugin {
	constructor(alias, mmirLibDir) {
		this.alias = alias || {};
		this.mmirDir = mmirLibDir;
	}

	apply(compiler) {

		var processModules = (modules) => {
			// console.log('ReplaceModuleIdPlugin.beforeModuleIds: ', modules);

			var aliasLookup = this.alias;
			var cwd = process.cwd();

			// console.log('ReplaceModuleIdPlugin.beforeModuleIds: current dir "'+__dirname+'", mmir-lib dir "'+this.mmirDir+'", checking '+JSON.stringify(aliasLookup)); //DEBUG

			var fix_index;

			modules.forEach(function(module) {
				if (module.id === null && module.libIdent) {
					var id = path.normalize( module.libIdent({
						context: compiler.options.context
					}));
					var fullpath = getAbsolutePath(compiler, this.mmirDir, id);

					// console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ', id, ', fullpath ', fullpath); //, ', module ', module);//DEBUG

					var lookUpId = getModId(aliasLookup, fullpath);

					// console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ',id, ', fullpath ', fullpath, ' -> ', lookUpId? lookUpId : 'UNKNOWN');//, ', module ', module);//DEBUG

					if (lookUpId) {

						// console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ',id, ' -> ', lookUpId,', fullpath ', fullpath);//, ', module ', module);//DEBUG

						id = lookUpId;

						module.libIdent = function() {
							return id;
						}

						module.id = id;
					}
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
