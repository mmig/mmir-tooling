
var path = require('path');

/**
 * add/overwrite module alias (i.e. mapping module ID to file path)
 *
 * @param  {{paths?: {[moduleId: string]: string}}} mmirAppConfig the app-specific configuration: applies module-path-specifications from mmirAppConfig.paths
 * @param  {[{[moduleId: string]: string}]} alias the (default) mapping of module IDs to (absolute) paths
 */
var addAliasFrom = function(mmirAppConfig, alias){

	if(mmirAppConfig && mmirAppConfig.paths){
		// log('adding/overwriting paths with app paths: ', mmirAppConfig.paths);
		// Object.assign(alias, mmirAppConfig.paths);
		var appRoot = mmirAppConfig.rootPath || process.cwd();
		var p;
		for (var n in mmirAppConfig.paths) {
			p = mmirAppConfig.paths[n];
			alias[n] = path.isAbsolute(p)? p : path.join(appRoot, p);
			// aliasList.push(n);
		}
		// log('set paths to -> ', alias);
	}

	//DISABLED redirection must be handled by NormalModuleReplacementPlugin, because loadFile is not directly require'ed, but vie package (sub) path 'mmirf/util'
	// //add "proxy" for mmirf/util/loadFile, so that inlined resouces get returned directly:
	// alias['mmirf/util/loadFile'] = path.resolve('./runtime/webpack-loadFile.js');
	// var origLoadFile = path.resolve(alias['mmirf/util'], 'loadFile.js');
	// alias['mmirf/util/loadFile__raw'] = origLoadFile;

}

function contains(list, entry){
	return list.findIndex(function(item){
		return item === entry;
	}) !== -1;
}

function toAliasPath(moduleFilePath){
	return path.normalize(moduleFilePath);
}

function registerModuleId(appConfig, id, file){
	doRegisterModuleId(appConfig, id, file);
}

function addAutoLoadModule(appConfig, id, file){
	doAddModule(appConfig, 'loadAfterInit', id, file);
}

function addIncludeModule(appConfig, id, file){
	doAddModule(appConfig, 'includeModules', id, file);
}

function doAddModule(appConfig, includeType, id, file){

	if(file){
		doRegisterModuleId(appConfig, id, file);
	}

	if(!appConfig[includeType]){
		appConfig[includeType] = [];
	}

	if(!contains(appConfig[includeType], id)){
		appConfig[includeType].push(id);
	}
}

function doRegisterModuleId(appConfig, id, file){

	if(!appConfig.paths){
		appConfig.paths = {};
	}
	appConfig.paths[id] = toAliasPath(file);
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

	/** add alias (i.e. "lookup information" for module ID -> file) for module */
	registerModuleId: registerModuleId,
	/** add alias (i.e. "lookup information") for module AND include module in main script */
	addIncludeModule: addIncludeModule,
	/** add alias (i.e. "lookup information") for module AND "auto-load" module in main script during initialization */
	addAutoLoadModule: addAutoLoadModule,
	addAppSettings: addAppSettings
}
