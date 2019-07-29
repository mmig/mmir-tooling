
const fs = require('fs-extra');
const path = require('path');

// var _ = require('lodash');

var Promise = require('../utils/promise.js');

var logUtils = require('../utils/log-utils.js');
var log = logUtils.log;
var warn = logUtils.warn;

var writeDirectoriesJson = function(directories, targetDir){

	return fs.ensureDir(targetDir).then(function(){
		return fs.writeFile(path.join(targetDir, 'directories.json'), JSON.stringify(directories), 'utf8').catch(function(err){
			var msg = 'ERROR writing directories.json to '+targetDir+': ';
			warn(msg, err);
			return err.stack? err : new Error(msg+err);
		});
	});
}

var getDictionaryTargetPath = function(dictionary, targetDir){
	return path.join(targetDir, 'languages', dictionary.id, 'dictionary.json');
}

/**
 * HELPER write missing (empty) dictionary.json files to config/languages/<id>
 *        to avoid errors when switching languages.
 *
 * @param  {Array<SettingsEntry>} settings the list of settings
 * @param  {SettingsOptions} settingsOptions the settings options
 */
var writeDictionaries = function(settings, settingsOptions){

	var dictionaries = settings.filter(function(item){ return item.type === 'dictionary'});

	// log('processing dictionaries: ', dictionaries);

	var tasks = [];

	dictionaries.forEach(function(dict){

		var targetPath = getDictionaryTargetPath(dict, settingsOptions.targetDir);
		var t = fs.pathExists(targetPath).then(function(exists){

			if(!exists){

				return fs.ensureDir(path.dirname(targetPath)).then(function(){
					if(dict.include === 'file'){

						return fs.copyFile(dict.file, targetPath).catch(function(err){
							var msg = 'ERROR copying file to '+targetPath+': ';
							warn(msg, err);
							return err.stack? err : new Error(msg+err);
						});

					} else {

						return fs.writeFile(targetPath, JSON.stringify(dict.value), 'utf8').catch(function(err){
							var msg = 'ERROR writing '+targetPath+': ';
							warn(msg, err);
							return err.stack? err : new Error(msg+err);
						});
					}
				});

			} else {
				log('omit writing dictionary to '+targetPath+', since it already exists');//: ', dict);
			}
		});

		tasks.push(t);
	});

	return Promise.all(tasks);
}

module.exports = {
	writeDirectoriesJson: writeDirectoriesJson,
	writeDictionaries: writeDictionaries
}
