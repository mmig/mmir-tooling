
const process = require('process');

var appConfigUtils = require('../utils/module-config-init.js');
var directoriesJsonUtils = require('../tools/directories-utils.js');

var resourceUtils = require('../tools/resources-config-utils.js');
var settingsUtil = require('../tools/settings-utils.js');
var grammarUtils = require('../grammar/grammar-utils.js');
var scxmlUtils = require('../scxml/scxml-utils.js');
var implUtils = require('../impl/impl-utils.js');
var viewUtils = require('../view/view-utils.js');
var pluginsUtil = require('../tools/plugins-utils.js');

var createBuildConfig = function(mmirAppConfig, resourcesConfig){

	mmirAppConfig.rootPath = mmirAppConfig.rootPath || process.cwd();
	var appRootDir = mmirAppConfig.rootPath;

	var directories = directoriesJsonUtils.createDirectoriesJson();

	//get (optional) configuration from mmirAppConfig
	var runtimeConfig = mmirAppConfig.configuration;//{language: 'de'};

	//parse resources directory (if specified) for detecting default mmir resouce structrue/resource options:
	if(mmirAppConfig.resourcesPath){
		console.log('parsing resources directory: ', mmirAppConfig.resourcesPath, ', current app-config: ', mmirAppConfig);//DEBUG
		var genAppConfig = resourceUtils.resourcePathsFrom(mmirAppConfig.resourcesPath, mmirAppConfig.resourcesPathOptions);
		resourceUtils.mergeResourceConfigs(mmirAppConfig, genAppConfig);
		console.log('adding results from parsing resources directory: ', genAppConfig, ' -> ', mmirAppConfig);//DEBUG
	}

	var settingsOptions = mmirAppConfig.settings;
	var settings = settingsUtil.jsonSettingsFromDir(settingsOptions, appRootDir);
	// console.log('JSON settings: ', settings);
	// console.log('JSON configuration setting: ', settingsUtil.getConfiguration(settings));

	//add configuration from mmirAppConfig for merging, if necessary
	if(runtimeConfig){
		// console.log('JSON configuration settings: adding & merging mmirAppConfig.configuration ', runtimeConfig);//DEBU
		settings.push(settingsUtil.createSettingsEntryFor('configuration', runtimeConfig));//<- push "mmirAppConfig.confiuration" into the end of parsed settings files
	}
	settingsUtil.normalizeConfigurations(settings);
	// console.log('JSON configuration setting (merge test): ', settingsUtil.getConfiguration(settings));//DEBU
	runtimeConfig = settingsUtil.getConfiguration(settings).value;

	var grammarOptions = mmirAppConfig.grammars;
	//exmaple:
	// var grammarOptions = {
	// 	path: './config/languages',
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
	if(grammarOptions && grammarOptions.path){
		grammarUtils.jsonGrammarsFromDir(grammarOptions, appRootDir, grammars);
	}
	if(grammarOptions && grammarOptions.grammars){
		grammarUtils.jsonGrammarsFromOptions(grammarOptions, appRootDir, grammars);
	}

	// console.log('JSON grammars: ', grammars, grammarOptions);

	grammarUtils.addGrammarsToAppConfig(grammars, mmirAppConfig, directories, resourcesConfig, runtimeConfig);


	/////////////////////////////////////////////////////////////////////////////////////

	var scxmlOptions = mmirAppConfig.stateMachines;
	//exmaple:
	// {
	// 	path: './config/statedef_large',
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
	if(scxmlOptions && scxmlOptions.path){
		// console.log('including SCXML models from directory ', scxmlOptions.path);//DEBU
		scxmlUtils.scxmlFromDir(scxmlOptions, appRootDir, scxmlModels);
	}
	if(scxmlOptions && scxmlOptions.models){
		// console.log('including SCXML models from options ', scxmlOptions.models);//DEBU
		scxmlUtils.scxmlFromOptions(scxmlOptions, appRootDir, scxmlModels);
	}

	if(scxmlModels.length === 0){
		console.log('no SCXML models specified, including minimal default SCXML models for "input" and "dialog"...');//DEBUG
		scxmlUtils.scxmlDefaults(scxmlOptions, appRootDir, scxmlModels);
	}

	// console.log('SCXML models: ', scxmlModels, scxmlOptions);//DEBUG

	scxmlUtils.addScxmlToAppConfig(scxmlModels, mmirAppConfig, directories, resourcesConfig, runtimeConfig);


	/////////////////////////////////////////////////////////////////////////////////////

	var ctrlOptions = mmirAppConfig.controllers;
	var ctrlList = [];
	if(ctrlOptions && ctrlOptions.path){
		implUtils.implFromDir('controller', ctrlOptions, appRootDir, ctrlList);
	}
	if(ctrlOptions && ctrlOptions.controllers){
		implUtils.implFromOptions('controller', ctrlOptions, appRootDir, ctrlList);
	}
	console.log('controllers: ', ctrlList, ctrlOptions);//DEBUG
	implUtils.addImplementationsToAppConfig(ctrlList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);

	var helperOptions = mmirAppConfig.helpers;
	var helperList = [];
	if(helperOptions && helperOptions.path){
		implUtils.implFromDir('helper', helperOptions, appRootDir, helperList);
	}
	if(helperOptions && helperOptions.helpers){
		implUtils.implFromOptions('helper', helperOptions, appRootDir, helperList);
	}
	console.log('helpers: ', helperList, helperOptions);//DEBUG
	implUtils.addImplementationsToAppConfig(helperList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);

	var modelOptions = mmirAppConfig.models;
	var modelList = [];
	if(modelOptions && modelOptions.path){
		implUtils.implFromDir('model', modelOptions, appRootDir, modelList);
	}
	if(modelOptions && modelOptions.models){
		implUtils.implFromOptions('model', modelOptions, appRootDir, modelList);
	}
	console.log('models: ', modelList, modelOptions);
	implUtils.addImplementationsToAppConfig(modelList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);
	var implList = ctrlList.concat(helperList, modelList);

	/////////////////////////////////////////////////////////////////////////////////////

	//FIXME include controllers!

	var viewOptions = mmirAppConfig.views;
	//exmaple:
	// var viewOptions = {
	// 	path: './views',
	// }

	var views = [];
	if(viewOptions && viewOptions.path){
		views = viewUtils.viewTemplatesFromDir(viewOptions.path, appRootDir);
	}

	//TODO impl./support loading indivual views similar to grammars

	// console.log('view templates: ', views);

	viewUtils.addViewsToAppConfig(views, ctrlList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);

	/////////////////////////////////////////////////////////////////////////////////////

	var includePluginList = mmirAppConfig.includePlugins;
	if(includePluginList){

		includePluginList.forEach(function(plugin){
			var id = typeof plugin === 'string'? plugin : plugin.id;
			var pluginSettings = typeof plugin !== 'string'? plugin : {id: id};
			console.log('adding mmir-plugin "'+id+'" ...');//DEBUG
			pluginsUtil.addPluginInfos(pluginSettings, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settings);
		});

		// console.log('added mmir-plugins: ', resourcesConfig.workers, mmirAppConfig);//DEBUG
	}


	/////////////////////////////////////////////////////////////////////////////////////

	// console.log(' configuration.json -> ', JSON.stringify(runtimeConfig));//DEBU
	// console.log(' ########### settings -> ', JSON.stringify(settings));//DEBU
	// appConfigUtils.addAppSettings(mmirAppConfig, 'mmirf/settings/configuration', runtimeConfig);

	settingsUtil.addSettingsToAppConfig(settings, mmirAppConfig, directories, resourcesConfig, runtimeConfig);//, /configuration/i);

	/////////////////////////////////////////////////////////////////////////////////////

	//FIXME TEST
	// directoriesJsonUtils.addDictionary(directories, 'mmirf/settings/dictionary/en');
	// console.log(' directories.json -> ', JSON.stringify(directories));//DEBU
	appConfigUtils.addAppSettings(mmirAppConfig, 'mmirf/settings/directories', directories);

	// console.log('###### mmirAppConfig: '+ JSON.stringify(mmirAppConfig));

	return {
		grammars,
		grammarOptions,
		views,
		viewOptions,
		scxmlModels,
		scxmlOptions,
		implList,
		ctrlOptions,
		helperOptions,
		modelOptions,
		settings,
		settingsOptions,
		directories
	}
}

module.exports = createBuildConfig;
