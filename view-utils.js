var path = require('path');
var fs = require('fs');
var fileUtils = require('./webpack-filepath-utils.js');

var appConfigUtils = require('./webpack-app-module-config-utils.js');
var directoriesUtil = require('./mmir-directories-util.js');

var isPartialView = function(name){
	return name.charAt(0) == '~';
};
var regExprFileExt = /\.ehtml$/i;

function readDir(dir, list, options){

	var files = fs.readdirSync(dir);
	var dirs = [];
	// console.log('read dir "'+dir+'" -> ', files);

	files.forEach(function(p){
		var absPath = path.join(dir, p);
		if(fileUtils.isDirectory(absPath)){
			var name = path.basename(absPath);
			var isLayout = /layouts/i.test(name);
			if(!isLayout && name){
				name = name[0].toUpperCase() + name.substring(1);
			}
			dirs.push({dir: absPath, ctrlName: name, isLayout: isLayout});
		} else {
			console.log('view-utils.addFromDirectory(): unknow file in view root path: ', absPath);
		}
	});

	// console.log('read sub-dirs -> ', dirs);
	var size = dirs.length;
	if(size > 0){
		for(var i = 0; i < size; ++i){
			readSubDir(dirs[i], list, options);
		}
	}
}

function readSubDir(dirs, list, options){

	var dir = dirs.dir;
	var files = fs.readdirSync(dir);
	// console.log('read dir "'+dir+'" -> ', files);

	files.forEach(function(p){
		var absPath = path.join(dir, p);
		if(fileUtils.isDirectory(absPath)){
			console.log('view-utils.addFromDirectory(): invalid sub-directory in view-directory: ', absPath);
		} else if(regExprFileExt.test(absPath)) {

			var normalized = fileUtils.normalizePath(absPath);
			var fileName = path.basename(normalized).replace(/\.ehtml/i, '');
			var isLayout = dirs.isLayout;

			var isPartial = false;
			var ctrlName, viewName;
			if(isLayout && fileName){
				ctrlName = fileName[0].toUpperCase() + fileName.substring(1);
				viewName = ctrlName;
			} else {
				ctrlName = dirs.ctrlName;
				viewName = fileName;
				isPartial = isPartialView(viewName);
				if(isPartial){
					viewName = viewName.substring(1);
				}
			}

			list.push({
				id: dirs.ctrlName.toLowerCase() + '/' + fileName,
				ctrlName: ctrlName,
				viewName: viewName,
				file: normalized,
				viewImpl: isLayout? 'mmirf/layout' : isPartial? 'mmirf/partial' : 'mmirf/view',
				isLayout: isLayout,
				isPartial: isPartial
			});

		} else {
			console.log('view-utils.addFromDirectory(): unknown view template file: ', absPath);
		}
	});
	// console.log('results for dir "'+dir+'" -> ', ids, views);
}

function toAliasPath(view){
	return path.normalize(view.file);//.replace(/\.ehtml$/i, '')
}

function toAliasId(view){
	return 'mmirf/view/' + view.id;//FIXME formalize IDs for loading views in webpack (?)
}


var controllers = new Map();//FIXME TEST
function addCtrl(view){//FIXME TEST
	if(view.isLayout){
		return;
	}
	var ctrl = controllers.get(view.ctrlName);
	if(!ctrl){
		// ctrl = 'define("mmirf/controller/'+view.ctrlName.toLowerCase()+'", function(){ return function '+view.ctrlName+'(){console.log("creating Controller '+view.ctrlName+'")};})';
		ctrl = {
			moduleName: 'mmirf/controller/'+view.ctrlName.toLowerCase(),
			contents: 'function '+view.ctrlName+'(){console.log("created '+view.ctrlName+'")}; window.'+view.ctrlName+' = '+view.ctrlName+'; module.exports = '+view.ctrlName+';'
		};
		controllers.set(view.ctrlName, ctrl);
	}
}


module.exports = {

	/**
	 * add views from a base-directory that adheres to the structure:
	 * <pre>
	 * <dir>/<controller name 1>/view1.ehtml
	 *                          /view2.ehtml
	 *                          ...
	 * <dir>/<controller name 2>/view1.ehtml
	 *                          /view2.ehtml
	 *                          ...
	 * ...
	 * <dir>/layouts/default.ehtml
	 *              /<controller name 1>.ehtml
	 *              ...
	 * </pre>
	 * @param  {String} dir the direcotry from which to parse/collect the views
	 * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
	 * @param  {ViewOptionMap} [options] OPTIONAL
	 * 										unsupported TODO
	 * @return {Array<ViewEntry>} a list of ViewEntry objects:
	 * 									{
	 * 										id: String
	 * 										ctrlName: String,
	 * 										viewName: String,
	 * 										file: String,
	 * 										viewImpl: 'mmirf/layout' | 'mmirf/partial' | 'mmirf/view',
	 * 										isLayout: Boolean
	 * 										isPartial: Boolean
	 * 									}
	 */
	viewTemplatesFromDir: function(dir, appRootDir, options){

		if(!path.isAbsolute(dir)){
			dir = path.resolve(appRootDir, dir);
		}
		var list = [];
		readDir(dir, list, options);

		return list;
	},

	/**
	 * add views to (webpack) app build configuration
	 *
	 * @param  {Array<ViewEntry>} view list of ViewEntry objects:
	 * 										view.id {String}: the grammar id (usually the language code, e.g. "en" or "de")
	 * 										view.file {String}: the path to the JSON grammar (from which the executable grammar will be created)
	 * @param  {[type]} appConfig the app configuration to which the grammars will be added
	 * @param  {[type]} directories the directories.json representation
	 * @param  {[type]} runtimeConfiguration the configuration.json representation
	 */
	addViewsToAppConfig: function(views, appConfig, directories, runtimeConfiguration){

		if(!views || views.length < 1){
			return;
		}

		views.forEach(function(v){

			appConfigUtils.addIncludeModule(appConfig, toAliasId(v), toAliasPath(v));
			directoriesUtil.addView(directories, toAliasId(v));

			addCtrl(v);//FIXME TEST
		});

		if(views.length > 0){

			if(!appConfig.includeModules){
				appConfig.includeModules = [];
			}

			// include dependencies for loading & rendering views:
			appConfig.includeModules.push('mmirf/storageUtils', 'mmirf/renderUtils');
			appConfig.includeModules.push('mmirf/yield', 'mmirf/layout', 'mmirf/view', 'mmirf/partial');//TODO only include types that were actually parsed

			if(!appConfig.paths){
				appConfig.paths = {};
			}

			// replace default viewLoader with webpack-viewLoader:
			appConfig.paths['mmirf/viewLoader'] = path.resolve('viewParser/webpackViewLoader.js');

			// appConfig.paths['mmirf/controllerManager'] = path.resolve('viewParser/webpackCtlrManager.js');
			// appConfig.paths['mmirf/viewLoader'] = path.join(path.dirname(require.resolve('mmir-lib')), 'env/view/viewLoader');

			//FIXME TEST:
			if(controllers.size > 0){

				controllers.forEach(function(code, name){
					var id = 'mmirf/controller/'+name.toLowerCase();
					console.log('adding view controller: ', id);
					// appConfig.paths[id] = id;// path.resolve('./viewParser/webpackGenCtrl.js');
					// appConfig.includeModules.push(id);
					appConfigUtils.addIncludeModule(appConfig, id, id);
				});

				// var id = 'mmirf/build-tool/gen-controllers';
				// appConfigUtils.addAutoLoadModule(appConfig, id, path.resolve('./viewParser/webpackGenCtrl.js'));
			}
		}
	},

	getCtrlImpl: function(){
		if(controllers.size < 1){
			return [];
		}
		var list = [];
		controllers.forEach(function(ctrl){
			list.push(ctrl)
		});
		return list;
	}
};
