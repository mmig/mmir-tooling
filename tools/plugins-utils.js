"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const module_config_init_1 = __importDefault(require("../utils/module-config-init"));
const settings_utils_1 = __importDefault(require("./settings-utils"));
const filepath_utils_1 = __importDefault(require("../utils/filepath-utils"));
const merge_utils_1 = require("../utils/merge-utils");
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
const asrCoreId = 'mmir-plugin-encoder-core.js';
const ttsCoreId = 'audiotts.js';
const applyToAllSpeechConfigs = '__apply-to-all-configs__';
const ALL_SPEECH_CONFIGS_TYPE = settings_utils_1.default.getAllSpeechConfigsType();
/**
 * mapping from file-name to load-module-ID in MediaManager/plugin-loading mechanism
 * (to be used in configuration.json)
 */
const moduleIdMap = {
    'webaudioinput.js': 'mmir-plugin-encoder-core.js',
    'mmir-plugin-tts-core-xhr.js': 'audiotts.js'
};
/**
 * for webAudioInput module's specific service/implementations:
 * mapping from file-name to load-module-ID in MediaManager/plugin-loading mechanism
 * (to be used in configuration.json)
 */
const implFileIdMap = {
    'webasrgoogleimpl.js': 'mmir-plugin-asr-google-xhr.js',
    'webasrnuanceimpl.js': 'mmir-plugin-asr-nuance-xhr.js'
};
const deprecatedImplFileIdMap = {
    'webasratntimpl.js': 'webasrAtntImpl.js',
    'webasrgooglev1impl.js': 'webasrGooglev1Impl.js'
};
function isAsrPlugin(pluginId) {
    return /^mmir-plugin-asr-/.test(pluginId);
}
function resolveAndAddAliasPaths(alias, paths) {
    for (var p in paths) {
        paths[p] = path_1.default.resolve(paths[p]);
        alias[p] = paths[p];
    }
    return paths;
}
function normalizeModName(modName) {
    return modName.replace(/\.js$/i, '');
}
function getPluginEntryFrom(confEntry, pluginConfigList) {
    var simpleModName = normalizeModName(confEntry.mod);
    var simpleConfigName = normalizeModName(confEntry.config);
    var ctx = confEntry.ctx || false;
    return pluginConfigList.find(function (entry) {
        if (typeof entry === 'string') {
            return normalizeModName(entry) === simpleModName;
        }
        return (normalizeModName(entry.mod) === simpleModName &&
            normalizeModName(entry.config) === simpleConfigName &&
            (!ctx || entry.ctx === ctx));
    });
}
function normalizeImplName(implName) {
    if (!/\.js$/i.test(implName)) {
        implName += '.js';
    }
    return implName.toLowerCase();
}
function normalizeMediaManagerPluginConfig(configList) {
    var id, normalized;
    configList.forEach(function (entry, index, list) {
        if (typeof entry === 'string') {
            id = implFileIdMap[normalizeImplName(entry)];
            if (id) {
                list[index] = id;
            }
        }
        else {
            if (typeof entry.mod === 'string') {
                id = moduleIdMap[normalizeImplName(entry.mod)];
                if (id) {
                    entry.mod = id;
                }
            }
            if (typeof entry.config === 'string') {
                normalized = normalizeImplName(entry.config);
                id = moduleIdMap[normalized];
                if (id) {
                    entry.config = id;
                }
                else if (deprecatedImplFileIdMap[normalized]) {
                    warn('WARN plugin-utils: found deprecated media-plugin ' + deprecatedImplFileIdMap[normalized] + ' in configuration; this plugin will probably not work ', entry);
                }
            }
        }
    });
}
function getConfigDefaultValue(configName, pluginInfo) {
    return pluginInfo.defaultValues && pluginInfo.defaultValues[configName];
}
function getSpeechConfigDefaultValue(configName, pluginInfo) {
    return pluginInfo.defaultSpeechValues && pluginInfo.defaultSpeechValues[configName];
}
function getConfigEnv(pluginConfig, pluginInfo, runtimeConfig) {
    let env = pluginConfig && pluginConfig.env;
    if (!env && getConfigDefaultValue('env', pluginInfo)) {
        env = getConfigDefaultValue('env', pluginInfo);
        if (!Array.isArray(env)) {
            env = [env];
        }
    }
    if (!env && runtimeConfig.mediaManager && runtimeConfig.mediaManager.plugins) {
        env = Object.keys(runtimeConfig.mediaManager.plugins);
    }
    if (!env) {
        //FIXME TODO get default env-definitions from MediaManager!
        env = ['browser', 'cordova'];
    }
    if (typeof env === 'string') {
        env = [env];
    }
    // log('########### using env', env);
    return env;
}
/**
 * create plugin-entry in mediaManager.plugin configuration
 *
 * @param  {PluginConfig | TTSPluginSpeechConfig} pluginConfig the (user supplied) plugin-configuration
 * @param  {MMIRPluginInfo} pluginConfigInfo the plugin-info
 * @param  {string} pluginId the plugin-ID
 * @return {MediaManagerPluginEntry} the plugin-entry for mediaManager.plugin
 */
function createConfigEntry(pluginConfig, pluginConfigInfo, pluginId) {
    var isAsr = isAsrPlugin(pluginId);
    var mod = getConfigDefaultValue('mod', pluginConfigInfo);
    var type = getConfigDefaultValue('type', pluginConfigInfo);
    // log('#### config entry for '+pluginConfigInfo.pluginName+' default mod? ', JSON.stringify(mod));//DEBUG
    if (!mod) {
        // log('#### config entry for '+pluginConfigInfo.pluginName+' default mod? ', mod);//DEBUG
        if (type) {
            mod = type === 'asr' ? asrCoreId : ttsCoreId;
            if (mod === ttsCoreId && type !== 'tts') {
                warn('ERROR plugin-utils: plugin did not specify module-name and a plugin-type other than "asr" and "tts" (type ' + type + '), cannot automatically derive module-name for config-entry of ', pluginId);
            }
        }
        else {
            mod = isAsr ? asrCoreId : ttsCoreId;
        }
    }
    else {
        mod = moduleIdMap[normalizeImplName(mod)] || mod;
    }
    var config = normalizeImplName(pluginId); //TODO should only create plugin-ID-config, if necessary (i.e. for "sub-module implementations", not for "main module plugins" like android-speech plugin)
    var ctx = (pluginConfig && pluginConfig.ctx) || void (0);
    //{ "mod": "mmir-plugin-encoder-core.js", "config": "mmir-plugin-asr-nuance-xhr.js", "type": "asr"}
    return { mod: mod, config: config, type: type, ctx: ctx };
}
/**
 * apply config-values from pluginConfig to runtimeConfig into entry pluginConfigInfo.pluginName
 *
 * @param  {MMIRPluginConfig} pluginConfig the plugin-configuration
 * @param  {Configuration} runtimeConfig the main configuration (JSON-like) object
 * @param  {Settings} settings the application settings (dicitionaries, speech-configs etc)
 * @param  {MMIRPluginInfo} pluginConfigInfo the plugin-info
 */
function applyPluginSpeechConfig(pluginConfig, settings, pluginConfigInfo) {
    var speechConfs = pluginConfigInfo.speechConfig;
    if (speechConfs) {
        var applyList = [], defaultVal;
        speechConfs.forEach(function (sc) {
            if (pluginConfig[sc]) {
                applyList.push({ name: sc, value: pluginConfig[sc] });
            }
            else {
                defaultVal = getSpeechConfigDefaultValue(sc, pluginConfigInfo);
                if (typeof defaultVal !== 'undefined' && defaultVal !== null) {
                    applyList.push({ name: sc, value: defaultVal });
                }
            }
        });
        if (applyList.length > 0) {
            var speechConfigs = new Map();
            settings_utils_1.default.getSettingsFor(settings, 'speech').forEach(function (sc) {
                speechConfigs.set(sc.id, sc);
            });
            const allSpeech = settings.find(function (s) { return s.type === ALL_SPEECH_CONFIGS_TYPE; });
            if (allSpeech) {
                speechConfigs.set(ALL_SPEECH_CONFIGS_TYPE, allSpeech);
            }
            let val, name;
            applyList.forEach(function (config) {
                val = config.value;
                name = config.name;
                if (typeof val !== 'string') {
                    Object.keys(val).forEach(function (lang) {
                        doApplySpeechConfigValue(name, val[lang], lang, pluginConfigInfo.pluginName, speechConfigs, settings);
                    });
                }
                else {
                    doApplySpeechConfigValue(name, val, applyToAllSpeechConfigs, pluginConfigInfo.pluginName, speechConfigs, settings);
                }
            });
        }
    }
}
function doApplySpeechConfigValue(name, val, lang, pluginName, speechConfigs, settings) {
    var sc = speechConfigs.get(lang);
    if (!sc) {
        sc = settings_utils_1.default.createSettingsEntryFor(lang === applyToAllSpeechConfigs ? ALL_SPEECH_CONFIGS_TYPE : 'speech', { plugins: {} }, lang);
        speechConfigs.set(lang, sc);
        settings.push(sc);
    }
    else {
        if (!sc.value) {
            //NOTE will crash, if file is a list ... for now, no support for file-list speech-configs!
            sc.value = settings_utils_1.default.loadSettingsFrom(sc.file);
        }
    }
    sc.value.plugins = sc.value.plugins || {};
    var configEntry = sc.value.plugins[pluginName];
    if (!configEntry) {
        configEntry = {};
        sc.value.plugins[pluginName] = configEntry;
    }
    configEntry[name] = val;
}
/**
 * apply config-values from pluginConfig to runtimeConfig into entry pluginConfigInfo.pluginName
 *
 * @param  {MMIRPluginConfig} pluginConfig the plugin-configuration
 * @param  {Configuration} runtimeConfig the main configuration (JSON-like) object
 * @param  {MMIRPluginInfo} pluginConfigInfo the plugin-info
 */
function applyPluginConfig(pluginConfig, runtimeConfig, pluginConfigInfo) {
    var config = runtimeConfig[pluginConfigInfo.pluginName] || {};
    var speechConfs = pluginConfigInfo.speechConfig ? new Set(pluginConfigInfo.speechConfig) : null;
    for (var c in pluginConfig) {
        if (c === 'env' || c === 'ctx' || c === 'mod' || (speechConfs && speechConfs.has(c))) {
            continue;
        }
        config[c] = pluginConfig[c];
    }
    runtimeConfig[pluginConfigInfo.pluginName] = config;
}
function addConfig(pluginConfig, runtimeConfig, settings, pluginConfigInfo, pluginId) {
    if (pluginConfig) {
        applyPluginConfig(pluginConfig, runtimeConfig, pluginConfigInfo);
        applyPluginSpeechConfig(pluginConfig, settings, pluginConfigInfo);
    }
    var pluginType = getConfigDefaultValue('type', pluginConfigInfo);
    if (pluginType !== 'custom') {
        //-> media plugin, e.g. "asr" or "tts" or "audio"
        //   (for "custom" plugins: do not create mediaManager entry, inlcude the exported module (already done in addPluginInfos()))
        var confEntry = createConfigEntry(pluginConfig, pluginConfigInfo, pluginId);
        var env = getConfigEnv(pluginConfig, pluginConfigInfo, runtimeConfig);
        // log('#### will add '+pluginConfigInfo.pluginName+' to envs ', env, ' with entry ', confEntry);//DEBUG
        if (!runtimeConfig.mediaManager) {
            runtimeConfig.mediaManager = {};
        }
        if (!runtimeConfig.mediaManager.plugins) {
            runtimeConfig.mediaManager.plugins = {};
        }
        var pConfig = runtimeConfig.mediaManager.plugins;
        var pList, cEntry;
        env.forEach(function (e) {
            pList = pConfig[e];
            if (pList) {
                normalizeMediaManagerPluginConfig(pList);
                cEntry = getPluginEntryFrom(confEntry, pList);
                if (cEntry) {
                    lodash_1.default.mergeWith(cEntry, confEntry, merge_utils_1.mergeLists);
                }
                else {
                    pConfig[e].push(confEntry);
                }
            }
            else {
                //FIXME this whould also require to add defaults like audio-output
                pConfig[e] = [confEntry];
            }
        });
        //TODO add/apply configuration for core-dependency mmir-plugin-encoder-core ~> silence-detection, if specified
    }
}
/**
 *
 * @param  target target for merging the build configs (INOUT parameter)
 * @param  list array of build configs
 * @param  listOffset offset index from where to start merging from the list (i.e. use 0 to merge from the start of the list)
 * @return the merged build-config
 */
function mergeBuildConfigs(target, list, listOffset, pluginConfig, runtimeConfig, pluginBuildConfig) {
    for (var i = listOffset, size = list.length; i < size; ++i) {
        // if entry is a build-config creator function -> replace with created build-config
        if (typeof list[i] === 'function') {
            list[i] = list[i](pluginConfig, runtimeConfig, pluginBuildConfig);
            // if result is a list, do merge into its first entry and replace list[i] with the merged result
            if (Array.isArray(list[i])) {
                list[i] = mergeBuildConfigs(list[i][0], list[i], 1, pluginConfig, runtimeConfig, pluginBuildConfig);
            }
        }
        merge_utils_1.customMerge(target, list[i]);
    }
    return target;
}
function addBuildConfig(pluginConfig, pluginBuildConfig, runtimeConfig, appConfig, buildConfigs, pluginId) {
    if (Array.isArray(buildConfigs) && buildConfigs.length > 0) {
        //NOTE if no pluginConfigInfo.buildConfig is specified, then the plugin does not support build-config settings, so pluginBuildConfig will also be ignored!
        // console.log('plugin-utils.addBuildConfig['+pluginId+']: applying plugin\'s build configuration ', pluginConfigInfo.buildConfigs);
        // console.log('plugin-utils.addBuildConfig['+pluginId+']: runtimeConfig', runtimeConfig);
        var bconfigList = buildConfigs;
        var bconfig = bconfigList[0];
        if (typeof bconfig === 'function') {
            // if entry is a build-config creator function -> do create build-config now
            bconfig = bconfig(pluginConfig, runtimeConfig, pluginBuildConfig) || {}; //<- if undefined result, bootstrap with empty build-config
            if (Array.isArray(bconfig)) {
                bconfig = mergeBuildConfigs({}, bconfig, 0, pluginConfig, runtimeConfig, pluginBuildConfig);
            }
        }
        bconfig = mergeBuildConfigs(bconfig, bconfigList, 1, pluginConfig, runtimeConfig, pluginBuildConfig);
        var usedPluginBuildConfigKeys = new Set();
        Object.keys(bconfig).forEach(function (key) {
            var val = bconfig[key];
            if (typeof val === 'undefined') {
                return;
            }
            if (typeof appConfig[key] === 'undefined') {
                if (pluginBuildConfig && typeof pluginBuildConfig[key] !== 'undefined') {
                    merge_utils_1.customMerge(val, pluginBuildConfig[key]);
                    usedPluginBuildConfigKeys.add(key);
                }
                appConfig[key] = val;
            }
            else if (appConfig[key] && typeof appConfig[key] === 'object' && val && typeof val === 'object') {
                //if both build-configs are valid objects:
                if (pluginBuildConfig && typeof pluginBuildConfig[key] !== 'undefined') {
                    //user-supplied plugin-specific build-config overrides general user-supplied build-config:
                    merge_utils_1.customMerge(appConfig[key], pluginBuildConfig[key]);
                    usedPluginBuildConfigKeys.add(key);
                }
                //... then merge appConfig's value into the plugin's build config
                //  (i.e. user-supplied build-configuration overrides plugin-build-configuration when merging)
                merge_utils_1.customMerge(val, appConfig[key]);
                appConfig[key] = val;
            }
            else if (pluginBuildConfig && typeof pluginBuildConfig[key] !== 'undefined') {
                merge_utils_1.customMerge(appConfig[key], pluginBuildConfig[key]);
                usedPluginBuildConfigKeys.add(key);
            }
            //else: use value of appConfig[key] (i.e. user-supplied build-configuration overrides plugin-build-configuration)
        });
        //lastly: add config-settings from pluginBuildConfig that were not applied yet:
        if (pluginBuildConfig) {
            Object.keys(pluginBuildConfig).forEach(function (key) {
                if (usedPluginBuildConfigKeys.has(key)) {
                    return;
                }
                var val = pluginBuildConfig[key];
                if (typeof val === 'undefined') {
                    return;
                }
                if (typeof appConfig[key] === 'undefined') {
                    appConfig[key] = val;
                }
                else if (appConfig[key] && typeof appConfig[key] === 'object' && val && typeof val === 'object') {
                    //if both build-configs are valid objects: plugin-specific user-supplied config is merged, but overrides general user-supplied build-config:
                    merge_utils_1.customMerge(appConfig[key], val);
                }
                else {
                    //otherwise: plugin-specific user-supplied config overrides general user-supplied build-config:
                    appConfig[key] = pluginBuildConfig[key];
                }
            });
        }
    }
    else if (pluginBuildConfig) {
        warn('WARN plugin-utils: encountered user-specified build-configuration for plugin ' + pluginId + ', but plugin does not not support build-configuration, ignoring user build config ', pluginBuildConfig);
    }
    //TODO transfere requirejs config unto runtimeConfig?
    // if(!runtimeConfig.config){
    // 	runtimeConfig.config = {};
    // }
    // var pConfig = runtimeConfig.config;
    // var pList, cEntry;
    // env.forEach(function(e){
    // 	pList = pConfig[e];
    // 	// if(pList){
    // 	// 	normalizeMediaManagerPluginConfig(pList);
    // 	// 	cEntry = getPluginEntryFrom(confEntry, pList);
    // 	// 	if(cEntry){
    // 	// 		customMerge(cEntry, confEntry);
    // 	// 	} else {
    // 	// 		pConfig[e].push(confEntry);
    // 	// 	}
    // 	// } else {
    // 	// 	//FIXME this whould also require to add defaults like audio-output
    // 	// 	pConfig[e] = [confEntry]
    // 	// }
    // });
}
function isPluginExportConfigInfoMultiple(pluginInfo) {
    return Array.isArray(pluginInfo.pluginName);
}
/**
 * check if `plugin` is already contained in `pluginList`
 *
 * NOTE: uses deep comparision, i.e. entries with same id (plugin.id) are considered
 *       deferent, if their (other) properties differ (even if the IDs match).
 *
 * @param  plugin the plugin
 * @param  pluginList the list of plugins to check
 * @param  deepComparison if `true`, makes deep comparision, instead of comparing the IDs
 * @return `false` if `plugin` is NOT contained in `pluginList`, otherwise the duplicate entry from `pluginList`
 */
function constainsPlugin(plugin, pluginList, deepComparison) {
    if (!pluginList) {
        return false;
    }
    for (var j = pluginList.length - 1; j >= 0; --j) {
        if (deepComparison ? lodash_1.default.isEqual(plugin, pluginList[j]) : plugin.id === pluginList[j].id) {
            return pluginList[j];
        }
    }
    return false;
}
function processDuplicates(pluginList, removeFromList) {
    const map = new Map();
    for (let i = pluginList.length - 1; i >= 0; --i) {
        const plugin = pluginList[i];
        let duplicates = map.get(plugin.id);
        if (!duplicates) {
            duplicates = [plugin];
            map.set(plugin.id, duplicates);
        }
        else {
            let hasDuplicate = constainsPlugin(plugin, duplicates, false);
            if (!hasDuplicate) {
                duplicates.push(plugin);
            }
            else if (removeFromList) {
                pluginList.splice(i, 1);
            }
        }
    }
    return map;
}
function normalizePluginEntry(plugin) {
    const id = typeof plugin === 'string' ? plugin : plugin.id;
    return typeof plugin !== 'string' ? plugin : { id: id };
}
module.exports = {
    addPluginInfos: function (pluginSettings, appConfig, _directories, resourcesConfig, runtimeConfig, settings) {
        const workersList = resourcesConfig.workers;
        const binFilesList = resourcesConfig.fileResources;
        const binFilesPaths = resourcesConfig.resourcesPaths;
        // const _textFilesList = resourcesConfig.textResources;
        const pluginId = pluginSettings.id;
        const pluginConfig = pluginSettings.config;
        const pluginBuildConfig = pluginSettings.build;
        const mode = pluginSettings.mode;
        const pluginInfo = require(pluginId + '/module-ids.gen.js');
        const paths = pluginInfo.getAll('paths', mode, true);
        resolveAndAddAliasPaths(appConfig.paths, paths);
        const workers = pluginInfo.getAll('workers', mode);
        workers.forEach(function (w) {
            workersList.push(paths[w]);
        });
        const includeModules = pluginInfo.getAll('modules', mode);
        includeModules.forEach(function (mod) {
            module_config_init_1.default.addIncludeModule(appConfig, mod, paths[mod]);
        });
        const includeFiles = pluginInfo.getAll('files', mode);
        includeFiles.forEach(function (mod) {
            const modPath = paths[mod];
            binFilesList.push(modPath);
            //NOTE the module-ID for exported files is <plugin ID>/<file name without extension>
            //     -> specify the include-path for the files (i.e. relative path to which the file is copied) as
            //        <plugin ID>/<file name>
            binFilesPaths[filepath_utils_1.default.normalizePath(modPath)] = path_1.default.normalize(path_1.default.join(path_1.default.dirname(mod), path_1.default.basename(modPath)));
            // log('  ############### adding exported (raw) file for plugin '+pluginId+' ['+mod+'] -> ', modPath);//DEBUG
            module_config_init_1.default.addIncludeModule(appConfig, mod, modPath);
        });
        const pluginConfigInfo = require(pluginId + '/module-config.gen.js');
        if (pluginConfigInfo.pluginName) {
            if (isPluginExportConfigInfoMultiple(pluginConfigInfo)) {
                pluginConfigInfo.pluginName.forEach(function (pluginName) {
                    addConfig(pluginConfig, runtimeConfig, settings, pluginConfigInfo.plugins[pluginName], pluginId);
                    const buildConfigs = pluginInfo.getBuildConfig(pluginName);
                    // backwards compatiblity when generated by mmir-plugin-exports < 2.3.0 (would not include build-configs of dependencies):
                    if (!buildConfigs || buildConfigs.length === 0) {
                        if (pluginConfigInfo.plugins[pluginName].buildConfigs)
                            merge_utils_1.customMerge(buildConfigs, pluginConfigInfo.plugins[pluginName].buildConfigs);
                        if (pluginConfigInfo.buildConfigs)
                            merge_utils_1.customMerge(buildConfigs, pluginConfigInfo.buildConfigs);
                    }
                    addBuildConfig(pluginConfig, pluginBuildConfig, runtimeConfig, appConfig, buildConfigs, pluginId);
                });
            }
            else {
                const buildConfigs = pluginInfo.getBuildConfig();
                // backwards compatiblity when generated by mmir-plugin-exports < 2.3.0 (would not include build-configs of dependencies):
                if ((!buildConfigs || buildConfigs.length === 0) && pluginConfigInfo.buildConfigs) {
                    merge_utils_1.customMerge(buildConfigs, pluginConfigInfo.buildConfigs);
                }
                addConfig(pluginConfig, runtimeConfig, settings, pluginConfigInfo, pluginId);
                addBuildConfig(pluginConfig, pluginBuildConfig, runtimeConfig, appConfig, buildConfigs, pluginId);
            }
        }
        else {
            warn('ERROR plugin-utils: invalid module-config.js for plugin ' + pluginId + ': missing field pluginName ', pluginConfigInfo);
        }
        log('plugin-utils: addPluginInfos() -> paths ', paths, ', workers ', workers, ', include modules ', includeModules, runtimeConfig); //DEBUG
    },
    processDuplicates: processDuplicates,
    constainsPlugin: constainsPlugin,
    normalizePluginEntry: normalizePluginEntry
};
