
import { BuildAppConfig , ResourceConfig, GrammarBuildEntry , ImplementationBuildEntry , StateModelBuildEntry , ViewBuildEntry , BuildConfig, PluginOptions } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';

import process from 'process';

import _ from 'lodash';

import appConfigUtils from '../utils/module-config-init';
import directoriesJsonUtils from '../tools/directories-utils';

import resourceUtils from '../tools/resources-config-utils';
import settingsUtil from '../tools/settings-utils';
import grammarUtils from '../grammar/grammar-utils';
import scxmlUtils from '../scxml/scxml-utils';
import implUtils from '../impl/impl-utils';
import viewUtils from '../view/view-utils';
import pluginsUtil from '../tools/plugins-utils';
import { customMerge } from '../utils/merge-utils';

import logUtils from '../utils/log-utils';
const log = logUtils.log;
const warn = logUtils.warn;

export function createBuildConfig(mmirAppConfig: BuildAppConfig | WebpackAppConfig, resourcesConfig: ResourceConfig): BuildConfig | string {

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
    if(settingsOptions === true){
        return 'ERROR for appConfig.settings: is set to TRUE but no settings were found, is appConfig.resourcesPath set correctly?';
    }
    const settings = settingsUtil.jsonSettingsFromDir(settingsOptions, appRootDir);
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
            const configFile = Array.isArray(runtimeConfigEntry.file)? runtimeConfigEntry.file[0] : runtimeConfigEntry.file;
            runtimeConfigEntry.value = settingsUtil.loadSettingsFrom(configFile, runtimeConfigEntry.fileType);
        } else {
            warn('could not read configuration settings from file: using empty configuration');
            runtimeConfigEntry.value = {};
        }
    }
    runtimeConfig = runtimeConfigEntry.value;

    /////////////////////////////////////////////////////////////////////////////////////

    var includePluginList = (mmirAppConfig as WebpackAppConfig).includePlugins;
    if(includePluginList){

        includePluginList = includePluginList.map(plugin => pluginsUtil.normalizePluginEntry(plugin));
        includePluginList.forEach(function(plugin){
            log('adding mmir-plugin "'+plugin.id+'" ...');//DEBUG
            pluginsUtil.addPluginInfos(plugin, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settings);
        });

        // check if plugins did add plugin-entries to includePlugins:
        let checkAdditionalPlugins: boolean = true;
        while(checkAdditionalPlugins){

            const configPluginList = (mmirAppConfig as WebpackAppConfig).includePlugins.map(plugin => pluginsUtil.normalizePluginEntry(plugin));
            const additionalPlugins: PluginOptions[] = [];
            if(!_.isEqual(configPluginList, includePluginList)){
                // -> plugin build config did add entries to the plugin list
                const pluginMap = pluginsUtil.processDuplicates(includePluginList);
                configPluginList.forEach(plugin => {
                    const existingPlugin = pluginsUtil.constainsPlugin(plugin, pluginMap.get(plugin.id), false);
                    if(!existingPlugin){
                        additionalPlugins.push(plugin);
                    } else if(!_.isEqual(plugin, existingPlugin)){

                        //TODO check if plugin is "subset" of existingPlugin, and only proceed, if it is not (i.e. has some new/different properties)

                        //first merge existing entry into new one (i.e. specified entries take precedence over generated one):
                        customMerge(plugin, existingPlugin);
                        //then merge into the existing entry (i.e. "update" existing entry)
                        customMerge(existingPlugin, plugin);
                        additionalPlugins.push(plugin);
                    }
                });
            } else {
                checkAdditionalPlugins = false;
            }

            if(additionalPlugins.length > 0){
                // update includePluginList with new plugin list (for next loop, i.e. checking for added plugins)
                includePluginList = configPluginList;
                // do add new plugin entries:
                additionalPlugins.forEach(function(plugin){
                    log('adding mmir-plugin "'+plugin.id+'" (added by plugin build configuration)...');//DEBUG
                    pluginsUtil.addPluginInfos(plugin, mmirAppConfig, directories, resourcesConfig, runtimeConfig, settings);
                });
            } else {
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

    if(grammarOptions === true){
        return 'ERROR for appConfig.grammars: is set to TRUE but no grammar options were found, is appConfig.resourcesPath set correctly?';
    }
    grammarOptions = grammarUtils.parseRuntimeConfigurationForOptions(grammarOptions, runtimeConfig);
    const grammars: GrammarBuildEntry[] = [];
    if(grammarOptions && grammarOptions.path){
        grammarUtils.jsonGrammarsFromDir(grammarOptions, appRootDir, grammars);
    }
    if(grammarOptions && grammarOptions.grammars){
        grammarUtils.jsonGrammarsFromOptions(grammarOptions, appRootDir, grammars);
    }

    grammarOptions = grammarOptions || {};
    if(grammars.length > 0){
        grammarUtils.applyDefaultOptions(grammarOptions, grammars);
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
    if(stateOptions === true){
        return 'ERROR for appConfig.states: is set to TRUE but no state options were found, is appConfig.resourcesPath set correctly?';
    }
    var states: StateModelBuildEntry[] = [];
    if(stateOptions && stateOptions.path){
        // log('including SCXML models from directory ', stateOptions.path);//DEBU
        scxmlUtils.scxmlFromDir(stateOptions, appRootDir, states);
    }
    if(stateOptions && stateOptions.models){
        // log('including SCXML models from options ', stateOptions.models);//DEBU
        scxmlUtils.scxmlFromOptions(stateOptions, appRootDir, states);
    }

    if(stateOptions){
        if(states.length === 0){
            log('no SCXML models specified, including minimal default SCXML models for "input" and "dialog"...');//DEBUG
            scxmlUtils.scxmlDefaults(stateOptions, appRootDir, states);
        }
    } else {
        stateOptions = {};
    }
    scxmlUtils.applyDefaultOptions(stateOptions, states);

    // log('SCXML models: ', states, stateOptions);//DEBUG

    scxmlUtils.addStatesToAppConfig(states, mmirAppConfig, directories, resourcesConfig, runtimeConfig);


    /////////////////////////////////////////////////////////////////////////////////////

    var ctrlOptions = (mmirAppConfig as WebpackAppConfig).controllers;
    if(ctrlOptions === true){
        return 'ERROR for appConfig.controllers: is set to TRUE but no controller options were found, is appConfig.resourcesPath set correctly?';
    }
    var ctrlList: ImplementationBuildEntry[] = [];
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

    var helperOptions = (mmirAppConfig as WebpackAppConfig).helpers;
    if(helperOptions === true){
        return 'ERROR for appConfig.helpers: is set to TRUE but no helper options were found, is appConfig.resourcesPath set correctly?';
    }
    var helperList: ImplementationBuildEntry[] = [];
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

    var modelOptions = (mmirAppConfig as WebpackAppConfig).models;
    if(modelOptions === true){
        return 'ERROR for appConfig.models: is set to TRUE but no model options were found, is appConfig.resourcesPath set correctly?';
    }
    var modelList: ImplementationBuildEntry[] = [];
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
    const implList: ImplementationBuildEntry[] = ctrlList.concat(helperList, modelList);




    /////////////////////////////////////////////////////////////////////////////////////

    //FIXME include controllers!

    var viewOptions = mmirAppConfig.views;
    //exmaple:
    // var viewOptions = {
    // 	path: './views',
    // }
    if(viewOptions === true){
        return 'ERROR for appConfig.views: is set to TRUE but no view options were found, is appConfig.resourcesPath set correctly?';
    }

    var views: ViewBuildEntry[] = [];
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
    } as BuildConfig;
}
