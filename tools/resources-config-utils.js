
var fs = require('fs');
var path = require('path');
var fileUtils = require('../utils/filepath-utils.js');

function parseRootDir(dir, parseOptions, options){

	options = options || {};
	var files = fs.readdirSync(dir);
	// console.log('parse root dir "'+dir+'" -> ', files);

	files.forEach(function(p){

		var absPath = path.join(dir, p);
		if(fileUtils.isDirectory(absPath)){

			var dirName = path.basename(absPath).toLowerCase();
			if(options[dirName] === false || (parseOptions.exclude && parseOptions.exclude.find(function(item){ return item === dirName;}))){
				console.log('parsing resources: excluding resources for ', dirName, parseOptions.exclude);
				return;////////// EARLY EXIT ////////////////
			}

			switch(dirName){
				case 'config':
					parseConfigDir(absPath, parseOptions, options);
					break;
				case 'controllers':
				case 'helpers':
				case 'models':
					options[dirName] = {path: fileUtils.normalizePath(absPath), addModuleExport: parseOptions.addModuleExport};
					break;
				case 'views':
					options[dirName] = {path: fileUtils.normalizePath(absPath)};
					break;
				default:
					return;////////// EARLY EXIT ////////////////
			}
		}
	});

	return options;
}

function parseConfigDir(dir, parseOptions, options){

	options = options || {};
	var files = fs.readdirSync(dir);
	// console.log('parse config dir "'+dir+'" -> ', files);

	if(!parseOptions.exclude || !parseOptions.exclude.find(function(item){ return item === 'settings';})){

		options.settings = {path: fileUtils.normalizePath(dir)};

		if(parseOptions.exclude){
			//check if settings/<sub-type> needs to be excluded:
			parseOptions.exclude.filter(function(item){ return /^settings\//.test(item);}).forEach(function(entry){
				var subType = entry.substring('settings/'.length);

				console.log('parsing resources: excluding settings/'+subType+' resources for ', dir, parseOptions.exclude);//DEBUG

				options.settings[subType] = false;
			});
		}
	}
	else console.log('parsing resources: excluding all settings resources for ', dir, parseOptions.exclude);//DEBUG

	files.forEach(function(p){
		var absPath = path.join(dir, p);
		if(fileUtils.isDirectory(absPath)){
			var dirName = path.basename(absPath).toLowerCase();

			switch(dirName){
				case 'languages':
					if(options.grammars !== false && (!parseOptions.exclude || !parseOptions.exclude.find(function(item){ return item === 'grammar';}))){
						options.grammars = {path: fileUtils.normalizePath(absPath)};
					}
					else console.log('parsing resources: excluding grammar resources for ', dirName, parseOptions.exclude);//DEBUG
					break;
					// BACKWARDS COMPATIBILITY: check old/deprecated dir-name "statedef"
				case 'statedef':		/* intentional fall-through */
				case 'states':
					if(options.states !== false && (!parseOptions.exclude || !parseOptions.exclude.find(function(item){ return item === 'state';}))){
						options.states = {path: fileUtils.normalizePath(absPath)};
					}
					else console.log('parsing resources: excluding scxml resources for ', dirName, parseOptions.exclude);//DEBUG
					break;
				default:
					return;////// EARLY EXIT //////////////
			}
		}
	});

	return options;
}

module.exports = {
	/**
	 * [resourcePathsFrom description]
	 * @param  {String} directory the directory that contains the default MMIR direcotry structure containing (possibly) config, languages, controllers, helpers etc.
	 * @param  {ResourceParseOptions} parseOptions options for parsing the directories:
	 * 													parseOptions.addModuleExport: {Boolean} use the addModuleExport option for controllers, helpers, and models
	 * 													parseOptions.exclude: {Array<String>} exlude some resource types, like "controllers", or "models"
	 * 																								for excluding sub-types for settings, e.g. dictionaries, use "settings/dictionary",
	 * 																								or "settings/grammar" for excluding the sources of JSON grammars (i.e. exclude the sources for compiled grammars)
	 * @return {AppConfig} the AppConfig with the 'path' option set for the corresponding resource type, so that the corresponding utils/loaders will the the resources from that path
	 */
	resourcePathsFrom(directory, parseOptions){

		parseOptions = parseOptions || {};
		var configOptions = {};

		parseRootDir(directory, parseOptions, configOptions);

		return configOptions;
	},
	/**
	 * HELPER for merging the results of resourcePathsFrom() with the user-supplied AppConfig,
	 *        without overwritting user-set options
	 * @param  {AppConfig} userConfig the user-supplied AppConfig, into which  the generatedConfig will be merged)
	 * @param  {AppConfig} generatedConfig the generated AppConfig containing the path-field for discovered resources
	 * @return {AppConfig} the merge AppConfig (same as userConfig)
	 */
	mergeResourceConfigs(userConfig, generatedConfig){

		var entry;
		for(var n in generatedConfig){
			entry = generatedConfig[n];
			if(!userConfig[n] && userConfig[n] !== false){

				userConfig[n] = entry;

			} else if(userConfig[n] && !userConfig[n].path && userConfig[n].path !== false){

				userConfig[n].path = entry.path;
			}
		}

		return userConfig;
	}
}
