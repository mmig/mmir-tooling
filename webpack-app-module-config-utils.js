/*
 * generates (strigified) module code from app-specific configruation:
 *  * additional/replaced modules/module-paths
 *  * included (optional) modules/functionality
 */

var path = require('path');
var fs = require('fs');

/**
 * [description]
 * @param  {PlainObject} mmirAppConfig JSON-like configuration object:
 * 							mmirAppConfig.config: module configuration object (analogous to requirejs module configuration)
 * 							mmirAppConfig.paths: mapping of module names to file-paths (additional or overwriting implemenation of existing modules)
 * @return {string} stringified module code
 */
var generateFromAppConfig = function(mmirAppConfig){

	var moduleImplStr = '';
	var moduleExportsStr = '';
	if(mmirAppConfig){

		var moduleExports = [];
		if(mmirAppConfig.config) {
			moduleImplStr += 'var appConfig = ' + JSON.stringify([{config: mmirAppConfig.config}], null, 2) + ';\n';
			moduleExports.push(['configList', 'appConfig']);
			// console.log('app config module -> appConfig: ', moduleImplStr);
		}

		if(mmirAppConfig.includeModules) {
			// ['asyncGrammar'] -> 'var doIncludeModules = function(){\n  require.resolve("mmirf/asyncGrammar");\n};\n';

			var rePrefix = /^(mmirf\/)|mmir-plugin-/;
			moduleImplStr += 'var doIncludeModules = function(){\n' +
						mmirAppConfig.includeModules.map(function(incl){
							incl = rePrefix.test(incl) || fs.existsSync(incl)? incl : 'mmirf/' + incl;
							return '  require.resolve("'+incl+'");'
						}).join('\n') +
				'\n};\n';

			moduleExports.push(['applyIncludes', 'doIncludeModules']);
			// console.log('app config module -> includeModules: ', moduleImplStr);
		}

		if(mmirAppConfig.loadAfterInit) {
			// ['grammar/de'] -> 'var doLoadAfterInit = function(){\n  require("mmirf/grammar/de");\n};\n';

			var rePrefix = /^(mmirf\/)|mmir-plugin-/;
			moduleImplStr += 'var doLoadAfterInit = function(){\n' +
						mmirAppConfig.loadAfterInit.map(function(incl){
							incl = rePrefix.test(incl) || fs.existsSync(incl)? incl : 'mmirf/' + incl;
							return '  require("'+incl+'");'
						}).join('\n') +
				'\n};\n';

			moduleExports.push(['applyAutoLoads', 'doLoadAfterInit']);
			// console.log('app config module -> doLoadAfterInit: ', moduleImplStr);
		}

		if(mmirAppConfig.loadBeforeInit) {
			// ['polyfill'] -> 'var doLoadBeforeInit = function(){\n  require("mmirf/polyfill");\n};\n';

			var rePrefix = /^(mmirf\/)|mmir-plugin-/;
			moduleImplStr += 'var doLoadBeforeInit = function(){\n' +
						mmirAppConfig.loadBeforeInit.map(function(incl){
							incl = rePrefix.test(incl) || fs.existsSync(incl)? incl : 'mmirf/' + incl;
							return '  require("'+incl+'");'
						}).join('\n') +
				'\n};\n';

			moduleExports.push(['applyAutoPreloads', 'doLoadBeforeInit']);
			// console.log('app config module -> doLoadBeforeInit: ', moduleImplStr);
		}

		if(mmirAppConfig.runtimeSettings) {
			moduleImplStr += 'var appSettings = ' + JSON.stringify(mmirAppConfig.runtimeSettings, null, 2) + ';\n';
			moduleExports.push(['settings', 'appSettings']);
			// console.log('app config module -> settings: ', moduleImplStr);
		}

		if(mmirAppConfig.jquery){
			moduleImplStr += 'var doInitJQuery = function(){ require("mmirf/core").jquery = require("jquery"); };\n';
			moduleExports.push(['jqueryInit', 'doInitJQuery']);
		}

		moduleExportsStr = moduleExports.length > 0?
			'{' + (moduleExports.map(
					function(pairs){
						return pairs[0] +': ' + pairs[1];
					})).join(',\n')+
			'};' : 'false;';

	} else {

		moduleExportsStr = 'false;';
	}

	// console.log('app config module exports: ', moduleExportsStr);
	// // console.log('app config module impl.: ', moduleImplStr);

	return moduleImplStr + '\nmodule.exports=' + moduleExportsStr;
}

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
	// alias['mmirf/util/loadFile'] = path.resolve('./webpack-loadFile.js');
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
	generateModuleCode: generateFromAppConfig,
	addAliasFrom: addAliasFrom,

	addIncludeModule: addIncludeModule,
	addAutoLoadModule: addAutoLoadModule,
	addAppSettings: addAppSettings
}
