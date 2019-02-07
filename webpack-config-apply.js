const path = require('path');
const process = require('process');
const _ = require('lodash');

var fileUtils = require('./webpack-filepath-utils.js');
var appConfigUtils = require('./webpack-app-module-config-utils.js');
var directoriesJsonUtils = require('./mmir-directories-util.js');


var ReplaceModuleIdPlugin = require('./webpack-plugin-replace-id.js');

var VirtualModulePlugin = require('virtual-module-webpack-plugin');

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

	var appRootDir = mmirAppConfig.rootPath || process.cwd();

	var directories = directoriesJsonUtils.createDirectoriesJson();

	//get (optional) configuration from mmirAppConfig
	var runtimeConfig = mmirAppConfig.configuration;//{language: 'de'};

	var settingsUtil = require('./settings-utils.js');
	var settingsOptions = mmirAppConfig.settings;
	var settings = settingsUtil.jsonSettingsFromDir(settingsOptions, appRootDir);
	// console.log('JSON settings: ', settings);
	// console.log('JSON configuration setting: ', settingsUtil.getConfiguration(settings));

	//add configuration from mmirAppConfig for merging, if necessary
	if(runtimeConfig){
		// console.log('JSON configuration settings: adding & merging mmirAppConfig.configuration ', runtimeConfig);//DEBU
		settings.push({type: 'configuration', file: 'configuration://options', value: runtimeConfig});//<- push "mmirAppConfig.confiuration" into the end of parsed settings files
	}
	settingsUtil.normalizeConfigurations(settings);
	// console.log('JSON configuration setting (merge test): ', settingsUtil.getConfiguration(settings));//DEBU
	runtimeConfig = settingsUtil.getConfiguration(settings).value;


	var grammarUtils = require('./grammar-utils.js');
	var grammarOptions = mmirAppConfig.grammars;
	//exmaple:
	// var grammarOptions = {
	// 	directory: './config/languages',
	// 	engine: 'pegjs',
	// 	grammars: {
	// 		ja: {ignore: true},
	// 		de: {exclude: true},
	// 		en: {engine: 'jison', async: true},
	//
	// 		//specifying JSON grammar files directly
	// 		testing: {engine: 'jscc', file: path.resolve('./config/languages/de/grammar.json')},
	// 		testing2: {id: '!id warning!', engine: 'jison', file: path.resolve('./config/languages/de/grammar.json_large-example')}
	// 		// testing_id_collision TODO : {engine: 'jison', file: path.resolve('./config/languages/de/grammar.json_large-example')}
	//
	// 	}
	// };

	//TODO(?):
			// mmir.semantic = semanticInterpreter;
			// /** set synchronous/asynchronous compile-mode for grammar compilation
			//  * @see mmir.SemanticInterpreter#setEngineCompileMode
			//  * @type Boolean
			//  * @memberOf main */
			// var grammarCompileMode = configurationManager.get('grammarAsyncCompileMode');
			// if(typeof grammarCompileMode !== 'undefined'){
			// 	semanticInterpreter.setEngineCompileMode(grammarCompileMode);
			// }

	var grammars = [];
	if(grammarOptions && grammarOptions.directory){
		grammarUtils.jsonGrammarsFromDir(grammarOptions, appRootDir, grammars);
	}
	if(grammarOptions && grammarOptions.grammars){
		grammarUtils.jsonGrammarsFromOptions(grammarOptions, appRootDir, grammars);
	}

	// console.log('JSON grammars: ', grammars, grammarOptions);

	grammarUtils.addGrammarsToAppConfig(grammars, mmirAppConfig, directories, runtimeConfig);


	/////////////////////////////////////////////////////////////////////////////////////

	var scxmlUtils = require('./scxml-utils.js');
	var scxmlOptions = mmirAppConfig.stateMachines;
	//exmaple:
	// {
	// 	directory: './config/statedef_large',
	// 	models: {
	// 		input: {
	// 			mode: 'simple',
	// 			file: './config/statedef_minimal/inputDescriptionSCXML.xml'
	// 		},
	// 		dialog: {
	// 			mode: 'extended'
	// 		}
	// 	}
	// }
	var scxmlModels = [];
	if(scxmlOptions && scxmlOptions.directory){
		// console.log('including SCXML models from directory ', scxmlOptions.directory);//DEBU
		scxmlUtils.scxmlFromDir(scxmlOptions, appRootDir, scxmlModels);
	}
	if(scxmlOptions && scxmlOptions.models){
		// console.log('including SCXML models from options ', scxmlOptions.models);//DEBU
		scxmlUtils.scxmlFromOptions(scxmlOptions, appRootDir, scxmlModels);
	}
	// console.log('SCXML models: ', scxmlModels, scxmlOptions);//DEBUG

	scxmlUtils.addScxmlToAppConfig(scxmlModels, mmirAppConfig, directories, runtimeConfig);


	/////////////////////////////////////////////////////////////////////////////////////

	//FIXME include controllers!

	var viewUtils = require('./view-utils.js');

	var viewOptions = mmirAppConfig.views;
	//exmaple:
	// var viewOptions = {
	// 	directory: './views',
	// }

	var views = [];
	if(viewOptions && viewOptions.directory){
		views = viewUtils.viewTemplatesFromDir(viewOptions.directory, appRootDir);
	}

	//TODO impl./support loading indivual views similar to grammars

	// console.log('view templates: ', views);


	viewUtils.addViewsToAppConfig(views, mmirAppConfig, directories, runtimeConfig);

	/////////////////////////////////////////////////////////////////////////////////////

	var implUtils = require('./impl-utils.js');

	var ctrlOptions = mmirAppConfig.controllers;
	var ctrlList = [];
	implUtils.implFromDir('controller', ctrlOptions, appRootDir, ctrlList);
	console.log('controllers: ', ctrlList, ctrlOptions);
	implUtils.addImplementationsToAppConfig(ctrlList, mmirAppConfig, directories, runtimeConfig);

	var helperOptions = mmirAppConfig.helpers;
	var helperList = [];
	implUtils.implFromDir('helper', helperOptions, appRootDir, helperList);
	console.log('helpers: ', helperList, helperOptions);
	implUtils.addImplementationsToAppConfig(helperList, mmirAppConfig, directories, runtimeConfig);

	var modelOptions = mmirAppConfig.models;
	var modelList = [];
	implUtils.implFromDir('model', modelOptions, appRootDir, modelList);
	console.log('models: ', modelList, modelOptions);
	implUtils.addImplementationsToAppConfig(modelList, mmirAppConfig, directories, runtimeConfig);

	// //FIXME TEST adding dummy controllers -> TODO load real ones, only create dummy ones if real one is missing
	// var ctrlImpls = viewUtils.getCtrlImpl();
	// // console.log('ctrl-code for view templates: ', ctrlImpls);
	// if(!mmirAppConfig.webpackPlugins){
	// 	mmirAppConfig.webpackPlugins = [];
	// }
	// ctrlImpls.forEach(function(impl){
	// 	directoriesJsonUtils.addCtrl(directories, impl.moduleName);
	// 	mmirAppConfig.webpackPlugins.push(new VirtualModulePlugin(impl));
	// });

	/////////////////////////////////////////////////////////////////////////////////////

	// console.log(' configuration.json -> ', JSON.stringify(runtimeConfig));//DEBU
	// appConfigUtils.addAppSettings(mmirAppConfig, 'mmirf/settings/configuration', runtimeConfig);

	settingsUtil.addSettingsToAppConfig(settings, mmirAppConfig, directories, runtimeConfig);//, /configuration/i);

	/////////////////////////////////////////////////////////////////////////////////////

	//FIXME TEST
	// directoriesJsonUtils.addDictionary(directories, 'mmirf/settings/dictionary/en');
	// console.log(' directories.json -> ', JSON.stringify(directories));//DEBU
	appConfigUtils.addAppSettings(mmirAppConfig, 'mmirf/settings/directories', directories);

	// console.log('###### mmirAppConfig: '+ JSON.stringify(mmirAppConfig));

	var mmirAppConfigContent = appConfigUtils.generateModuleCode(mmirAppConfig);
	var appConfigModulePath = fileUtils.normalizePath(path.join(webpackRootDir, 'webpack-app-module-config.js'));

	// console.log('###### creating module webpack-app-module-config.js with contents: '+ JSON.stringify(mmirAppConfigContent));

	var binFilePaths = require('./webpack-resources-paths.js').fileResources.map(function(val){
		return fileUtils.normalizePath(path.join(rootDir, val));
	});

	var textFilePaths = require('./webpack-resources-paths.js').textResources.map(function(val){
		return fileUtils.normalizePath(path.join(rootDir, val));
	});

	var moduleRules = [

		// handle binary files (e.g. *.mp3):
		{
			test: fileUtils.createFileTestFunc(binFilePaths, ' for [raw file]'),
			use: {
				loader: 'file-loader',
				options: {
					name: function(file) {
						//use relative path path (from root) in target/output directory for the resouce:
						if(file.indexOf(rootDir) === 0){
							file = file.substring(rootDir.length).replace(/^(\\|\/)/, '');
						}
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
		},

		// compile JSON grammars & include executables if necessary:
		{
			test: fileUtils.createFileTestFunc(grammars.map(function(g){return g.file;}), ' for [grammar] files'),
			use: {
				loader: './mmir-grammar-loader.js',
				options: {mapping: grammars, config: grammarOptions},
			},
			type: 'javascript/auto'
		},

		// compile view templates & include if necessary:
		{
			test: fileUtils.createFileTestFunc(views.map(function(v){return v.file;}), ' for [view] files'),
			use: {
				loader: './mmir-view-loader.js',
				options: {mapping: views},
			},
			type: 'javascript/auto'
		},

		// compile SCXML models & include if necessary:
		{
			test: fileUtils.createFileTestFunc(scxmlModels.map(function(s){return s.file;}), ' for [scxml] files'),
			use: {
				loader: './mmir-scxml-loader.js',
				options: {mapping: scxmlModels},
			},
			type: 'javascript/auto'
		}

	];

	var settingsFiles = settings.filter(function(s){return s.include === 'file';});
	if(settingsFiles && settingsFiles.length > 0){

		if(!mmirAppConfig.webpackPlugins){
			mmirAppConfig.webpackPlugins = [];
		}

		mmirAppConfig.webpackPlugins.push(function(webpackInstance, alias, mmirAppConfig){
			return new webpackInstance.NormalModuleReplacementPlugin(
				/mmirf\/settings\/(configuration|dictionary|grammar|speech)\//i,
				function(resource) {
					if(alias[resource.request]){

						// console.log('NormalModuleReplacementPlugin: redirecting resource: ', resource, ' -> ', alias[resource.request]);//DEBU

						// resource.request = alias[resource.request];//DISABLED hard-rewire request ... instead, add an alias resolver (see below)

						var ca = {};
						ca[resource.request] = alias[resource.request];
						resource.resolveOptions = {alias: ca};
					}
				}
		)});

		moduleRules.push({
			test: fileUtils.createFileTestFunc(settings.filter(function(s){return !_.isArray(s.file) && s.type !== 'grammar';}).map(function(s){return s.file;}), ' for [language resource] files'),
			use: {
				loader: 'file-loader',
				options: {
					name: function(file) {

						// var ofile = file;//DEBU

						var root = appRootDir;
						//use relative path path (from root) in target/output directory for the resouce:
						if(file.indexOf(root) === 0){
							file = file.substring(root.length).replace(/^(\\|\/)/, '');
						}
						// console.log('including [from '+root+'] dictionary file ', ofile , ' -> ', file)//DEBU
						return file;
					}
				}
			},
			type: 'javascript/auto'
		});
	}

	return moduleRules;
}

var createPlugins = function(webpackInstance, alias, mmirAppConfig){

	// var CResolver = require('./webpack-plugin-custom-resolver.js');

	var EncodingPlugin = require('webpack-encoding-plugin');

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
		new ReplaceModuleIdPlugin(alias, rootDir, /\.((ehtml)|(js(on)?))$/i),

		// new CResolver(alias),//FIXME TEST

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
		),

		// // redirect 'mmirf/util/fileLoader'
		new webpackInstance.NormalModuleReplacementPlugin(
			/^mmirf\/util\/loadFile(__webpack_proxied)?$/,
			function(resource) {
				if(/__webpack_proxied$/.test(resource.request)){
					var modPath = path.resolve(alias['mmirf/util'], 'loadFile.js');
					// console.log('------------- replacing module ', resource.request, ' -> ', modPath);
					resource.request = modPath;
				} else {
					// console.log('############# replacing module ', resource.request, ' -> ', path.join(webpackRootDir, 'webpack-loadFile.js'));
					resource.request = path.join(webpackRootDir, 'webpack-loadFile.js');
				}
			}
		),

		// // FIXME somehow require-ing .ehtml resources (i.e. "mmirf/view/...") is not processed as module-request, so neither normal alias-resolving nor the replace-id plugin is triggered...
		// //       ... hard-rewire the requires view-IDs to the
		// new webpackInstance.NormalModuleReplacementPlugin(
		// 	/mmirf\/view\//i,
		// 	function(resource) {
		// 		if(alias[resource.request]){
		// 			// console.log('NormalModuleReplacementPlugin: redirecting resource -> ', resource);
		// 			resource.request = alias[resource.request];
		// 			resource.resource = resource.request;
		// 		}
		// 	}
		// ),

		// FIXME somehow require-ing .ehtml resources (i.e. "mmirf/view/...") is not processed as module-request, so neither normal alias-resolving nor the replace-id plugin is triggered...
		//       ... hard-rewire the requires view-IDs to the
		new webpackInstance.NormalModuleReplacementPlugin(
			/mmirf\/(view|controller|grammar|helper|model|scxml)\//i,
			function(resource) {
				if(alias[resource.request]){

					// console.log('NormalModuleReplacementPlugin: redirecting resource: ', resource, ' -> ', alias[resource.request]);

					// resource.request = alias[resource.request];//DISABLED hard-rewire request ... instead, add an alias resolver (see below)

					var ca = {};
					ca[resource.request] = alias[resource.request];
					resource.resolveOptions = {alias: ca};

					// resource.resource = alias[resource.request];//resource.request;
					// resource.path = alias[resource.request];//resource.request;

					// var id = resource.request;
					// resource.libIdent = function() {
					// 	return id;
					// }
				}
			}
		),

		// //TEST try to limit/tell webpack the restrictions of require() calls in order to avoid compilation warnings
		// new webpack.ContextReplacementPlugin(/^mmirf\/()/, (context) => {
		//   if ( !/\/moment\//.test(context.context) ) return;
		//
		//   Object.assign(context, {
		//     regExp: /^\.\/\w+/,
		//     request: '../../locale' // resolved relatively
		//   });
		// })

		// new EncodingPlugin({
    //   encoding: 'utf16le'
    // }),

	];

	if(mmirAppConfig.webpackPlugins){
		mmirAppConfig.webpackPlugins.forEach(function(p){
			plugins.push(typeof p === 'function'? p(webpackInstance, alias, mmirAppConfig) : p);
		})
	}

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
		// console.log('############################## webpack instance: ', webpackInstance)

		var useRulesForLoaders = webpackInstance.version && parseFloat(webpackInstance.version) >= 4? true : false;

		if(typeof mmirAppConfig === 'string'){
			mmirAppConfig = JSON.parse(mmirAppConfig);
		} else if(!mmirAppConfig){
			mmirAppConfig = {};
		}

		//add loader configurations:
		// (NOTE must do this before creating alias definition as some loaders may add alias mappings to mmirAppConfig)
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

		// console.log('webpackConfig.resolve.alias: ', JSON.stringify(webpackConfig.resolve.alias));


		//add plugins
		var plugins = createPlugins(webpackInstance, alias, mmirAppConfig);
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
