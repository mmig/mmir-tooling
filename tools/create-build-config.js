"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuildConfig = void 0;
const process_1 = __importDefault(require("process"));
const lodash_1 = __importDefault(require("lodash"));
const module_config_init_1 = __importDefault(require("../utils/module-config-init"));
const directories_utils_1 = __importDefault(require("../tools/directories-utils"));
const resources_config_utils_1 = __importDefault(require("../tools/resources-config-utils"));
const settings_utils_1 = __importDefault(require("../tools/settings-utils"));
const grammar_utils_1 = __importDefault(require("../grammar/grammar-utils"));
const scxml_utils_1 = __importDefault(require("../scxml/scxml-utils"));
const impl_utils_1 = __importDefault(require("../impl/impl-utils"));
const view_utils_1 = __importDefault(require("../view/view-utils"));
const plugins_utils_1 = __importDefault(require("../tools/plugins-utils"));
const merge_utils_1 = require("../utils/merge-utils");
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
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
    if (settingsOptions === true) {
        return 'ERROR for appConfig.settings: is set to TRUE but no settings were found, is appConfig.resourcesPath set correctly?';
    }
    const settings = settings_utils_1.default.jsonSettingsFromDir(settingsOptions, appRootDir);
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
            const configFile = Array.isArray(runtimeConfigEntry.file) ? runtimeConfigEntry.file[0] : runtimeConfigEntry.file;
            runtimeConfigEntry.value = settings_utils_1.default.loadSettingsFrom(configFile, runtimeConfigEntry.fileType);
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
        includePluginList = includePluginList.map(plugin => plugins_utils_1.default.normalizePluginEntry(plugin));
        includePluginList.forEach(function (plugin) {
            log('adding mmir-plugin "' + plugin.id + '" ...'); //DEBUG
            plugins_utils_1.default.addPluginInfos(plugin, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settings);
        });
        // check if plugins did add plugin-entries to includePlugins:
        let checkAdditionalPlugins = true;
        while (checkAdditionalPlugins) {
            const configPluginList = mmirAppConfig.includePlugins.map(plugin => plugins_utils_1.default.normalizePluginEntry(plugin));
            const additionalPlugins = [];
            if (!lodash_1.default.isEqual(configPluginList, includePluginList)) {
                // -> plugin build config did add entries to the plugin list
                const pluginMap = plugins_utils_1.default.processDuplicates(includePluginList);
                configPluginList.forEach(plugin => {
                    const existingPlugin = plugins_utils_1.default.constainsPlugin(plugin, pluginMap.get(plugin.id), false);
                    if (!existingPlugin) {
                        additionalPlugins.push(plugin);
                    }
                    else if (!lodash_1.default.isEqual(plugin, existingPlugin)) {
                        //TODO check if plugin is "subset" of existingPlugin, and only proceed, if it is not (i.e. has some new/different properties)
                        //first merge existing entry into new one (i.e. specified entries take precedence over generated one):
                        (0, merge_utils_1.customMerge)(plugin, existingPlugin);
                        //then merge into the existing entry (i.e. "update" existing entry)
                        (0, merge_utils_1.customMerge)(existingPlugin, plugin);
                        additionalPlugins.push(plugin);
                    }
                });
            }
            else {
                checkAdditionalPlugins = false;
            }
            if (additionalPlugins.length > 0) {
                // update includePluginList with new plugin list (for next loop, i.e. checking for added plugins)
                includePluginList = configPluginList;
                // do add new plugin entries:
                additionalPlugins.forEach(function (plugin) {
                    log('adding mmir-plugin "' + plugin.id + '" (added by plugin build configuration)...'); //DEBUG
                    plugins_utils_1.default.addPluginInfos(plugin, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settings);
                });
            }
            else {
                checkAdditionalPlugins = false;
            }
            includePluginList = configPluginList;
        }
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
    if (grammarOptions === true) {
        return 'ERROR for appConfig.grammars: is set to TRUE but no grammar options were found, is appConfig.resourcesPath set correctly?';
    }
    grammarOptions = grammar_utils_1.default.parseRuntimeConfigurationForOptions(grammarOptions, runtimeConfig);
    const grammars = [];
    if (grammarOptions && grammarOptions.path) {
        grammar_utils_1.default.jsonGrammarsFromDir(grammarOptions, appRootDir, grammars);
    }
    if (grammarOptions && grammarOptions.grammars) {
        grammar_utils_1.default.jsonGrammarsFromOptions(grammarOptions, appRootDir, grammars);
    }
    grammarOptions = grammarOptions || {};
    if (grammars.length > 0) {
        grammar_utils_1.default.applyDefaultOptions(grammarOptions, grammars);
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
    if (stateOptions === true) {
        return 'ERROR for appConfig.states: is set to TRUE but no state options were found, is appConfig.resourcesPath set correctly?';
    }
    var states = [];
    if (stateOptions && stateOptions.path) {
        // log('including SCXML models from directory ', stateOptions.path);//DEBU
        scxml_utils_1.default.scxmlFromDir(stateOptions, appRootDir, states);
    }
    if (stateOptions && stateOptions.models) {
        // log('including SCXML models from options ', stateOptions.models);//DEBU
        scxml_utils_1.default.scxmlFromOptions(stateOptions, appRootDir, states);
    }
    if (stateOptions) {
        if (states.length === 0) {
            log('no SCXML models specified, including minimal default SCXML models for "input" and "dialog"...'); //DEBUG
            scxml_utils_1.default.scxmlDefaults(stateOptions, appRootDir, states);
        }
    }
    else {
        stateOptions = {};
    }
    scxml_utils_1.default.applyDefaultOptions(stateOptions, states);
    // log('SCXML models: ', states, stateOptions);//DEBUG
    scxml_utils_1.default.addStatesToAppConfig(states, mmirAppConfig, directories, resourcesConfig, runtimeConfig);
    /////////////////////////////////////////////////////////////////////////////////////
    var ctrlOptions = mmirAppConfig.controllers;
    if (ctrlOptions === true) {
        return 'ERROR for appConfig.controllers: is set to TRUE but no controller options were found, is appConfig.resourcesPath set correctly?';
    }
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
    if (helperOptions === true) {
        return 'ERROR for appConfig.helpers: is set to TRUE but no helper options were found, is appConfig.resourcesPath set correctly?';
    }
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
    if (modelOptions === true) {
        return 'ERROR for appConfig.models: is set to TRUE but no model options were found, is appConfig.resourcesPath set correctly?';
    }
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
    const implList = ctrlList.concat(helperList, modelList);
    /////////////////////////////////////////////////////////////////////////////////////
    //FIXME include controllers!
    var viewOptions = mmirAppConfig.views;
    //exmaple:
    // var viewOptions = {
    // 	path: './views',
    // }
    if (viewOptions === true) {
        return 'ERROR for appConfig.views: is set to TRUE but no view options were found, is appConfig.resourcesPath set correctly?';
    }
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
    };
}
exports.createBuildConfig = createBuildConfig;
