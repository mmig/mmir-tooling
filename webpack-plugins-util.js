
var path = require('path');
var _ = require('lodash');
var appConfigUtils = require('./webpack-app-module-config-utils.js');

var asrCoreId = 'mmir-plugin-encoder-core.js';
var ttsCoreId = 'webAudioTextToSpeech.js';

/**
 * mapping from file-name to load-module-ID in MediaManager/plugin-loading mechanism
 * (to be used in configuration.json)
 */
var moduleIdMap = {
	'webaudioinput.js': 'mmir-plugin-encoder-core.js'
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

function getConfigEnv(pluginConfig, runtimeConfig){

	var env = pluginConfig && pluginConfig.env;
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

function createConfigEntry(pluginConfig, pluginConfigInfo, pluginId){
	var isAsr = isAsrPlugin(pluginId);
	var mod = isAsr? asrCoreId : ttsCoreId;
	var config = normalizeImplName(pluginId);
	var ctx = (pluginConfig && pluginConfig.ctx) || void(0);

	//{ "mod": "mmir-plugin-encoder-core.js", "config": "mmir-plugin-asr-nuance-xhr.js"}
	return {mod: mod, config: config, ctx: ctx};
}

function applyPluginConfig(pluginConfig, runtimeConfig, pluginConfigInfo){

	var config = runtimeConfig[pluginConfigInfo.pluginName] || {};
	for(var c in pluginConfig){
		if(c === 'env' || c === 'ctx'){
			continue;
		}
		config[c] = pluginConfig[c];
	}
	runtimeConfig[pluginConfigInfo.pluginName] = config;
}

function addConfig(pluginConfig, runtimeConfig, pluginConfigInfo, pluginId){

	if(pluginConfig){
		applyPluginConfig(pluginConfig, runtimeConfig, pluginConfigInfo);
	}

	var confEntry = createConfigEntry(pluginConfig, pluginConfigInfo, pluginId);

	var env = getConfigEnv(pluginConfig, runtimeConfig);
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
	addPluginInfos: function(pluginId, workersList, appConfig, pluginConfig, runtimeConfig){

		var pluginInfo = require(pluginId + '/module-ids.js');

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

		var pluginConfigInfo = require(pluginId + '/module-config.js');

		if(pluginConfigInfo.pluginName){
			addConfig(pluginConfig, runtimeConfig, pluginConfigInfo, pluginId);
		} else {
			console.log('ERROR invalid module-config.js for plugin '+pluginId+': missing field pluginName ', pluginConfigInfo);
		}

		console.log('plugin-utils: addPluginInfos() -> paths ', paths, ', workers ', workers, ', include modules ', includeModules, runtimeConfig);//DEBUG
	}
};
