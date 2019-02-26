
var path = require('path');
var _ = require('lodash');
var appConfigUtils = require('./webpack-app-module-config-utils.js');
var settingsUtils = require('./settings-utils.js');

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

function addResolveAliasPaths(alias, paths){
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
					console.log('WARN: found deprecated media-plugin '+deprecatedImplFileIdMap[normalized]+' in configuration; this plugin will probably not work ', entry);
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
	// console.log('########### using env', env);
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
	// console.log('#### config entry for '+pluginConfigInfo.pluginName+' default mod? ', JSON.stringify(mod));//DEBUG
	if(!mod){
		// console.log('#### config entry for '+pluginConfigInfo.pluginName+' default mod? ', mod);//DEBUG
		mod = isAsr? asrCoreId : ttsCoreId;
	} else {
		mod = moduleIdMap[normalizeImplName(mod)] || mod;
	}
	var config = normalizeImplName(pluginId);//TODO should only create plugin-ID-config, if necessary (i.e. for "sub-module implementations", not for "main module plugins" like android-speech plugin)
	var ctx = (pluginConfig && pluginConfig.ctx) || void(0);

	//{ "mod": "mmir-plugin-encoder-core.js", "config": "mmir-plugin-asr-nuance-xhr.js"}
	return {mod: mod, config: config, ctx: ctx};
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
				console.log("WARN settings-utils: applying plugin speech-config to file setting, cannot include this as file, enforce inlining instead.");
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

	// console.log('#### will add '+pluginConfigInfo.pluginName+' to envs ', env, ' with entry ', confEntry);//DEBUG

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
	addPluginInfos: function(pluginId, workersList, appConfig, pluginConfig, runtimeConfig, settings){

		var pluginInfo = require(pluginId + '/module-ids.gen.js');

		var paths = pluginInfo.getAll('paths', true);

		addResolveAliasPaths(appConfig.paths, paths)

		var workers = pluginInfo.getAll('workers');

		workers.forEach(function(w){
			workersList.push(paths[w]);
		});

		var includeModules = pluginInfo.getAll('modules');

		includeModules.forEach(function(mod){
			appConfigUtils.addIncludeModule(appConfig, mod, paths[mod]);
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
			console.log('ERROR invalid module-config.js for plugin '+pluginId+': missing field pluginName ', pluginConfigInfo);
		}

		console.log('plugin-utils: addPluginInfos() -> paths ', paths, ', workers ', workers, ', include modules ', includeModules, runtimeConfig);//DEBUG
	}
};
