var path = require('path');
var fs = require('fs');
var fileUtils = require('../utils/filepath-utils.js');

var appConfigUtils = require('../utils/module-config-init.js');

var directoriesUtil = require('../tools/directories-utils.js');


var VirtualModulePlugin;
function initVirtualModulePlugin(){
	if(!VirtualModulePlugin){
		VirtualModulePlugin = require('virtual-module-webpack-plugin');
	}
}

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

function readSubDir(dirs, list, _options){

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

function containsCtrl(ctrlName, ctrlList){
	return ctrlList.findIndex(function(c){
		return c.name === ctrlName;
	}) !== -1;
}

function addCtrlStub(view, ctrlList, ctrlMap){

	if(view.isLayout){
		return;
	}

	if(containsCtrl(view.ctrlName, ctrlList)){
		return;
	}

	var ctrl = ctrlMap.get(view.ctrlName);
	var isDebug = true;//DEBUG TODO make configurable/settable via options
	if(!ctrl){
		ctrl = {
			moduleName: 'mmirf/controller/'+view.ctrlName[0].toLowerCase()+view.ctrlName.substring(1),
			contents: 'function '+view.ctrlName+'(){'+(isDebug? 'console.log("created stub controller '+view.ctrlName+'");' : '')+'}; ' +
									view.ctrlName + '.prototype.on_page_load = function(){'+(isDebug? 'console.log("invoked on_page_load() on stub controller '+view.ctrlName+'");' : '')+'};' +
									// 'window.'+view.ctrlName+' = '+view.ctrlName+';' +
									'module.exports = '+view.ctrlName+';'
		};
		ctrlMap.set(view.ctrlName, ctrl);
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
	 * 										view.id {String}: the view id
	 * 										view.file {String}: the path to the eHTML view template (from which the executable view will be created)
	 * @param  {Array<ControllerEntry>} ctrls list of ControllerEntry objects:
	 * 										ctrl.id {String}: the controller id
	 * @param  {[type]} appConfig the app configuration to which the views will be added
	 * @param  {[type]} directories the directories.json representation
	 * @param  {ResourcesConfig} resources the resources configuration
	 * @param  {[type]} runtimeConfiguration the configuration.json representation
	 */
	addViewsToAppConfig: function(views, ctrls, appConfig, directories, resources, _runtimeConfiguration){

		if(!views || views.length < 1){
			return;
		}

		var stubCtrlMap = new Map();

		views.forEach(function(v){

			var aliasId = toAliasId(v);
			appConfigUtils.addIncludeModule(appConfig, aliasId, toAliasPath(v));
			directoriesUtil.addView(directories, aliasId);
			if(appConfig.includeViewTempalates){
				directoriesUtil.addViewTemplate(directories, aliasId);
			}

			addCtrlStub(v, ctrls, stubCtrlMap);
		});

		// include dependencies for loading & rendering views:
		appConfig.includeModules.push('mmirf/storageUtils', 'mmirf/renderUtils');
		appConfig.includeModules.push('mmirf/yield', 'mmirf/layout', 'mmirf/view', 'mmirf/partial');//TODO only include types that were actually parsed

		//FIXME set simpleViewEngine TODO support setting engine via appConfig
		resources.paths['mmirf/simpleViewEngine'] = 'env/view/simpleViewEngine';

		if(!appConfig.paths){
			appConfig.paths = {};
		}

		// replace default viewLoader with webpack-viewLoader:
		appConfig.paths['mmirf/viewLoader'] = path.resolve(__dirname, '..', 'runtime', 'webpackViewLoader.js');

		//add generated stub controllers if necessary:
		if(stubCtrlMap.size > 0){

			initVirtualModulePlugin();

			if(!appConfig.webpackPlugins){
				appConfig.webpackPlugins = [];
			}

			stubCtrlMap.forEach(function(ctrl, name){
				var id = ctrl.moduleName;
				console.log('adding view controller stub "'+name+'": ', id, ' -> ', ctrl);//DEBUG
				// appConfig.paths[id] = id;// path.resolve('./viewParser/webpackGenCtrl.js');
				// appConfig.includeModules.push(id);
				appConfigUtils.addIncludeModule(appConfig, id, id);

				directoriesUtil.addCtrl(directories, ctrl.moduleName);
				appConfig.webpackPlugins.push(new VirtualModulePlugin(ctrl));
			});
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
