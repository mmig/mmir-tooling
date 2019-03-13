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

function getModId(_modPaths, path, fileExtensions, originalId) {
	if(!path){
		// console.log(' ReplaceModuleIdPlugin: handle empty path for (original) ID '+originalId+' -> alias: ', _modPaths[originalId], _modPaths);//DEBUG
		if(originalId){
			if(_modPaths[originalId]){
				// console.log(' ReplaceModuleIdPlugin: handle empty path, but original ID '+originalId+' has module ID entry, using the orginial ID...');//DEBUG
				return originalId;
			}
			var normalizedOrigId = idFromPath(originalId);
			if(_modPaths[normalizedOrigId]){
				// console.log(' ReplaceModuleIdPlugin: handle empty path, but normalized original ID '+normalizedOrigId+' has module ID entry, using the normalized ID...');//DEBUG
				return normalizedOrigId;
			}
		}
		return '';
	}
	var clpath = path.replace(fileExtensions, '');
	clpath = clpath === path? null : clpath;
	var val;
	var results = [];
	for (var p in _modPaths) {
		val = _modPaths[p];
		if (val === path || val === clpath) {
			results.push(p);
		} else if(clpath && clpath.indexOf(val) === 0){
			// console.log('  handle package alias "'+clpath+'" -> ', p + idFromPath(clpath.substring(val.length)));//DEBUG
			results.push(p + idFromPath(clpath.substring(val.length)));
		}
	}
	var len = results.length;
	if(len > 0){
		if(len === 1){
			return results[0];
		}
		//if there are multiple entries/IDs -> use shortest one!
		results.sort(function(a, b){
			return a.length - b.length;
		});
		// console.log('  handle multiple results: ', results, ': '+originalId+' -> "'+results[0]+'"');//DEBUG
		return results[0];
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
	constructor(alias, mmirLibDir, fileExtensions) {
		this.alias = alias || {};
		this.mmirDir = mmirLibDir;
		this.fileExtensions = fileExtensions;
			// console.log('ReplaceModuleIdPlugin.constructor: alias -> ', JSON.stringify(alias));
	}

	apply(compiler) {

		var processModules = (modules) => {
			// console.log('ReplaceModuleIdPlugin.beforeModuleIds: ', modules.filter(function(mod){return /parsingResult/.test(mod.rawRequest)}));

			var aliasLookup = this.alias;
			var fileExtensions = this.fileExtensions;

			// console.log('ReplaceModuleIdPlugin.beforeModuleIds: current dir "'+__dirname+'", mmir-lib dir "'+this.mmirDir+'", checking '+JSON.stringify(aliasLookup)); //DEBUG

			modules.forEach(function(module) {
				if (module.id === null && module.libIdent) {
					var id = path.normalize( module.libIdent({
						context: compiler.options.context
					}));
					var fullpath = getAbsolutePath(compiler, this.mmirDir, id);

					// console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ', id, ', fullpath ', fullpath); //, ', module ', module);//DEBUG

					var lookUpId = getModId(aliasLookup, fullpath, fileExtensions, id);

					// if(/mmir-plugin-/.test(fullpath)) console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ',id, ', fullpath ', fullpath, ' -> ', lookUpId? lookUpId : 'UNKNOWN');//, ', module ', module);//DEBUG
					// if(/mmir-plugin-/.test(id)) console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ',id, ', fullpath ', fullpath, ' -> ', lookUpId? lookUpId : 'UNKNOWN');//, ', module ', module);//DEBUG

					if (lookUpId) {

						// if(/controller/.test(lookUpId)) console.log('ReplaceModuleIdPlugin.beforeModuleIds->forEach id ',id, ' -> ', lookUpId,', fullpath ', fullpath);//, ', module ', module);//DEBUG

						id = lookUpId;

						module.libIdent = function() {
							return id;
						}

						module.id = id;
					}
				} else if(process.env.verbose) {
					console.log('[WARN] ReplaceModuleIdPlugin.beforeModuleIds: cannot process module ', module);
				}
			}, this);
		};

		if (!compiler.hooks || !compiler.hooks.compilation) {
			compiler.plugin('compilation', function(compilation) {
				compilation.plugin('before-module-ids', processModules)
			});
		} else {
			compiler.hooks.compilation.tap('ReplaceModuleIdPlugin', compilation => {
				compilation.hooks.beforeModuleIds.tap('ReplaceModuleIdPlugin', processModules);
			});
		}

	}
}

module.exports = ReplaceModuleIdPlugin;
