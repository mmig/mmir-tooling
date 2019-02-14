
var path = require('path');
var appConfigUtils = require('./webpack-app-module-config-utils.js');

function addResolveAliasPaths(alias, paths){
	for(var p in paths){
		paths[p] = path.resolve(paths[p]);
		alias[p] = paths[p];
	}
	return paths;
}

module.exports = {
	addPluginInfos: function(pluginId, alias, workersList, appConfig){
		
		var pluginInfo = require(pluginId + '/module-ids.js');
		
		var paths = pluginInfo.getAll('paths', true);
		
		addResolveAliasPaths(alias, paths)
		
		var workers = pluginInfo.getAll('workers');
		
		workers.forEach(function(w){
			workersList.push(paths[w]);
		});
		
		var includeModules = pluginInfo.getAll('modules');
		
		includeModules.forEach(function(mod){
			appConfigUtils.addIncludeModule(appConfig, mod, paths[mod]);
		});
		
		console.log('plugin-utils: addPluginInfos() -> paths ', paths, ', workers ', workers, ', include modules ', includeModules);//DEBUG
	}
};
