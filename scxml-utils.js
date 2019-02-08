var path = require('path');
var fs = require('fs');
var _ = require ('lodash');
var fileUtils = require('./webpack-filepath-utils.js');

var appConfigUtils = require('./webpack-app-module-config-utils.js');
var directoriesUtil = require('./mmir-directories-util.js');
var configurationUtil = require('./settings-utils.js');

var DEFAULT_MODE = 'extended';

function readDir(dir, list, options){

	var files = fs.readdirSync(dir);
	var dirs = [];
	// console.log('read dir "'+dir+'" -> ', files);//DEBU

	files.forEach(function(p){
		var absPath = path.join(dir, p);
		if(fileUtils.isDirectory(absPath)){
			dirs.push(absPath);
			return false;
		} else if(/(dialog|input)DescriptionSCXML\.xml$/i.test(p)){

			var normalized = fileUtils.normalizePath(absPath);
			var m = /(dialog|input)DescriptionSCXML\.xml$/i.exec(normalized);
			var id = m[1];

			var opt = options && options[id];
			if(opt && (opt.exclude || opt.file)){
				//-> ignore/exclude this scxml!
				console.log('scxml-utils.addFromDirectory(): excluding scxml file for '+id+' model at "'+normalized+'"!');//DEBUG
				return;//////////////////// EARLY EXIT //////////////////
			}

			list.push({
				id: id,
				file: normalized,
				mode: opt && opt.mode? opt.mode : DEFAULT_MODE
			});
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

function addFromOptions(scxmlModels, list, appRootDir){

	var s, entry;
	for(var id in scxmlModels){

		s = scxmlModels[id];
		if(s && s.file && !s.exclude){

			entry = _.cloneDeep(s);
			if(!path.isAbsolute(entry.file)){
				entry.file = path.resolve(appRootDir, entry.file);
			}
			entry.file = fileUtils.normalizePath(entry.file);

			if(entry.id && entry.id !== id){
				console.error('scxml-utils.addFromOptions(): entry from modelOptions for ID "'+id+'" has differing field id with value "'+entry.id+'", overwritting the id field with "'+id+'"!');//FIXME proper webpack error/warning
			}
			entry.id = id;

			//TODO verify existence of entry.file?

			if(!contains(list, id)){
				// console.log('scxml-utils.addFromOptions(): adding ', entry);//DEBU
				list.push(entry)
			} else {
				console.error('scxml-utils.addFromOptions(): entry from modelOptions for ID '+id+' already exists in grammar-list, ignoring entry!');//FIXME proper webpack error/warning
			}
		}
		// else {//DEBU
		// 	console.log('scxml-utils.addFromOptions(): entry for '+id+' has no file set -> ignore ', s);//DEBU
		// }
	}
}

function contains(list, id){
	return list.findIndex(function(item){
		return item.id === id;
	}) !== -1;
}

function toAliasPath(scxml){
	return path.normalize(scxml.file);
}

function toAliasId(scxml){
	return 'mmirf/scxml/'+scxml.id;//FIXME formalize IDs for loading views in webpack (?)
}

module.exports = {

	/**
	 * [description]
	 * @param  {ScxmlOptions} options the SCXML model options where
	 * 										options.path: REQUIRED the directory from which to add the scxmlModels, and has the following structure:
	 * 																				<directory>/../dialogDescriptionSCXML.xml
	 * 																				<directory>/../inputDescriptionSCXML.xml
	 * 																				...
	 * 										options.models: OPTIONAL a map of SCXML model IDs, i.e. {[scxmlID: string]: ScxmlOption} with specific options for compiling the corresponding SCXML model:
	 *														options.models[id].exclude {Boolean}: OPTIONAL if <code>true</code>, the corresponding SCXML model will be completely excluded, i.e. no executable grammar will be compiled
	 *																																				from the corresponding JSON grammar
	 *														options.models[id].mode {"extended" | "simple"}: OPTIONAL run SCXML modle in "simple" or "extended" mode,
	 *																																				DEFAULT: "extended"
	 * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
	 * @param {Array<ScxmlEntry>} [scxmlModels] OPTIONAL list of ScxmlEntry objects, to which the new entries (read from the options.directory) will be added
	 * 																					if omitted, a new list will be created and returned.
	 * 										ScxmlEntry.id {String}: the grammar id (usually the language code, e.g. "en" or "de")
	 * 										ScxmlEntry.file {String}: the path to the JSON grammar (from which the executable grammar will be created)
	 * 										ScxmlEntry.mode {"extended" | "simple"}: run SCXML modle in "simple" or "extended" mode, DEFAULT: "extended"
	 * @return {Array<ScxmlEntry>} the list of ScxmlEntry objects
	 */
	scxmlFromDir: function(options, appRootDir, scxmlModels){

		var dir = options.path;
		if(!path.isAbsolute(dir)){
			dir = path.resolve(appRootDir, dir);
		}

		var list = scxmlModels || [];
		readDir(dir, list, options.models);

		return list;
	},

	scxmlFromOptions: function(options, appRootDir, scxmlModels){

		var models = options.models;

		var list = scxmlModels || [];
		addFromOptions(models, list, appRootDir);

		return list;
	},

	/**
	 * add SCXML models to (webpack) app build configuration
	 *
	 * @param  {Array<ScxmlEntry>} scxmlModels list of ScxmlEntry objects:
	 * 										scxml.id {String}: the SCXML id ("dialog" | "input")
	 * 										scxml.file {String}: the path to the SCXML file (from which the executable SCXML model will be created)
	 * @param  {[type]} appConfig the app configuration to which the SCXML models will be added
	 * @param  {[type]} directories the directories.json representation
	 * @param  {[type]} runtimeConfiguration the configuration.json representation
	 */
	addScxmlToAppConfig: function(scxmlModels, appConfig, directories, runtimeConfiguration){

		if(!scxmlModels || scxmlModels.length < 1){
			return;
		}

		if(!appConfig.paths){
			appConfig.paths = {};
		}
		appConfig.paths['mmirf/scion'] = require.resolve('./webpack-scion.js');

		// console.log('scxml-utils.addScxmlToAppConfig(): set mmirf/scion module implementation to ', appConfig.paths['mmirf/scion']);//DEBU

		if(!appConfig.config){
			appConfig.config = {};
		}

		scxmlModels.forEach(function(s){

			var aliasId = toAliasId(s);
			appConfigUtils.addIncludeModule(appConfig, aliasId, toAliasPath(s));
			directoriesUtil.addScxml(directories, aliasId);

			var configId = s.id === 'input'? 'mmirf/inputManager' : 'mmirf/dialogManager';
			if(!appConfig.config[configId]){
				appConfig.config[configId] = {};
			}
			if(appConfig.config[configId].scxmlDoc){
				if(appConfig.config[configId].scxmlDoc !== aliasId){
					console.log('scxml-utils: SCXML model for "'+s.id+'" is already set to "'+appConfig.config[configId].scxmlDoc+'", omitting configuration to load from module ID "'+aliasId+'"');
				}
				// else {//DEBU
				// 	console.log(' scxml-utils: SCXML model for "'+s.id+'" is already set to "'+aliasId+'", do nothing ...');//DEBU
				// }
			} else {
				// console.log(' scxml-utils: setting SCXML model for "'+s.id+'" to "'+aliasId+'", do nothing ...');//DEBU

				appConfig.config[configId].scxmlDoc = aliasId;
			}

			if(!appConfig.config[configId].mode){
				// console.log(' scxml-utils: setting mode for SCXML model "'+s.id+'" to default mode: ', JSON.stringify(s.mode || DEFAULT_MODE));//DEBU

				appConfig.config[configId].mode = s.mode || DEFAULT_MODE;
			} else if(s.mode) {
				console.log('scxml-utils: SCXML model mode for "'+s.id+'" is already set to "'+appConfig.config[configId].mode+'", omitting mode-setting ', JSON.stringify(s.mode));
			}

		});
	}
};
