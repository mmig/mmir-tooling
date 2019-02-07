var path = require('path');
var fs = require('fs');
var _ = require ('lodash');
var fileUtils = require('./webpack-filepath-utils.js');

var appConfigUtils = require('./webpack-app-module-config-utils.js');
var directoriesUtil = require('./mmir-directories-util.js');
var configurationUtil = require('./settings-utils.js');

function readDir(mode, dir, list, options){//mode: 'controller' | 'helper' | 'model'

	var files = fs.readdirSync(dir);
	var dirs = [];
	// console.log('read dir "'+dir+'" -> ', files);

	files.forEach(function(p){

		var absPath = path.join(dir, p);
		if(fileUtils.isDirectory(absPath)){

			dirs.push(absPath);
			return false;

		} else {

			var normalized = fileUtils.normalizePath(absPath);
			var id = path.basename(absPath, '.js');
			switch(mode){
				case 'helper':
					if(!/Helper$/.test(id)){
						console.log('impl-utils.addFromDirectory(): invalid file-name for helper '+id+' (must have suffix "Helper"): "'+normalized+'"!');
						id += 'Helper';
					}
					break;
				case 'controller':	// intentional fall through
				case 'model':				// intentional fall through
				default:
					break;
			}

			console.log('impl-utils.addFromDirectory(): parsing '+mode+' implemenation '+id+' at "'+normalized+'"');//DEBUG

			var opt = options && options[id];
			if(opt && (opt.exclude || opt.file)){
				//-> ignore/exclude this impl. file!
				console.log('impl-utils.addFromDirectory(): excluding '+mode+' implemenation '+id+' at "'+normalized+'"!');
				return;//////////////////// EARLY EXIT //////////////////
			}

			list.push({
				id: id,
				name: toImplName(id),
				type: mode,
				file: normalized
			});
		}
	});
	// console.log('results for dir "'+dir+'" -> ', ids, grammars);

	// console.log('read sub-dirs -> ', dirs);
	var size = dirs.length;
	if(size > 0){
		for(var i = 0; i < size; ++i){
			readDir(mode, dirs[i], list, options);
		}
	}
}

// function addFromOptions(grammars, list, appRootDir){
//
// 	var g, entry;
// 	for(var id in grammars){
//
// 		g = grammars[id];
// 		if(g && g.file && !g.exclude){
//
// 			entry = _.cloneDeep(g);
// 			if(!path.isAbsolute(entry.file)){
// 				entry.file = path.resolve(appRootDir, entry.file);
// 			}
// 			entry.file = fileUtils.normalizePath(entry.file);
//
// 			if(entry.id && entry.id !== id){
// 				console.error('impl-utils.addFromOptions(): entry from grammarOptions for ID "'+id+'" has differing field id with value "'+entry.id+'", overwritting the id field with "'+id+'"!');//FIXME proper webpack error/warning
// 			}
// 			entry.id = id;
//
// 			//TODO verify existence of entry.file?
//
// 			if(!contains(list, id)){
// 				// console.log('impl-utils.addFromOptions(): adding ', entry);//DEBU
// 				list.push(entry)
// 			} else {
// 				console.error('impl-utils.addFromOptions(): entry from grammarOptions for ID '+id+' already exists in grammar-list, ignoring entry!');//FIXME proper webpack error/warning
// 			}
// 		}
// 		// else {//DEBU
// 		// 	console.log('impl-utils.addFromOptions(): entry for '+id+' has no file set -> ignore ', g);//DEBU
// 		// }
// 	}
// }

function contains(implList, id){
	return implList.findIndex(function(item){
		return item.id === id;
	}) !== -1;
}

function toImplName(id){
	return id[0].toUpperCase() + id.substring(1);
}

function toAliasPath(impl){
	return path.normalize(impl.file).replace(/\.js$/i, '');
}

function toAliasId(impl){
	return 'mmirf/'+impl.type+'/'+impl.id;//FIXME formalize IDs for loading views in webpack (?)
}

module.exports = {

	/**
	 * [description]
	 * @param  {"controller" | "helper" | "model"} mode the kind of implementation (modules) that the directory contains
	 * @param  {GrammarOptions} options the grammar options where
	 * 										options.directory: REQUIRED the directory from which to add the implementations, and has the following structure:
	 * 																				<directory>/<module-id-1>.js
	 * 																				<directory>/<module-id-2>.js
	 * 																				...
	 * 										options.grammars: OPTIONAL a map of grammar IDs, i.e. {[grammarID: string]: GrammarOption} with specific options for compiling the corresponding JSON grammar:
	 *														options.grammars[id].engine {"jscc" | "jison" | "pegjs"}: OPTIONAL the Grammar engine that will be used to compile the executable grammar.
	 *																																									DEFAULT: "jscc"
	 *														options.grammars[id].async {Boolean}: OPTIONAL if <code>true</code>, and the execution environment supports Workers, then the grammar will be loaded
	 *																																			in a Worker on app start-up, i.e. execution will be asynchronously in a worker-thread
	 *																																			TODO impl. mechanism
	 *														options.grammars[id].exclude {Boolean}: OPTIONAL if <code>true</code>, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
	 *																																				from the corresponding JSON grammar
	 *														options.grammars[id].ignore {Boolean}: OPTIONAL if <code>true</code>, the grammar will not be loaded
	 *														                                   (and registered) when the the app is initialized, i.e. needs to be
	 *														                                   "manually" loaded/initialized by app implementation and/or other mechanisms.
	 *														                                   If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
	 *														                                   and then will be available e.g. via <code>mmir.semantic.interprest(<input phrase string>, <grammar-id>)</code>.
	 * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
	 * @param {Array<GrammarEntry>} [implList] OPTIONAL list of GrammarEntry objects, to which the new entries (read from the options.directory) will be added
	 * 																					if omitted, a new list will be created and returned.
	 * 										GrammarEntry.id {String}: the grammar id (usually the language code, e.g. "en" or "de")
	 * 										GrammarEntry.file {String}: the path to the JSON grammar (from which the executable grammar will be created)
	 * 										GrammarEntry.engine {"jscc" | "jison" | "pegjs"}: OPTIONAL the Grammar engine that will be used to compile the executable grammar.
	 * 																												DEFAULT: "jscc"
	 * 										GrammarEntry.ignore {Boolean}: OPTIONAL if <code>true</code>, the grammar will not be loaded
	 * 										                                   (and registered) when the the app is initialized, i.e. needs to be
	 * 										                                   "manually" loaded/initialized by app implementation and/or other mechanisms.
	 * 										                                   If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
	 * 										                                   and then will be available e.g. via <code>mmir.semantic.interprest(<input phrase string>, <grammar-id>)</code>.
	 * 										GrammarEntry.async {Boolean}: OPTIONAL if <code>true</code>, and the execution environment supports Workers, then the grammar will be loaded
	 * 																												in a Worker on app start-up, i.e. execution will be asynchronously in a worker-thread
	 * 																												TODO impl. mechanism
	 * @return {Array<GrammarEntry>} the list of GrammarEntry objects
	 */
	implFromDir: function(mode, options, appRootDir, implList){

		var dir = options.directory;
		if(!path.isAbsolute(dir)){
			dir = path.resolve(appRootDir, dir);
		}

		var list = implList || [];
		readDir(mode, dir, list, options[mode + 's']);

		return list;
	},
	// /**
	//  * add grammars form options.grammar map {[grammarID: string]: GrammarOption}, if the GrammarOption has a <code>file</code> field set.
	//  * @param  {GrammarOptions} options the grammar options with field options.grammars
	//  * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
	//  * @param  {{Array<GrammarEntry>}} [implList] OPTIONAL
	//  * @return {{Array<GrammarEntry>}}
	//  */
	// jsonGrammarsFromOptions: function(options, appRootDir, implList){
	//
	// 	var grammars = options.grammars;
	//
	// 	var list = implList || [];
	// 	addFromOptions(grammars, list, appRootDir);
	//
	// 	return list;
	// },

	/**
	 * add grammars to (webpack) app build configuration
	 *
	 * @param  {Array<GrammarEntry>} grammars list of GrammarEntry objects:
	 * 										grammar.id {String}: the grammar id (usually the language code, e.g. "en" or "de")
	 * 										grammar.file {String}: the path to the JSON grammar (from which the executable grammar will be created)
	 * 										grammar.ignore {Boolean}: OPTIONAL if <code>true</code>, the grammar will not be loaded
	 * 										                                   (and registered) when the the app is initialized, i.e. needs to be
	 * 										                                   "manually" loaded/initialized by app implementation and/or other mechanisms.
	 * 										                                   If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
	 * 										                                   and then will be available e.g. via <code>mmir.semantic.interprest(<input phrase string>, <grammar-id>)</code>.
	 * @param  {[type]} appConfig the app configuration to which the grammars will be added
	 * @param  {[type]} directories the directories.json representation
	 * @param  {[type]} runtimeConfiguration the configuration.json representation
	 */
	addImplementationsToAppConfig: function(implList, appConfig, directories, runtimeConfiguration){

		if(!implList || implList.length < 1){
			return;
		}

		implList.forEach(function(impl){

			var aliasId = toAliasId(impl);
			appConfigUtils.addIncludeModule(appConfig, aliasId, toAliasPath(impl));


			console.log('impl-utils.addImplementationsToAppConfig(): adding '+impl.type+' implemenation '+impl.id+': ['+aliasId+'] -> "'+toAliasPath(impl)+'"!');

			switch(impl.type){
				case 'controller':
					directoriesUtil.addCtrl(directories, aliasId);
					break;
				case 'helper':
					directoriesUtil.addHelper(directories, aliasId);
					break;
				case 'model':
					directoriesUtil.addModel(directories, aliasId);
					break;
				default:
					console.log('impl-utils.addImplementationsToAppConfig(): unknown type '+impl.type+' for implemenation '+impl.id+' at "'+impl.file+'"!');
					break;
			}

		});
	}
};
