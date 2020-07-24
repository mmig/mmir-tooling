"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = __importDefault(require("process"));
var module_config_init_1 = __importDefault(require("../utils/module-config-init"));
var directories_utils_1 = __importDefault(require("../tools/directories-utils"));
var resources_config_utils_1 = __importDefault(require("../tools/resources-config-utils"));
var settings_utils_1 = __importDefault(require("../tools/settings-utils"));
var grammar_utils_1 = __importDefault(require("../grammar/grammar-utils"));
var scxml_utils_1 = __importDefault(require("../scxml/scxml-utils"));
var impl_utils_1 = __importDefault(require("../impl/impl-utils"));
var view_utils_1 = __importDefault(require("../view/view-utils"));
var plugins_utils_1 = __importDefault(require("../tools/plugins-utils"));
var log_utils_1 = __importDefault(require("../utils/log-utils"));
var log = log_utils_1.default.log;
var warn = log_utils_1.default.warn;
function createBuildConfig(mmirAppConfig, resourcesConfig) {
    mmirAppConfig.rootPath = mmirAppConfig.rootPath || process_1.default.cwd();
    var appRootDir = mmirAppConfig.rootPath;
    var directories = directories_utils_1.default.createDirectoriesJson();
    //get (optional) configuration from mmirAppConfig
    var runtimeConfig = mmirAppConfig.configuration; //{language: 'de'};
    //parse resources directory (if specified) for detecting default mmir resouce structrue/resource options:
    if (mmirAppConfig.resourcesPath) {
        log('parsing resources directory: ', mmirAppConfig.resourcesPath, ', current app-config: ', mmirAppConfig); //DEBUG
        var genAppConfig = resources_config_utils_1.default.resourcePathsFrom(mmirAppConfig.resourcesPath, mmirAppConfig.resourcesPathOptions);
        resources_config_utils_1.default.mergeResourceConfigs(mmirAppConfig, genAppConfig);
        log('adding results from parsing resources directory: ', genAppConfig, ' -> ', mmirAppConfig); //DEBUG
    }
    var settingsOptions = mmirAppConfig.settings;
    var settings = settings_utils_1.default.jsonSettingsFromDir(settingsOptions, appRootDir);
    // log('JSON settings: ', settings);
    // log('JSON configuration setting: ', settingsUtil.getConfiguration(settings));
    // log('JSON runtime configuration: ', runtimeConfig);
    //add configuration from mmirAppConfig for merging, if necessary
    if (runtimeConfig) {
        log('JSON configuration settings: adding & merging mmirAppConfig.configuration ', runtimeConfig);
        settings.push(settings_utils_1.default.createSettingsEntryFor('configuration', runtimeConfig)); //<- push "mmirAppConfig.confiuration" into the end of parsed settings files
    }
    else if (!settings_utils_1.default.getConfiguration(settings)) {
        log('JSON configuration settings: adding empty default configuration');
        settings.push(settings_utils_1.default.createSettingsEntryFor('configuration', {}));
    }
    settings_utils_1.default.normalizeConfigurations(settings);
    var runtimeConfigEntry = settings_utils_1.default.getConfiguration(settings);
    // log('JSON configuration setting (merge test): ', runtimeConfigEntry);//DEBU
    if (!runtimeConfigEntry.value) {
        if (runtimeConfigEntry.file) {
            runtimeConfigEntry.value = settings_utils_1.default.loadSettingsFrom(runtimeConfigEntry.file, runtimeConfigEntry.fileType);
        }
        else {
            warn('could not read configuration settings from file: using empty configuration');
            runtimeConfigEntry.value = {};
        }
    }
    runtimeConfig = runtimeConfigEntry.value;
    /////////////////////////////////////////////////////////////////////////////////////
    var includePluginList = mmirAppConfig.includePlugins;
    if (includePluginList) {
        includePluginList.forEach(function (plugin) {
            var id = typeof plugin === 'string' ? plugin : plugin.id;
            var pluginSettings = typeof plugin !== 'string' ? plugin : { id: id };
            log('adding mmir-plugin "' + id + '" ...'); //DEBUG
            plugins_utils_1.default.addPluginInfos(pluginSettings, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settings);
        });
        // log('added mmir-plugins: ', resourcesConfig.workers, mmirAppConfig);//DEBUG
    }
    /////////////////////////////////////////////////////////////////////////////////////
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
    grammarOptions = grammar_utils_1.default.parseRuntimeConfigurationForOptions(grammarOptions, runtimeConfig);
    var grammars = [];
    if (grammarOptions && grammarOptions.path) {
        grammar_utils_1.default.jsonGrammarsFromDir(grammarOptions, appRootDir, grammars);
    }
    if (grammarOptions && grammarOptions.grammars) {
        grammar_utils_1.default.jsonGrammarsFromOptions(grammarOptions, appRootDir, grammars);
    }
    if (grammars.length > 0) {
        grammar_utils_1.default.applyDefaultOptions(grammarOptions || {}, grammars);
    }
    // log('JSON grammars: ', grammars, grammarOptions);
    grammar_utils_1.default.addGrammarsToAppConfig(grammars, mmirAppConfig, directories, resourcesConfig, runtimeConfig);
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
    if (stateOptions && stateOptions.path) {
        // log('including SCXML models from directory ', stateOptions.path);//DEBU
        scxml_utils_1.default.scxmlFromDir(stateOptions, appRootDir, states);
    }
    if (stateOptions && stateOptions.models) {
        // log('including SCXML models from options ', stateOptions.models);//DEBU
        scxml_utils_1.default.scxmlFromOptions(stateOptions, appRootDir, states);
    }
    if (states.length === 0) {
        log('no SCXML models specified, including minimal default SCXML models for "input" and "dialog"...'); //DEBUG
        scxml_utils_1.default.scxmlDefaults(stateOptions, appRootDir, states);
    }
    scxml_utils_1.default.applyDefaultOptions(stateOptions, states);
    // log('SCXML models: ', states, stateOptions);//DEBUG
    scxml_utils_1.default.addStatesToAppConfig(states, mmirAppConfig, directories, resourcesConfig, runtimeConfig);
    /////////////////////////////////////////////////////////////////////////////////////
    var ctrlOptions = mmirAppConfig.controllers;
    var ctrlList = [];
    if (ctrlOptions && ctrlOptions.path) {
        impl_utils_1.default.implFromDir('controller', ctrlOptions, appRootDir, ctrlList);
    }
    if (ctrlOptions && ctrlOptions.controllers) {
        impl_utils_1.default.implFromOptions('controller', ctrlOptions, appRootDir, ctrlList);
    }
    if (ctrlList.length > 0) {
        impl_utils_1.default.applyDefaultOptions(ctrlOptions || {}, ctrlList);
    }
    log('controllers: ', ctrlList, ctrlOptions); //DEBUG
    impl_utils_1.default.addImplementationsToAppConfig(ctrlList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);
    var helperOptions = mmirAppConfig.helpers;
    var helperList = [];
    if (helperOptions && helperOptions.path) {
        impl_utils_1.default.implFromDir('helper', helperOptions, appRootDir, helperList);
    }
    if (helperOptions && helperOptions.helpers) {
        impl_utils_1.default.implFromOptions('helper', helperOptions, appRootDir, helperList);
    }
    if (helperList.length > 0) {
        impl_utils_1.default.applyDefaultOptions(helperOptions || {}, helperList);
    }
    log('helpers: ', helperList, helperOptions); //DEBUG
    impl_utils_1.default.addImplementationsToAppConfig(helperList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);
    var modelOptions = mmirAppConfig.models;
    var modelList = [];
    if (modelOptions && modelOptions.path) {
        impl_utils_1.default.implFromDir('model', modelOptions, appRootDir, modelList);
    }
    if (modelOptions && modelOptions.models) {
        impl_utils_1.default.implFromOptions('model', modelOptions, appRootDir, modelList);
    }
    if (modelList.length > 0) {
        impl_utils_1.default.applyDefaultOptions(modelOptions || {}, modelList);
    }
    log('models: ', modelList, modelOptions);
    impl_utils_1.default.addImplementationsToAppConfig(modelList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);
    var implList = ctrlList.concat(helperList, modelList);
    /////////////////////////////////////////////////////////////////////////////////////
    //FIXME include controllers!
    var viewOptions = mmirAppConfig.views;
    //exmaple:
    // var viewOptions = {
    // 	path: './views',
    // }
    var views = [];
    if (viewOptions && viewOptions.path) {
        views = view_utils_1.default.viewTemplatesFromDir(viewOptions.path, appRootDir);
    }
    if (views.length > 0) {
        //check layout / default-layout:
        if (views.findIndex(function (viewEntry) { return viewEntry.viewImpl === 'mmirf/layout'; }) === -1) {
            warn('mmir-build-config: found views, but no layout -> must have at least 1 default layout!');
            //TODO add stub default-layout template in this case!!!
            //TODO check that either layouts/default.ehtml is present, or that runtimeConfig.defaultLayoutName is set, and that the corresponding layouts/<defaultLayoutName>.ehtml is present
            //TODO ... or throw error, stopping the build-process in this case?
        }
        impl_utils_1.default.applyDefaultOptions(viewOptions || {}, views);
    }
    else {
        if (runtimeConfig.defaultLayoutName) {
            warn('mmir-build-config: could not find any views, but runtime configuration "defaultLayoutName" is set to ' + JSON.stringify(runtimeConfig.defaultLayoutName) + ', disabling defaultLayoutName!');
        }
        runtimeConfig.defaultLayoutName = null;
    }
    //TODO impl./support loading indivual views similar to grammars
    // log('view templates: ', views);
    view_utils_1.default.addViewsToAppConfig(views, ctrlList, mmirAppConfig, directories, resourcesConfig, runtimeConfig);
    /////////////////////////////////////////////////////////////////////////////////////
    // log(' configuration.json -> ', JSON.stringify(runtimeConfig));//DEBU
    // log(' ########### settings -> ', JSON.stringify(settings));//DEBU
    // appConfigUtils.addAppSettings(mmirAppConfig, 'mmirf/settings/configuration', runtimeConfig);
    settings_utils_1.default.addSettingsToAppConfig(settings, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settingsOptions);
    /////////////////////////////////////////////////////////////////////////////////////
    //FIXME TEST
    // directoriesJsonUtils.addDictionary(directories, 'mmirf/settings/dictionary/en');
    // log(' directories.json -> ', JSON.stringify(directories));//DEBU
    module_config_init_1.default.addAppSettings(mmirAppConfig, 'mmirf/settings/directories', directories);
    // log('###### mmirAppConfig: '+ JSON.stringify(mmirAppConfig));
    return {
        grammars: grammars,
        grammarOptions: grammarOptions,
        views: views,
        viewOptions: viewOptions,
        states: states,
        stateOptions: stateOptions,
        implList: implList,
        ctrlOptions: ctrlOptions,
        helperOptions: helperOptions,
        modelOptions: modelOptions,
        settings: settings,
        settingsOptions: settingsOptions,
        directories: directories
    };
}
exports.createBuildConfig = createBuildConfig;
