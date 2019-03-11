var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var fileUtils = require('../webpack-filepath-utils.js');

var appConfigUtils = require('../utils/webpack-module-init-gen.js');

var directoriesUtil = require('./directories-utils.js');

var ALL_SPEECH_CONFIGS_TYPE = 'speech-all';

/**
 * scan for
 *
 *  * configuration.json
 *  * <id>/dictionary.json
 *  * <id>/grammar.json
 *  * <id>/speech.json
 *
 * @param  {[type]} dir [description]
 * @param  {[type]} list [description]
 * @param  {[type]} options [description]
 * @return {[type]} [description]
 */
function readDir(dir, list, options){

	var files = fs.readdirSync(dir);
	var dirs = [];
	// console.log('read dir "'+dir+'" -> ', files);

	files.forEach(function(p){

		var absPath = path.join(dir, p);
		if(fileUtils.isDirectory(absPath)){

			dirs.push(absPath);
			return false;

		} else if(/(configuration|dictionary|grammar|speech)\.json$/i.test(absPath)){

			var id, type;
			if(isSettingsType('configuration', absPath)){
				type = 'configuration';
			} else {
				type = getTypeFrom(absPath);
				id = getIdFor(absPath);
			}

			var isAdd = true;
			var isInline = true;

			if(options){

				isInline = !/file/i.test(options.include);

				if(options[type] === false){
					isAdd = false;
				} else if(options[type] && (!id || options[type][id])){
					var conf = id? options[type][id] : options[type];
					isAdd = !conf.exclude;
					isInline = !/file/i.test(conf.include);
				}
			}

			//FIXME currently cannot include grammar.json as file because of json-grammar-loader TODO include same resouce multiple times with different formats(?) multi-loader?
			if(isAdd && !isInline && type === 'grammar'){
				console.log('WARN: settings-util: cannot include JSON grammars as file, inlining grammar source for "'+id+'" instead ...');
				isInline = true;
			}

			if(isAdd){
				if(type !== 'configuration' && contains(list, type, id)){

					console.log('ERROR settings-utils: encountered multiple entries for '+type+' setting for ID '+id+', ignoring '+absPath);

				} else {
					var normalized = fileUtils.normalizePath(absPath);
					list.push({
						type: type,
						id: id,
						file: normalized,
						value: isInline? readJson(normalized) : void(0),
						include: isInline? 'inline' : 'file'
					});
				}
			}
		}

	});

	// console.log('read sub-dirs -> ', dirs);
	var size = dirs.length;
	if(size > 0){
		for(var i = 0; i < size; ++i){
			readDir(dirs[i], list, options);
		}
	}
}

// function addFromOptions(settings, list, appRootDir){
// 	//TODO
// }

function isSettingsType(type, filePath){
	return new RegExp('^' +  type  + '\.json$', 'i').test(path.basename(filePath));
}

function getTypeFrom(settingsFilePath){
	return path.basename(settingsFilePath).replace(/\.json$/, '');
}

function getIdFor(settingsFilePath){
	return path.basename(path.dirname(settingsFilePath));
}

//TODO wrap try/catch -> print webpack-error
function readJson(filePath){
	// console.log('reading ', filePath);//DEBU
	var buffer = fs.readFileSync(filePath);
	var enc = detectByteOrder(buffer);
	var content = buffer.toString(enc);
	// var content = toUtfString(buffer, enc);// buffer.toString(enc);
	content = removeBom(content, enc);
	// console.log('encoding '+enc+' -> ', JSON.stringify(content));//DEBU
	return JSON.parse(content);
}

function detectByteOrder(buffer){
	//from https://docs.microsoft.com/en-us/windows/desktop/Intl/using-byte-order-marks:
	//
	// Byte order mark 		Description
	// EF BB BF 					UTF-8
	// FF FE 							UTF-16, little endian
	// FE FF 							UTF-16, big endian
	// FF FE 00 00 				UTF-32, little endian
	// 00 00 FE FF 				UTF-32, big-endian
	if(buffer[0] === 239 /*EF*/ && buffer[1] === 187 /*BB*/ && buffer[2] === 191 /*BF*/){
		return 'utf8';
	// } else if(buffer[0] === 255 /*FF*/ && buffer[1] === 254 /*FE*/ && buffer[2] === 0 /*00*/ && buffer[3] === 0 /*00*/){
	// 	return 'utf32le';
	// } else if(buffer[0] === 0 /*00*/ && buffer[1] === 0 /*00*/ && buffer[2] === 254 /*FE*/ && buffer[3] === 255 /*FF*/){
	// 	return 'utf32be';
	} else if(buffer[0] === 255 /*FF*/ && buffer[1] === 254 /*FE*/){
		return 'utf16le';
	} else if(buffer[0] === 254 /*FE*/ && buffer[1] === 255 /*FF*/){
		return 'utf16be';
	}
	//try utf8 anyway...
	return 'utf8'
}

// function toUtfString(buffer, enc){
// 	var penc = enc.replace('utf', 'utf-');
// 	// var Iconv = require('iconv').Iconv;
// 	// var iconv = new Iconv(penc, 'UTF-8');
// 	// return iconv.convert(buffer).toString();
// 	var iconv = require('iconv-lite');
// 	return iconv.decode(buffer, enc);
// }

function removeBom(content){
	// console.log('remove BOM? -> ', content.codePointAt(0), content.codePointAt(1), content.codePointAt(2), content.codePointAt(3), content.codePointAt(4));//DEBU
	if(content.codePointAt(0) === 65279 /*FEFF*/ || content.codePointAt(0) === 65534 /*FFFE*/){
		content = content.substring(1);
		// console.log('removed BOM!');//DEBU
	}
	return content;
}

/**
 * HELPER load all files for settings-entry
 * @param  {SettingsEntry} s NOTE s.file MUST be an Array!
 */
function doLoadAllFilesFor(s){
	console.log('WARN settings-utils: encountered multiple file resources for "'+s.id+'" ('+s.type+'): cannot be included as (single) file, inlining  resources instead...');
	s.include = 'inline';
	if(!s.value){
		console.log('WARN settings-utils: forced inlining for "'+s.id+'" ('+s.type+') with multiple file resources: content not loaded yet, loading file content and merging now...');
		var content = {};
		s.file.forEach(function(f){
			_.merge(content, readJson(f));
		});
		s.value = content;
	}
}

function contains(list, settingsType, settingsId){
	return list.findIndex(function(item){
		return item.id === settingsId && item.type === settingsType;
	}) !== -1;
}

function containsEntry(list, value){
	return list.findIndex(function(item){
		return item === value;
	}) !== -1;
}

function normalizeConfigurations(settingsList){
	var c, conf;
	for(var i = 0, size = settingsList.length; i < size; ++i){
		c = settingsList[i];
		if(c.type === 'configuration'){
			if(conf){

				// console.log("INFO settings-utils: encountered multiple configuration.json definition: merging configuration, some values may get overwritten");//DEBU

				//if "include" was set to "file", the file contents have not been loaded yet
				if(!conf.value){
					conf.value = readJson(conf.file);
				}
				if(!c.value){
					c.value = readJson(c.file);
				}

				//merge configuration values:
				_.merge(conf.value, c.value);

				//"merge" file-fields:
				if(!conf.file){
					conf.file = [];
				} else if(!_.isArray(conf.file)){
					conf.file = [conf.file];
				}
				if(c.file){
					conf.file.push(c.file)
				}
				//remove merged configuration from list & adjust i & size
				settingsList.splice(i--, 1);
				--size;
			} else {
				conf = c;
			}
		}
	}
}

/**
 * HELPER create a non-file settings entry (i.e. not loaded from a file)
 *
 * @param  {SettingsType} type the type of settings object, e.g. "speech" or "configuration"
 * @param  {Object} value the actual settings-data (JSON-like object)
 * @param  {String} [id] if more than 1 settings-entry for this type can exist, its ID
 * @return {SettingsEntry} the settings-entry
 */
function createSettingsEntryFor(type, value, id){
	return {type: type, file: 'settings://'+type+'/options' + (id? '/'+id : ''), include: 'inline', value: value, id: id};
}

function getConfiguration(settingsList){
	return settingsList.find(function(item){ return item.type === 'configuration'});
}

function getSettings(settingsList, type){
	return settingsList.filter(function(item){ return item.type === type});
}

function toAliasId(settings){
	return 'mmirf/settings/' + settings.type + (settings.id? '/' + settings.id : '');//FIXME formalize IDs for loading views in webpack (?)
}

module.exports = {

	setGrammarIgnored: function(runtimeConfiguration, grammarId){

		var exists = false;
		if(!runtimeConfiguration.ignoreGrammarFiles){
			runtimeConfiguration.ignoreGrammarFiles = [];
		} else {
			exists = containsEntry(runtimeConfiguration.ignoreGrammarFiles, grammarId);
		}

		if(!exists){
			runtimeConfiguration.ignoreGrammarFiles.push(grammarId);
		}
	},
	/**
	 * parse for JSON settings files
	 *
	 * @param  {SetttingsOptions} options the settings-options with field options.path:
	 *                                  options.path: {String} the directory to parse for JSON settings
	 *                                  options.configuration: {Boolean | SettingsEntryOptions} options for the configuration.json entry
	 *                                  options.dictionary: {Boolean | {[id: String]: SettingsEntryOptions}} options-map for the dictionary.json entries where id is (usually) the language code
	 *                                  options.grammar: {Boolean | {[id: String]: SettingsEntryOptions}} options-map for the grammar.json entries where id is (usually) the language code
	 *                                  options.speech: {Boolean | {[id: String]: SettingsEntryOptions}} options-map for the speech.json entries where id is (usually) the language code
	 *                                   where:
	 *                                     if Boolean: if FALSE, the corresponding JSON settings are excluded/ignored
	 *                                     if SettingsEntryOptions:
	 *                                     			SettingsEntryOptions.exclude: {Boolean} if TRUE the JSON setting for the corresponding ID will be excluded/ignored
	 * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
	 * @param  {Array<SettingsEntry>} [settingsList] OPTIONAL
	 * @return {Array<SettingsEntry>} list of setting entries:
	 * 																		{
	 * 																			type: 'configuration' | 'dictionary' | 'grammar' | 'speech',
	 * 																			file: String,
	 * 																			id: String | undefined
	 * 																		}
	 */
	jsonSettingsFromDir: function(options, appRootDir, settingsList){

		var dir = options && options.path;
		if(dir && !path.isAbsolute(dir)){
			dir = path.resolve(appRootDir, dir);
		}

		var list = settingsList || [];
		if(dir){
			readDir(dir, list, options);
		}

		return list;
	},
	// jsonSettingsFromOptions: function(options, appRootDir, settingsList){
	//
	// 	var list = settingsList || [];
	// 	addFromOptions(options, list, appRootDir);
	//
	// 	return list;
	// },
	createSettingsEntryFor: createSettingsEntryFor,
	normalizeConfigurations: normalizeConfigurations,
	getConfiguration: getConfiguration,
	getSettingsFor: getSettings,
	/** load settings file
	 * NOTE: if updating s.value with the loaded data, need to update s.include and s.file accordingly!
	 */
	loadSettingsFrom: readJson,
	getAllSpeechConfigsType: function(){ return ALL_SPEECH_CONFIGS_TYPE; },
	addSettingsToAppConfig: function(settings, appConfig, directories, runtimeConfig, regExpExcludeType, ignoreMissingDictionaries){

		if(!settings || settings.length < 1){
			return;
		}

		//get speech-config settings that should be applied to speech-configs
		var iall = settings.findIndex(function(s){
			return s.type === ALL_SPEECH_CONFIGS_TYPE;
		});
		var allSpeechSettings;
		if(iall !== -1){
			allSpeechSettings = settings[iall];
			//remove from settings list (will be merged into each speech-config, see below)
			settings.splice(iall, 1);
		}

		var dicts = ignoreMissingDictionaries? null : new Map();

		settings.forEach(function(s){

			if(regExpExcludeType && regExpExcludeType.test(s.type)){
				return;
			}

			var aliasId = toAliasId(s);

			if(s.include === 'file' && _.isArray(s.file)){
				doLoadAllFilesFor(s);
			}

			console.log('  adding setting ('+s.include+') for '+s.type+' as ', aliasId);//DEBUG

			if(s.type === 'configuration'){

				if(!_.isEqual(s.value, runtimeConfig)){
					console.log("WARN settings-utils: encountered multiple configuration.json definitions when applying to app-config: merging configuration, some values may get overwritten...");
					_.merge(s.value, runtimeConfig);
				}
				//NOTE configuration.json entry is mandatory, i.e. already set in directories
				// directoriesUtil.addConfiguration(directories, aliasId);

			} else if(s.type === 'dictionary'){
				dicts && dicts.set(s.id, s);
				directoriesUtil.addDictionary(directories, aliasId)
			} else if(s.type === 'grammar'){
				directoriesUtil.addJsonGrammar(directories, aliasId)
			} else if(s.type === 'speech'){
				if(allSpeechSettings){
					if(s.include === 'file'){
						console.log("WARN settings-utils: applying 'speech-all' settings: cannot include file for "+s.id+", inlining instead.");
						if(!s.value){
							s.value = readJson(s.file);
						}
						s.include = 'inline';
					}
					_.merge(s.value, allSpeechSettings.value);
				}
				directoriesUtil.addSpeechConfig(directories, aliasId)
			} else if(s.type !== ALL_SPEECH_CONFIGS_TYPE) {
				console.log("WARN settings-utils: encountered multiple unknown settings definitions when applying to app-config: ", s);
			}

			if(s.include === 'file'){
				appConfigUtils.addIncludeModule(appConfig, aliasId, s.file);
			} else {
				appConfigUtils.addAppSettings(appConfig, aliasId, s.value);
			}

			//FIXME TEST include via webpack JSON loader:
			// var file = _.isArray(s.file)? s.file.find(function(f){
			// 	return fs.existsSync(f)
			// }) : s.file;
			// console.log('settings-util: adding include module '+aliasId, file)
			// appConfigUtils.addIncludeModule(appConfig, aliasId, file);
			// appConfig.includeModules.push(file)
			// if(!appConfig.loadAfterInit) appConfig.loadAfterInit = [];
			// appConfig.loadAfterInit.push(file)
		});


		//ensure that for each language there is a (possibly empty) dictionary
		if(!ignoreMissingDictionaries && (!regExpExcludeType || !regExpExcludeType.test('dictionary'))){
			var languages = directoriesUtil.getLanguages(directories);
			var missing = [];
			languages.forEach(function(l){
				var dict = dicts.get(l);
				if(!dict){
					missing.push(createSettingsEntryFor('dictionary', {}, l));
				}
			});
			if(missing.length > 0){
				// console.log("INFO settings-utils: adding missing dictionaries for : ", missing);
				this.addSettingsToAppConfig(missing, appConfig, directories, runtimeConfig, regExpExcludeType, true);
			}
		}

	}
};
