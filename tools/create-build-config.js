
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

var logUtils = require('../utils/log-utils.js');
var log = logUtils.log;
var warn = logUtils.warn;

var createBuildConfig = function(mmirAppConfig, resourcesConfig){

	mmirAppConfig.rootPath = mmirAppConfig.rootPath || process.cwd();
	var appRootDir = mmirAppConfig.rootPath;

	var directories = directoriesJsonUtils.createDirectoriesJson();

	//get (optional) configuration from mmirAppConfig
	var runtimeConfig = mmirAppConfig.configuration;//{language: 'de'};

	//parse resources directory (if specified) for detecting default mmir resouce structrue/resource options:
	if(mmirAppConfig.resourcesPath){
		log('parsing resources directory: ', mmirAppConfig.resourcesPath, ', current app-config: ', mmirAppConfig);//DEBUG
		var genAppConfig = resourceUtils.resourcePathsFrom(mmirAppConfig.resourcesPath, mmirAppConfig.resourcesPathOptions);
		resourceUtils.mergeResourceConfigs(mmirAppConfig, genAppConfig);
		log('adding results from parsing resources directory: ', genAppConfig, ' -> ', mmirAppConfig);//DEBUG
	}

	var settingsOptions = mmirAppConfig.settings;
	var settings = settingsUtil.jsonSettingsFromDir(settingsOptions, appRootDir);
	// log('JSON settings: ', settings);
	// log('JSON configuration setting: ', settingsUtil.getConfiguration(settings));

	//add configuration from mmirAppConfig for merging, if necessary
	if(runtimeConfig){
		// log('JSON configuration settings: adding & merging mmirAppConfig.configuration ', runtimeConfig);//DEBU
		settings.push(settingsUtil.createSettingsEntryFor('configuration', runtimeConfig));//<- push "mmirAppConfig.confiuration" into the end of parsed settings files
	}
	settingsUtil.normalizeConfigurations(settings);
	// log('JSON configuration setting (merge test): ', settingsUtil.getConfiguration(settings));//DEBU
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

	// log('JSON grammars: ', grammars, grammarOptions);

	grammarUtils.addGrammarsToAppConfig(grammars, mmirAppConfig, directories, resourcesConfig, runtimeConfig);


	/////////////////////////////////////////////////////////////////////////////////////

	var stateOptions = mmirAppConfig.states;
	//exmaple:
	// {
	// 	path: './config/states_large',
	// 	models: {
	// 		input: {
	// 			mode: 'simple',
	// 			file: './config/states_minimal/input.xml'
	// 		},
	// 		dialog: {
	// 			mode: 'extended'
	// 		}
	// 	}
	// }
	var states = [];
	if(stateOptions && stateOptions.path){
		// log('including SCXML models from directory ', stateOptions.path);//DEBU
		scxmlUtils.scxmlFromDir(stateOptions, appRootDir, states);
	}
	if(stateOptions && stateOptions.models){
		// log('including SCXML models from options ', stateOptions.models);//DEBU
		scxmlUtils.scxmlFromOptions(stateOptions, appRootDir, states);
	}

	if(states.length === 0){
		log('no SCXML models specified, including minimal default SCXML models for "input" and "dialog"...');//DEBUG
		scxmlUtils.scxmlDefaults(stateOptions, appRootDir, states);
	}

	// log('SCXML models: ', states, stateOptions);//DEBUG

	scxmlUtils.addStatesToAppConfig(states, mmirAppConfig, directories, resourcesConfig, runtimeConfig);


	/////////////////////////////////////////////////////////////////////////////////////

	var ctrlOptions = mmirAppConfig.controllers;
	var ctrlList = [];
	if(ctrlOptions && ctrlOptions.path){
		implUtils.implFromDir('controller', ctrlOptions, appRootDir, ctrlList);
	}
	if(ctrlOptions && ctrlOptions.controllers){
		implUtils.implFromOptions('controller', ctrlOptions, appRootDir, ctrlList);
	}
	log('controllers: ', ctrlList, ctrlOptions);//DEBUG
	implUtils.addImplementationsToAppConfig(ctrlList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);

	var helperOptions = mmirAppConfig.helpers;
	var helperList = [];
	if(helperOptions && helperOptions.path){
		implUtils.implFromDir('helper', helperOptions, appRootDir, helperList);
	}
	if(helperOptions && helperOptions.helpers){
		implUtils.implFromOptions('helper', helperOptions, appRootDir, helperList);
	}
	log('helpers: ', helperList, helperOptions);//DEBUG
	implUtils.addImplementationsToAppConfig(helperList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);

	var modelOptions = mmirAppConfig.models;
	var modelList = [];
	if(modelOptions && modelOptions.path){
		implUtils.implFromDir('model', modelOptions, appRootDir, modelList);
	}
	if(modelOptions && modelOptions.models){
		implUtils.implFromOptions('model', modelOptions, appRootDir, modelList);
	}
	log('models: ', modelList, modelOptions);
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

	// log('view templates: ', views);

	viewUtils.addViewsToAppConfig(views, ctrlList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);

	/////////////////////////////////////////////////////////////////////////////////////

	var includePluginList = mmirAppConfig.includePlugins;
	if(includePluginList){

		includePluginList.forEach(function(plugin){
			var id = typeof plugin === 'string'? plugin : plugin.id;
			var pluginSettings = typeof plugin !== 'string'? plugin : {id: id};
			log('adding mmir-plugin "'+id+'" ...');//DEBUG
			pluginsUtil.addPluginInfos(pluginSettings, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settings);
		});

		// log('added mmir-plugins: ', resourcesConfig.workers, mmirAppConfig);//DEBUG
	}


	/////////////////////////////////////////////////////////////////////////////////////

	// log(' configuration.json -> ', JSON.stringify(runtimeConfig));//DEBU
	// log(' ########### settings -> ', JSON.stringify(settings));//DEBU
	// appConfigUtils.addAppSettings(mmirAppConfig, 'mmirf/settings/configuration', runtimeConfig);

	settingsUtil.addSettingsToAppConfig(settings, mmirAppConfig, directories, resourcesConfig, runtimeConfig);//, /configuration/i);

	/////////////////////////////////////////////////////////////////////////////////////

	//FIXME TEST
	// directoriesJsonUtils.addDictionary(directories, 'mmirf/settings/dictionary/en');
	// log(' directories.json -> ', JSON.stringify(directories));//DEBU
	appConfigUtils.addAppSettings(mmirAppConfig, 'mmirf/settings/directories', directories);

	// log('###### mmirAppConfig: '+ JSON.stringify(mmirAppConfig));

	return {
		grammars,
		grammarOptions,
		views,
		viewOptions,
		states,
		stateOptions,
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
