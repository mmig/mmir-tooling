const path = require('path');
// const webpack = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

var fileUtils = require('./webpack-filepath-utils.js');
var appConfigUtils = require('./webpack-app-module-config-utils.js');

// ---------------------------------------

// var AddToContextPlugin = require('./webpack-plugin-add-to-context.js');
var ReplaceModuleIdPlugin = require('./webpack-plugin-replace-id.js');

// var VirtualModulePlugin = require('virtual-module-webpack-plugin');

// ---------------------------------------

var isDisableLogging = false;

// console.log('mmir-lib: ', require('mmir-lib'))

//FIXME
// var rootDir = __dirname;
var rootDir;
// try {
	rootDir = path.dirname(require.resolve('mmir-lib'));
// } catch(err){
// 	rootDir = __dirname;
// }
var webpackRootDir = __dirname;
console.log('mmir-lib path: ', rootDir);
console.log('mmir-webpack path: ', webpackRootDir);

// console.log('######### cwd: ', process.cwd());
// console.log('######### argv[0]: ', process.argv[0]);
// console.log('######### argv[1]: ', process.argv[1]);
// console.log('######### argv0: ', process.argv0);

var createResolveAlias = function(mmirAppConfig){

	var paths = require('./webpack-resources-paths.js').paths;

	var alias = {};
	// var aliasList = [];
	for (var n in paths) {
		if(/^build-tool\//.test(n)){
			alias[n] = path.join(webpackRootDir, paths[n]);
		} else {
			alias[n] = path.join(rootDir, paths[n]);
		}
		// aliasList.push(n);
	}

	// if(mmirAppConfig && mmirAppConfig.paths){
	// 	// console.log('adding/overwriting paths with app paths: ', mmirAppConfig.paths);
	// 	// Object.assign(alias, mmirAppConfig.paths);
	// 	var appRoot = mmirAppConfig.rootPath || process.cwd();
	// 	var p;
	// 	for (var n in mmirAppConfig.paths) {
	// 		p = mmirAppConfig.paths[n];
	// 		alias[n] = path.isAbsolute(p)? p : path.join(appRoot, p);
	// 		// aliasList.push(n);
	// 	}
	// 	// console.log('set paths to -> ', alias);
	// }
	appConfigUtils.addAliasFrom(mmirAppConfig, alias);

	if(isDisableLogging){
		alias['mmirf/logger'] = alias['mmirf/loggerDisabled'];
	}

	return alias;
}

var createModuleRules = function(mmirAppConfig){


	// var mmirAppConfigContent = 'module.exports=';
	// if(mmirAppConfig){
	// 	mmirAppConfigContent = JSON.stringify({config: mmirAppConfig.config});
	// } else {
	// 	mmirAppConfigContent = 'false';
	// }
	var mmirAppConfigContent = appConfigUtils.generateModuleCode(mmirAppConfig);

	// console.log('###### creating module webpack-app-module-config.js with contents: '+ JSON.stringify(mmirAppConfigContent));

	var binFilePaths = require('./webpack-resources-paths.js').fileResources.map(function(val){
		return fileUtils.normalizePath(path.join(rootDir, val));
	});

	var textFilePaths = require('./webpack-resources-paths.js').textResources.map(function(val){
		return fileUtils.normalizePath(path.join(rootDir, val));
	});

	var appConfigModulePath = fileUtils.normalizePath(path.join(webpackRootDir, 'webpack-app-module-config.js'));

	//convert shims
	var shims = [
		//Shim Examples
		// {
		//   test: /handlebars/,
		//   use: [
		//     'imports-loader?this=>window',
		//     'exports-loader?Handlebars'
		//   ]
		// },
		// {
		//   test: /jquery\-1\.9\.1\.js/,
		//   use: [
		//     'imports-loader?this=>window',
		//     'exports-loader?jQuery'
		//   ]
		// },
		// {
		//   test: /backbone/,
		//   use: [
		//     'expose-loader?Backbone',
		//     'imports-loader?this=>window,jquery,underscore'
		//   ]
		// },
		// {
		//   test: /underscore/,
		//   loader: 'expose-loader?_' },
		// {
		//   test: /chaplin/,
		//   loader: 'imports-loader?this=>window,backbone'
		// },


		// {
		//   test: /main\.js/,
		//   use: [
		//     'imports-loader?webpackMmirConfig=build-tool/webpack-helper-module-config,logger=mmirf/logger',
		//     'exports-loader?window.mmir'
		//   ]
		// },
		// {
		//   test: /core\.js/,
		//   use: [
		//     'imports-loader?moduleConfigHelper=build-tool/module-config-helper',
		//     'exports-loader?window.mmir'
		//   ]
		// },

		{
			test: fileUtils.createFileTestFunc(binFilePaths, ' for [bin file]'),
			use: {
				loader: 'file-loader',
				options: {
					// name: '[path][name].[ext]',
					name: function(file) {
						if(file.indexOf(rootDir) === 0){
							file = file.substring(rootDir.length).replace(/^(\\|\/)/, '');
						}
						// console.log('file-loader -> ',file);
						return file;
					}
				}
			}
		},
		{
			test: fileUtils.createFileTestFunc([appConfigModulePath], ' for [app config]'),
			use: {
				loader: 'val-loader',
				options: {
          appConfigCode: mmirAppConfigContent
        }
			}
		},
		{
			test: fileUtils.createFileTestFunc(textFilePaths, ' for [text files]'),
			use: {
				loader: 'raw-loader'
			}
		}

	];
	return shims;
}

var createPlugins = function(webpackInstance, alias){//, mmirAppConfig){
	//
	// var mmirAppConfigContent = "/*virtual module for injecting mmir app-specific configuration*/\nmodule.exports=";
	// if(mmirAppConfig){
	// 	mmirAppConfigContent += (typeof mmirAppConfig === 'string'? mmirAppConfig : JSON.stringify({config: mmirAppConfig.config}));
	// } else {
	// 	mmirAppConfigContent += "false;"
	// }
	//
	// console.log('###### creating module webpack-app-module-config.js with contents: '+ JSON.stringify(mmirAppConfigContent));

	var plugins = [
		new webpackInstance.ProvidePlugin({
			'module.config': ['build-tool/module-config-helper', 'config'],
		}),
		new webpackInstance.IgnorePlugin(/^xmlhttprequest$/),
		// new AddToContextPlugin(aliasList),
		new ReplaceModuleIdPlugin(alias, rootDir),
		// new CopyWebpackPlugin([
		// 	// { from: 'workers/*', to: 'mmirf' },
		// 	{
		// 		from: 'vendor/sounds/*',
		// 		to: 'mmirf'
		// 	},
		// ]) //, options)
		// new VirtualModulePlugin({
		// 	moduleName: './webpack-app-module-config.js',
		// 	contents: mmirAppConfigContent
		// }),
		new webpackInstance.DefinePlugin({
			'WEBPACK_BUILD': JSON.stringify(true),
		})
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

		// // add loader resolving:
		// //  * worker-loader
		// //  * file-loader
		// if(!webpackConfig.resolveLoader){
		// 	webpackConfig.resolveLoader = {moduleExtensions: ["-loader"]};
		// } else {
		// 	if(webpackConfig.resolveLoader.moduleExtensions){
		// 		webpackConfig.resolveLoader.moduleExtensions.push("-loader");
		// 	} else {
		// 		webpackConfig.resolveLoader.moduleExtensions = ["-loader"];
		// 	}
		// }

		//add loader configurations:
		var shims = createModuleRules(mmirAppConfig);
		if(!webpackConfig.module){
			webpackConfig.module = {};
		}
		var targetList = webpackConfig.module.rules || (useRulesForLoaders? null : webpackConfig.module.loaders);
		if(!targetList){
			targetList = [];
			webpackConfig.module[useRulesForLoaders? 'rules': 'loaders'] = targetList;
		}
		for(var i = 0, size = shims.length; i < size; ++i){
			targetList.push(shims[i]);
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
