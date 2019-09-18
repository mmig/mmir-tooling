var path = require('path');
var fs = require('fs');
var _ = require ('lodash');
var fileUtils = require('../utils/filepath-utils.js');

var appConfigUtils = require('../utils/module-config-init.js');
var directoriesUtil = require('../tools/directories-utils.js');
var configurationUtil = require('../tools/settings-utils.js');
var optionUtils = require('../tools/option-utils.js');

var logUtils = require('../utils/log-utils.js');
var log = logUtils.log;
var warn = logUtils.warn;

function readDir(dir, list, options){

	var files = fs.readdirSync(dir);
	var dirs = [];
	// log('read dir "'+dir+'" -> ', files);

	files.forEach(function(p){
		var absPath = path.join(dir, p);
		if(fileUtils.isDirectory(absPath)){
			dirs.push(absPath);
			return false;
		} else if(/grammar\.js(on)?$/i.test(p)){
			var normalized = fileUtils.normalizePath(absPath);
			var m = /\/([^/]+)\/grammar\.js(on)?$/i.exec(normalized);
			var id = m[1];

			var opt = options && options[id];
			if(opt && (opt.exclude || opt.file)){
				//-> ignore/exclude this grammar!
				log('grammar-utils.addFromDirectory(): excluding grammar '+id+' at "'+normalized+'"!');//DEBUG
				return;//////////////////// EARLY EXIT //////////////////
			}

			list.push({
				id: id,
				file: normalized,
				fileType: configurationUtil.getFileType(normalized),
				engine: opt && opt.engine? opt.engine : void(0),
				ignore: opt && opt.ignore? true : false,
				async: opt && opt.async? true : void(0),
				asyncCompile: opt && typeof opt.asyncCompile === 'boolean'? opt.asyncCompile : void(0),
				force: opt && typeof opt.force === 'boolean'? opt.force : void(0)
			});
		}
	});

	// log('read sub-dirs -> ', dirs);
	var size = dirs.length;
	if(size > 0){
		for(var i = 0; i < size; ++i){
			readDir(dirs[i], list, options);
		}
	}
}

function addFromOptions(grammars, list, appRootDir){

	var g, entry;
	for(var id in grammars){

		g = grammars[id];
		if(g && g.file && !g.exclude){

			entry = _.cloneDeep(g);
			if(!path.isAbsolute(entry.file)){
				entry.file = path.resolve(appRootDir, entry.file);
			}
			entry.file = fileUtils.normalizePath(entry.file);
			entry.fileType = entry.fileType || configurationUtil.getFileType(entry.file);

			if(entry.id && entry.id !== id){
				warn('grammar-utils.addFromOptions(): entry from grammarOptions for ID "'+id+'" has differing field id with value "'+entry.id+'", overwritting the id field with "'+id+'"!');//FIXME proper webpack error/warning
			}
			entry.id = id;

			//TODO verify existence of entry.file?

			if(!contains(list, id)){
				// log('grammar-utils.addFromOptions(): adding ', entry);//DEBU
				list.push(entry)
			} else {
				warn('grammar-utils.addFromOptions(): entry from grammarOptions for ID '+id+' already exists in grammar-list, ignoring entry!');//FIXME proper webpack error/warning
			}
		}
		// else {//DEBU
		// 	log('grammar-utils.addFromOptions(): entry for '+id+' has no file set -> ignore ', g);//DEBU
		// }
	}
}

function contains(grammarList, id){
	return grammarList.findIndex(function(item){
		return item.id === id;
	}) !== -1;
}


function toAliasPath(grammar){
	return path.normalize(grammar.file);//DISABLED: do keep file-extension to ensure that module is found regardless of webpack resolve-configuration//.replace(/\.json$/i, '');
}

function toAliasId(grammar){
	return 'mmirf/grammar/'+grammar.id;//FIXME formalize IDs for loading views in webpack (?)
}

module.exports = {

	/**
	 * [description]
	 * @param  {GrammarOptions} options the grammar options where
	 * 										options.path: REQUIRED the directory from which to add the grammars, and has the following structure:
	 * 																				<directory>/<grammar-id-1>/grammar.json
	 * 																				<directory>/<grammar-id-2>/grammar.json
	 * 																				...
	 * 										options.grammars: OPTIONAL a map of grammar IDs, i.e. {[grammarID: string]: GrammarOption} with specific options for compiling the corresponding JSON grammar:
	 *														options.grammars[id].engine {"jscc" | "jison" | "pegjs"}: OPTIONAL the Grammar engine that will be used to compile the executable grammar.
	 *																																									DEFAULT: "jscc"
	 *														options.grammars[id].async {Boolean}: OPTIONAL if <code>true</code>, and the execution environment supports Workers, then the grammar will be loaded
	 *																																			in a Worker on app start-up, i.e. execution will be asynchronously in a worker-thread
	 *														options.grammars[id].exclude {Boolean}: OPTIONAL if <code>true</code>, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
	 *																																				from the corresponding JSON grammar
	 *														options.grammars[id].ignore {Boolean}: OPTIONAL if <code>true</code>, the grammar will not be loaded
	 *														                                   (and registered) when the the app is initialized, i.e. needs to be
	 *														                                   "manually" loaded/initialized by app implementation and/or other mechanisms.
	 *														                                   If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
	 *														                                   and then will be available e.g. via <code>mmir.semantic.interpret(<input phrase string>, <grammar-id>)</code>.
	 * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
	 * @param {Array<GrammarEntry>} [grammarList] OPTIONAL list of GrammarEntry objects, to which the new entries (read from the options.directory) will be added
	 * 																					if omitted, a new list will be created and returned.
	 * 										GrammarEntry.id {String}: the grammar id (usually the language code, e.g. "en" or "de")
	 * 										GrammarEntry.file {String}: the path to the JSON grammar (from which the executable grammar will be created)
	 * 										GrammarEntry.engine {"jscc" | "jison" | "pegjs"}: OPTIONAL the Grammar engine that will be used to compile the executable grammar.
	 * 																												DEFAULT: "jscc"
	 * 										GrammarEntry.ignore {Boolean}: OPTIONAL if <code>true</code>, the grammar will not be loaded
	 * 										                                   (and registered) when the the app is initialized, i.e. needs to be
	 * 										                                   "manually" loaded/initialized by app implementation and/or other mechanisms.
	 * 										                                   If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
	 * 										                                   and then will be available e.g. via <code>mmir.semantic.interpret(<input phrase string>, <grammar-id>)</code>.
	 * 										GrammarEntry.async {Boolean}: OPTIONAL if <code>true</code>, and the execution environment supports Workers, then the grammar will be loaded
	 * 																												in a Worker on app start-up, i.e. execution will be asynchronously in a worker-thread
	 * @return {Array<GrammarEntry>} the list of GrammarEntry objects
	 */
	jsonGrammarsFromDir: function(options, appRootDir, grammarList){

		var dir = options.path;
		if(!path.isAbsolute(dir)){
			dir = path.resolve(appRootDir, dir);
		}

		var list = grammarList || [];
		readDir(dir, list, options.grammars);

		return list;
	},
	/**
	 * add grammars form options.grammar map {[grammarID: string]: GrammarOption}, if the GrammarOption has a <code>file</code> field set.
	 * @param  {GrammarOptions} options the grammar options with field options.grammars
	 * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
	 * @param  {{Array<GrammarEntry>}} [grammarList] OPTIONAL
	 * @return {{Array<GrammarEntry>}}
	 */
	jsonGrammarsFromOptions: function(options, appRootDir, grammarList){

		var grammars = options.grammars;

		var list = grammarList || [];
		addFromOptions(grammars, list, appRootDir);

		return list;
	},
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
	 * 										                                   and then will be available e.g. via <code>mmir.semantic.interpret(<input phrase string>, <grammar-id>)</code>.
	 * @param  {[type]} appConfig the app configuration to which the grammars will be added
	 * @param  {[type]} directories the directories.json representation
	 * @param  {ResourcesConfig} _resources the resources configuration
	 * @param  {[type]} runtimeConfiguration the configuration.json representation
	 */
	addGrammarsToAppConfig: function(grammars, appConfig, directories, _resources, runtimeConfiguration){

		if(!grammars || grammars.length < 1){
			return;
		}

		grammars.forEach(function(g){

			if(g.ignore){
				//add configuration entry to avoid loading of grammar module on app start-up:
				configurationUtil.setGrammarIgnored(runtimeConfiguration, g.id);
			}

			if(g.async){
				//TODO support for async execution & configuration
				warn('  grammar-utils.addGrammarsToAppConfig(): TODO set grammar "'+g.id+'" to async execution mode');
			}

			appConfigUtils.addIncludeModule(appConfig, toAliasId(g), toAliasPath(g));

			directoriesUtil.addGrammar(directories, toAliasId(g));
		});
	},
	toAliasId: toAliasId,
	toAliasPath: toAliasPath
};
