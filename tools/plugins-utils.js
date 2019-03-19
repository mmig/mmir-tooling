
var path = require('path');
var _ = require('lodash');
var appConfigUtils = require('../utils/module-config-init.js');
var settingsUtils = require('./settings-utils.js');
var fileUtils = require('../utils/filepath-utils.js');

var logUtils = require('../utils/log-utils.js');
var log = logUtils.log;
var warn = logUtils.warn;

var asrCoreId = 'mmir-plugin-encoder-core.js';
var ttsCoreId = 'audiotts.js';

var applyToAllSpeechConfigs = '__apply-to-all-configs__';
var ALL_SPEECH_CONFIGS_TYPE = settingsUtils.getAllSpeechConfigsType();

/**
 * mapping from file-name to load-module-ID in MediaManager/plugin-loading mechanism
 * (to be used in configuration.json)
 */
var moduleIdMap = {
	'webaudioinput.js': 'mmir-plugin-encoder-core.js',
	'mmir-plugin-tts-core-xhr.js': 'audiotts.js'
};

/**
 * for webAudioInput module's specific service/implementations:
 * mapping from file-name to load-module-ID in MediaManager/plugin-loading mechanism
 * (to be used in configuration.json)
 */
var implFileIdMap = {
	'webasrgoogleimpl.js': 'mmir-plugin-asr-google-xhr.js',
	'webasrnuanceimpl.js': 'mmir-plugin-asr-nuance-xhr.js'
};

var deprecatedImplFileIdMap = {
	'webasratntimpl.js': 'webasrAtntImpl.js',
	'webasrgooglev1impl.js': 'webasrGooglev1Impl.js'
};

function isAsrPlugin(pluginId){
	return /^mmir-plugin-asr-/.test(pluginId);
}

function resolveAndAddAliasPaths(alias, paths){
	for(var p in paths){
		paths[p] = path.resolve(paths[p]);
		alias[p] = paths[p];
	}
	return paths;
}

function normalizeModName(modName){
	return modName.replace(/\.js$/i, '');
}

function getPluginEntryFrom(confEntry, pluginConfigList){

	var simpleModName = normalizeModName(confEntry.mod);
	var simpleConfigName = normalizeModName(confEntry.config);
	var ctx = confEntry.ctx || false;
	return pluginConfigList.find(function(entry){
		if(typeof entry === 'string'){
			return normalizeModName(entry) === simpleModName;
		}
		return (
			normalizeModName(entry.mod) === simpleModName &&
			normalizeModName(entry.config) === simpleConfigName &&
			(!ctx || entry.ctx === ctx)
		);
	});
}

function normalizeImplName(implName){
	if(!/\.js$/i.test(implName)){
		implName += '.js';
	}
	return implName.toLowerCase();
}

function normalizeMediaManagerPluginConfig(configList){
	var id, normalized;
	configList.forEach(function(entry, index, list){
		if(typeof entry === 'string'){
			id = implFileIdMap[normalizeImplName(entry)];
			if(id){
				list[index] = id;
			}
		} else {
			if(typeof entry.mod === 'string'){
				id = moduleIdMap[normalizeImplName(entry.mod)];
				if(id){
					entry.mod = id;
				}
			}
			if(typeof entry.config === 'string'){
				normalized = normalizeImplName(entry.config);
				id = moduleIdMap[normalized];
				if(id){
					entry.config = id;
				} else if(deprecatedImplFileIdMap[normalized]){
					warn('WARN plugin-utils: found deprecated media-plugin '+deprecatedImplFileIdMap[normalized]+' in configuration; this plugin will probably not work ', entry);
				}
			}
		}
	});
}

function getConfigEnv(pluginConfig, pluginInfo, runtimeConfig){

	var env = pluginConfig && pluginConfig.env;
	if(!env && pluginInfo.defaultValues && pluginInfo.defaultValues.env){
		env = pluginInfo.defaultValues.env;
		if(!Array.isArray(env)){
			env = [env];
		}
	}
	if(!env && runtimeConfig.mediaManager && runtimeConfig.mediaManager.plugins){
		env = Object.keys(runtimeConfig.mediaManager.plugins);
	}
	if(!env){
		//FIXME TODO get default env-definitions from MediaManager!
		env = ['browser', 'cordova'];
	}
	if(typeof env === 'string'){
		env = [env];
	}
	// log('########### using env', env);
	return env;
}

/**
 * create plugin-entry in mediaManager.plugin configuration
 *
 * @param  {MMIRPluginConfig} pluginConfig the (user supplied) plugin-configuration
 * @param  {MMIRPluginInfo} pluginConfigInfo the plugin-info
 * @param  {string} pluginId the plugin-ID
 * @return {MediaManagerPluginEntry} the plugin-entry for mediaManager.plugin
 */
function createConfigEntry(pluginConfig, pluginConfigInfo, pluginId){
	var isAsr = isAsrPlugin(pluginId);
	var mod = pluginConfigInfo.defaultValues && pluginConfigInfo.defaultValues.mod;
	var type = pluginConfigInfo.defaultValues && pluginConfigInfo.defaultValues.type;
	// log('#### config entry for '+pluginConfigInfo.pluginName+' default mod? ', JSON.stringify(mod));//DEBUG
	if(!mod){
		// log('#### config entry for '+pluginConfigInfo.pluginName+' default mod? ', mod);//DEBUG
		if(type){
			mod = type === 'asr'? asrCoreId : ttsCoreId;
			if(mod === ttsCoreId && type !== 'tts'){
				warn('ERROR plugin-utils: plugin did not specify module-name and a plugin-type other than "asr" and "tts" (type '+type+'), cannot automatically derive module-name for config-entry of ', pluginId);
			}
		} else {
			mod = isAsr? asrCoreId : ttsCoreId;
		}

	} else {
		mod = moduleIdMap[normalizeImplName(mod)] || mod;
	}
	var config = normalizeImplName(pluginId);//TODO should only create plugin-ID-config, if necessary (i.e. for "sub-module implementations", not for "main module plugins" like android-speech plugin)
	var ctx = (pluginConfig && pluginConfig.ctx) || void(0);

	//{ "mod": "mmir-plugin-encoder-core.js", "config": "mmir-plugin-asr-nuance-xhr.js", "type": "asr"}
	return {mod: mod, config: config, type: type, ctx: ctx};
}

/**
 * apply config-values from pluginConfig to runtimeConfig into entry pluginConfigInfo.pluginName
 *
 * @param  {MMIRPluginConfig} pluginConfig the plugin-configuration
 * @param  {Configuration} runtimeConfig the main configuration (JSON-like) object
 * @param  {Settings} settings the application settings (dicitionaries, speech-configs etc)
 * @param  {MMIRPluginInfo} pluginConfigInfo the plugin-info
 */
function applyPluginSpeechConfig(pluginConfig, settings, pluginConfigInfo){

	var speechConfs = pluginConfigInfo.speechConfig;
	if(speechConfs){

		var applyList = [];
		speechConfs.forEach(function(sc){
			if(pluginConfig[sc]){
				applyList.push({name: sc, value: pluginConfig[sc]});
			}
		});

		if(applyList.length > 0){

			var speechConfigs = new Map();
			settingsUtils.getSettingsFor(settings, 'speech').forEach(function(sc){
				speechConfigs.set(sc.id, sc);
			});

			var allSpeech = settings.find(function(s){ return s.type === ALL_SPEECH_CONFIGS_TYPE; });
			if(allSpeech){
				speechConfigs.set(ALL_SPEECH_CONFIGS_TYPE, allSpeech);
			}

			var val, name;
			applyList.forEach(function(config){
				val = config.value;
				name = config.name;
				if(typeof val !== 'string'){

					Object.keys(val).forEach(function(lang){
						doApplySpeechConfigValue(name, val[lang], lang, pluginConfigInfo.pluginName, speechConfigs, settings);
					});

				} else {
					doApplySpeechConfigValue(name, val, applyToAllSpeechConfigs, pluginConfigInfo.pluginName, speechConfigs, settings);
				}
			});

		}
	}
}

function doApplySpeechConfigValue(name, val, lang, pluginName, speechConfigs, settings){

		var sc = speechConfigs.get(lang);
		if(!sc){
			sc = settingsUtils.createSettingsEntryFor(lang === applyToAllSpeechConfigs? ALL_SPEECH_CONFIGS_TYPE : 'speech', {plugins: {}}, lang);
			speechConfigs.set(lang, sc);
			settings.push(sc);

		} else {

			if(!sc.value){
				//NOTE will crash, if file is a list ... for now, no support for file-list speech-configs!
				sc.value = settingsUtils.loadSettingsFrom(sc.file);
			}

			if(sc.include && sc.include !== 'inline'){
				warn("WARN plugin-utils: applying plugin speech-config to file setting, cannot include this as file, enforce inlining instead.");
				sc.include = 'inline';
			}
		}

		sc.value.plugins = sc.value.plugins || {};
		var configEntry = sc.value.plugins[pluginName];
		if(!configEntry){
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
function applyPluginConfig(pluginConfig, runtimeConfig, pluginConfigInfo){

	var config = runtimeConfig[pluginConfigInfo.pluginName] || {};
	var speechConfs = pluginConfigInfo.speechConfig? new Set(pluginConfigInfo.speechConfig) : null;
	for(var c in pluginConfig){
		if(c === 'env' || c === 'ctx' || c === 'mod' || (speechConfs && speechConfs.has(c))){
			continue;
		}
		config[c] = pluginConfig[c];
	}
	runtimeConfig[pluginConfigInfo.pluginName] = config;
}

function addConfig(pluginConfig, runtimeConfig, settings, pluginConfigInfo, pluginId){

	if(pluginConfig){
		applyPluginConfig(pluginConfig, runtimeConfig, pluginConfigInfo);
		applyPluginSpeechConfig(pluginConfig, settings, pluginConfigInfo);
	}

	var confEntry = createConfigEntry(pluginConfig, pluginConfigInfo, pluginId);

	var env = getConfigEnv(pluginConfig, pluginConfigInfo, runtimeConfig);

	// log('#### will add '+pluginConfigInfo.pluginName+' to envs ', env, ' with entry ', confEntry);//DEBUG

	if(!runtimeConfig.mediaManager){
		runtimeConfig.mediaManager = {};
	}
	if(!runtimeConfig.mediaManager.plugins){
		runtimeConfig.mediaManager.plugins = {};
	}
	var pConfig = runtimeConfig.mediaManager.plugins;
	var pList, cEntry;
	env.forEach(function(e){
		pList = pConfig[e];
		if(pList){
			normalizeMediaManagerPluginConfig(pList);
			cEntry = getPluginEntryFrom(confEntry, pList);
			if(cEntry){
				_.merge(cEntry, confEntry);
			} else {
				pConfig[e].push(confEntry);
			}
		} else {
			//FIXME this whould also require to add defaults like audio-output
			pConfig[e] = [confEntry]
		}
	});

	//TODO add/apply configuration for core-dependency mmir-plugin-encoder-core ~> silence-detection, if specified
}

module.exports = {
	addPluginInfos: function(pluginSettings, appConfig, _directories, resourcesConfig, runtimeConfig, settings){

		var workersList = resourcesConfig.workers;
		var binFilesList = resourcesConfig.fileResources;
		var binFilesPaths = resourcesConfig.resourcesPaths;
		// var _textFilesList = resourcesConfig.textResources;

		var pluginId = pluginSettings.id;
		var pluginConfig = pluginSettings.config;
		var mode = pluginSettings.mode;

		var pluginInfo = require(pluginId + '/module-ids.gen.js');

		var paths = pluginInfo.getAll('paths', mode, true);

		resolveAndAddAliasPaths(appConfig.paths, paths)

		var workers = pluginInfo.getAll('workers', mode);

		workers.forEach(function(w){
			workersList.push(paths[w]);
		});

		var includeModules = pluginInfo.getAll('modules', mode);

		includeModules.forEach(function(mod){
			appConfigUtils.addIncludeModule(appConfig, mod, paths[mod]);
		});

		var includeFiles = pluginInfo.getAll('files', mode);
		includeFiles.forEach(function(mod){

			var modPath = paths[mod];

			binFilesList.push(modPath);

			//NOTE the module-ID for exported files is <plugin ID>/<file name without extension>
			//     -> specify the include-path for the files (i.e. relative path to which the file is copied) as
			//        <plugin ID>/<file name>
			binFilesPaths[fileUtils.normalizePath(modPath)] = path.normalize(path.join(path.dirname(mod), path.basename(modPath)));

			// log('  ############### adding exported (raw) file for plugin '+pluginId+' ['+mod+'] -> ', modPath);//DEBUG

			appConfigUtils.addIncludeModule(appConfig, mod, modPath);

		});

		var pluginConfigInfo = require(pluginId + '/module-config.gen.js');

		if(pluginConfigInfo.pluginName){
			if(Array.isArray(pluginConfigInfo.pluginName)){
				pluginConfigInfo.pluginName.forEach(function(pluginName){
					addConfig(pluginConfig, runtimeConfig, settings, pluginConfigInfo.plugins[pluginName], pluginId);
				});
			} else {
				addConfig(pluginConfig, runtimeConfig, settings, pluginConfigInfo, pluginId);
			}
		} else {
			warn('ERROR plugin-utils: invalid module-config.js for plugin '+pluginId+': missing field pluginName ', pluginConfigInfo);
		}

		log('plugin-utils: addPluginInfos() -> paths ', paths, ', workers ', workers, ', include modules ', includeModules, runtimeConfig);//DEBUG
	}
};
