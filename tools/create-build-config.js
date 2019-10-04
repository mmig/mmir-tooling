
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
	// log('JSON runtime configuration: ', runtimeConfig);

	//add configuration from mmirAppConfig for merging, if necessary
	if(runtimeConfig){
		log('JSON configuration settings: adding & merging mmirAppConfig.configuration ', runtimeConfig);
		settings.push(settingsUtil.createSettingsEntryFor('configuration', runtimeConfig));//<- push "mmirAppConfig.confiuration" into the end of parsed settings files
	} else if(!settingsUtil.getConfiguration(settings)){
		log('JSON configuration settings: adding empty default configuration');
		settings.push(settingsUtil.createSettingsEntryFor('configuration', {}));
	}
	settingsUtil.normalizeConfigurations(settings);
	var runtimeConfigEntry = settingsUtil.getConfiguration(settings);
	// log('JSON configuration setting (merge test): ', runtimeConfigEntry);//DEBU
	if(!runtimeConfigEntry.value){
		if(runtimeConfigEntry.file){
			runtimeConfigEntry.value = settingsUtil.loadSettingsFrom(runtimeConfigEntry.file, runtimeConfigEntry.fileType);
		} else {
			warn('could not read configuration settings from file: using empty configuration');
			runtimeConfigEntry.value = {};
		}
	}
	runtimeConfig = runtimeConfigEntry.value;

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

	grammarOptions = grammarUtils.parseRuntimeConfigurationForOptions(grammarOptions, runtimeConfig);

	var grammars = [];
	if(grammarOptions && grammarOptions.path){
		grammarUtils.jsonGrammarsFromDir(grammarOptions, appRootDir, grammars);
	}
	if(grammarOptions && grammarOptions.grammars){
		grammarUtils.jsonGrammarsFromOptions(grammarOptions, appRootDir, grammars);
	}
	if(grammars.length > 0){
		grammarUtils.applyDefaultOptions(grammarOptions || {}, grammars);
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
	scxmlUtils.applyDefaultOptions(stateOptions, states);

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
	if(ctrlList.length > 0){
		implUtils.applyDefaultOptions(ctrlOptions || {}, ctrlList);
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
	if(helperList.length > 0){
		implUtils.applyDefaultOptions(helperOptions || {}, helperList);
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
	if(modelList.length > 0){
		implUtils.applyDefaultOptions(modelOptions || {}, modelList);
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
	if(views.length > 0){

		//check layout / default-layout:
		if(views.findIndex(function(viewEntry){return viewEntry.viewImpl === 'mmirf/layout'}) === -1){
			warn('mmir-build-config: found views, but no layout -> must have at least 1 default layout!');
			//TODO add stub default-layout template in this case!!!
			//TODO check that either layouts/default.ehtml is present, or that runtimeConfig.defaultLayoutName is set, and that the corresponding layouts/<defaultLayoutName>.ehtml is present
			//TODO ... or throw error, stopping the build-process in this case?
		}

		implUtils.applyDefaultOptions(viewOptions || {}, views);

	} else {
		if(runtimeConfig.defaultLayoutName){
			warn('mmir-build-config: could not find any views, but runtime configuration "defaultLayoutName" is set to '+JSON.stringify(runtimeConfig.defaultLayoutName)+', disabling defaultLayoutName!');
		}
		runtimeConfig.defaultLayoutName = null;
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

	settingsUtil.addSettingsToAppConfig(settings, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settingsOptions);

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
