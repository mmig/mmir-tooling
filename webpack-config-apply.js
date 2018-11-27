const path = require('path');

var fileUtils = require('./webpack-filepath-utils.js');
var appConfigUtils = require('./webpack-app-module-config-utils.js');


var ReplaceModuleIdPlugin = require('./webpack-plugin-replace-id.js');

var isDisableLogging = false;

// console.log('mmir-lib: ', require('mmir-lib'))

var rootDir = path.dirname(require.resolve('mmir-lib'));
var webpackRootDir = __dirname;

// console.log('mmir-lib path: ', rootDir);
// console.log('mmir-webpack path: ', webpackRootDir);

// console.log('######### cwd: ', process.cwd());
// console.log('######### argv[0]: ', process.argv[0]);
// console.log('######### argv[1]: ', process.argv[1]);
// console.log('######### argv0: ', process.argv0);

var createResolveAlias = function(mmirAppConfig){

	var paths = require('./webpack-resources-paths.js').paths;

	var alias = {};
	for (var n in paths) {
		if(/^build-tool\//.test(n)){
			alias[n] = path.join(webpackRootDir, paths[n]);
		} else {
			alias[n] = path.join(rootDir, paths[n]);
		}
	}

	appConfigUtils.addAliasFrom(mmirAppConfig, alias);

	if(isDisableLogging){
		alias['mmirf/logger'] = alias['mmirf/loggerDisabled'];
	}

	return alias;
}

var createModuleRules = function(mmirAppConfig){

	var mmirAppConfigContent = appConfigUtils.generateModuleCode(mmirAppConfig);

	// console.log('###### creating module webpack-app-module-config.js with contents: '+ JSON.stringify(mmirAppConfigContent));

	var binFilePaths = require('./webpack-resources-paths.js').fileResources.map(function(val){
		return fileUtils.normalizePath(path.join(rootDir, val));
	});

	var textFilePaths = require('./webpack-resources-paths.js').textResources.map(function(val){
		return fileUtils.normalizePath(path.join(rootDir, val));
	});

	var appConfigModulePath = fileUtils.normalizePath(path.join(webpackRootDir, 'webpack-app-module-config.js'));

	var moduleRules = [

		// handle binary files (e.g. *.mp3):
		{
			test: fileUtils.createFileTestFunc(binFilePaths, ' for [bin file]'),
			use: {
				loader: 'file-loader',
				options: {
					name: function(file) {
						//use relative path path (from root) in target/output directory for the resouce:
						if(file.indexOf(rootDir) === 0){
							file = file.substring(rootDir.length).replace(/^(\\|\/)/, '');
						}
						// console.log('file-loader -> ',file);
						return file;
					}
				}
			}
		},

		// creates a module implementation for the app-config:
		{
			test: fileUtils.createFileTestFunc([appConfigModulePath], ' for [app config]'),
			use: {
				loader: 'val-loader',
				options: {
          appConfigCode: mmirAppConfigContent
        }
			}
		},

		// handle/include "raw" text files:
		{
			test: fileUtils.createFileTestFunc(textFilePaths, ' for [text files]'),
			use: {
				loader: 'raw-loader'
			}
		}

	];
	return moduleRules;
}

var createPlugins = function(webpackInstance, alias){

	var plugins = [

		// enable replacement implementation for requirejs' module.config()
		// NOTE: in difference to the requirejs implementation, this does need the module as first parameter, i.e. something like
		//      module.config(module) -> webpack_build_tool_module_config_helper_config(module)
		new webpackInstance.ProvidePlugin({
			'module.config': ['build-tool/module-config-helper', 'config'],
		}),

		// ignore modules that are specific for running mmir in node environment:
		new webpackInstance.IgnorePlugin(/^xmlhttprequest$/),

		// set custom module-IDs from alias-definitions for mmir-modules (enables mmir.require(<moduleId>))
		new ReplaceModuleIdPlugin(alias, rootDir),

		// set environment variable WEBPACK_BUILD for enabling webpack-specific code
		new webpackInstance.DefinePlugin({
			'WEBPACK_BUILD': JSON.stringify(true),
		}),

		// redirect entry-point of mmir-lib to the webpack bootstrap/entry point
		new webpackInstance.NormalModuleReplacementPlugin(
			/requirejs-main\.js/,
			function(resource) {
				if(resource.rawRequest === 'mmir-lib'){//<- only redirect, if the file was requested via 'mmir-lib' (e.g. if requested directly via its path, do not redirect)
					// console.log('replacing module ', resource.request, ' -> ', path.join(webpackRootDir, 'webpack-main.js'))//, ', for ', resource);
					resource.request = path.join(webpackRootDir, 'webpack-main.js');
					resource.resource = resource.request;
				}
				// else {
				// 	console.log('ingnoring module replacement for ', resource.request);
				// }
			}
		)
	];

	return plugins;
};

module.exports = {
	/**
	 * disable logging in mmir-lib
	 */
	disableLogging: function(value){
		isDisableLogging = typeof value === 'boolean'? value : true;
	},
	/**
	 * apply webpack configuration for mmir-lib to an existing webpack configuration
	 *
	 * @param  {[type]} webpackInstance the webpack instance, e.g. retrieve via require('webpack')
	 * @param  {[type]} webpackConfig the existing webpack configuration
	 * @param  {[type]} mmirAppConfig app-specific configuration for mmir-lib
	 */
	apply: function(webpackInstance, webpackConfig, mmirAppConfig){

		// console.log('############################## webpack-version: ', JSON.stringify(webpackInstance.version))

		var useRulesForLoaders = webpackInstance.version && parseFloat(webpackInstance.version) >= 4? true : false;

		if(typeof mmirAppConfig === 'string'){
			mmirAppConfig = JSON.parse(mmirAppConfig);
		}

		//add alias resolving:
		var alias = createResolveAlias(mmirAppConfig);
		if(!webpackConfig.resolve){
			webpackConfig.resolve = {alias: alias};
		} else {
			if(webpackConfig.resolve.alias){
				Object.assign(webpackConfig.resolve.alias, alias);
			} else {
				webpackConfig.resolve.alias = alias;
			}
		}

		//add loader configurations:
		var moduleRules = createModuleRules(mmirAppConfig);
		if(!webpackConfig.module){
			webpackConfig.module = {};
		}
		var targetList = webpackConfig.module.rules || (useRulesForLoaders? null : webpackConfig.module.loaders);
		if(!targetList){
			targetList = [];
			webpackConfig.module[useRulesForLoaders? 'rules': 'loaders'] = targetList;
		}
		for(var i = 0, size = moduleRules.length; i < size; ++i){
			targetList.push(moduleRules[i]);
		}

		//add plugins
		var plugins = createPlugins(webpackInstance, alias);// mmirAppConfig);
		if(!webpackConfig.plugins){
			webpackConfig.plugins = plugins;
		} else {
			for(var i = 0, size = plugins.length; i < size; ++i){
				webpackConfig.plugins.push(plugins[i]);
			}
		}

		//add webworker loader configuration
		require('./webpack-worker-loader-config').apply(webpackConfig, rootDir, useRulesForLoaders);
	}
};
