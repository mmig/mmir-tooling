
var path = require('path');

/**
 * add/overwrite module alias (i.e. mapping module ID to file path)
 *
 * @param  {{paths?: {[moduleId: string]: string}}} mmirAppConfig the app-specific configuration: applies module-path-specifications from mmirAppConfig.paths
 * @param  {[{[moduleId: string]: string}]} alias the (default) mapping of module IDs to (absolute) paths
 */
var addAliasFrom = function(mmirAppConfig, alias){

	if(mmirAppConfig && mmirAppConfig.paths){
		// console.log('adding/overwriting paths with app paths: ', mmirAppConfig.paths);
		// Object.assign(alias, mmirAppConfig.paths);
		var appRoot = mmirAppConfig.rootPath || process.cwd();
		var p;
		for (var n in mmirAppConfig.paths) {
			p = mmirAppConfig.paths[n];
			alias[n] = path.isAbsolute(p)? p : path.join(appRoot, p);
			// aliasList.push(n);
		}
		// console.log('set paths to -> ', alias);
	}

	//DISABLED redirection must be handled by NormalModuleReplacementPlugin, because loadFile is not directly require'ed, but vie package (sub) path 'mmirf/util'
	// //add "proxy" for mmirf/util/loadFile, so that inlined resouces get returned directly:
	// alias['mmirf/util/loadFile'] = path.resolve('./runtime/webpack-loadFile.js');
	// var origLoadFile = path.resolve(alias['mmirf/util'], 'loadFile.js');
	// alias['mmirf/util/loadFile__raw'] = origLoadFile;

}


function toAliasPath(moduleFilePath){
	return path.normalize(moduleFilePath);
}

function addAutoLoadModule(appConfig, id, file){
	doAddModule(appConfig, 'loadAfterInit', id, file);
}

function addIncludeModule(appConfig, id, file){
	doAddModule(appConfig, 'includeModules', id, file);
}

function doAddModule(appConfig, includeType, id, file){

	if(!appConfig.paths){
		appConfig.paths = {};
	}

	if(!appConfig[includeType]){
		appConfig[includeType] = [];
	}

	var id = id;
	appConfig.paths[id] = toAliasPath(file);
	appConfig[includeType].push(id);
}

function addAppSettings(appConfig, id, settings){

	if(!appConfig.runtimeSettings){
		appConfig.runtimeSettings = {};
	}
	appConfig.runtimeSettings[id] = settings;
}

module.exports = {
	addModulePaths: function(userConfig, mmirAppConfig){
		if(userConfig.modulePaths){
			for(var p in userConfig.modulePaths){
				mmirAppConfig.paths[p] = userConfig.modulePaths[p];
			}
		}
	},
	addModuleConfigs: function(userConfig, mmirAppConfig){
		if(userConfig.moduleConfigs){
			if(!mmirAppConfig.config){
				mmirAppConfig.config = {};
			}
			for(var c in userConfig.moduleConfigs){
				mmirAppConfig.config[c] = userConfig.moduleConfigs[c];
			}
		}
	},
	addAliasFrom: addAliasFrom,

	addIncludeModule: addIncludeModule,
	addAutoLoadModule: addAutoLoadModule,
	addAppSettings: addAppSettings
}
