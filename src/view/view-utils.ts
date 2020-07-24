
import { ViewBuildOptions, ViewEntry, ImplementationEntry , BuildAppConfig, ImplementationBuildEntry , ResourceConfig , RuntimeConfiguration , DirectoriesInfo , VirtualImplementationEntry , ViewBuildEntry } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';

import path from 'path';
import fs from 'fs-extra';
import fileUtils from '../utils/filepath-utils';

import appConfigUtils from '../utils/module-config-init';

import directoriesUtil from '../tools/directories-utils';
import optionUtils from '../tools/option-utils';

import logUtils from '../utils/log-utils';
import { isWebpackConfig } from '../tools/type-utils';

type ViewDirInfo = {dir: string, ctrlName: string, isLayout: boolean};

const log = logUtils.log;
const warn = logUtils.warn;
var VirtualModulePlugin: any;
function initVirtualModulePlugin(){
    if(!VirtualModulePlugin){
        try{
            VirtualModulePlugin = require('virtual-module-webpack-plugin');
        } catch(err){
            warn('view-utils: failed to initialize virtual-module-webpack-plugin ', err);
        }
    }
    return !!VirtualModulePlugin;
}

function isPartialView(name: string): boolean {
    return name.charAt(0) == '~';
};
var regExprFileExt = /\.ehtml$/i;

function readDir(dir: string, list: ViewEntry[], options?: ViewBuildOptions): void {

    const files = fs.readdirSync(dir);
    const dirs: ViewDirInfo[] = [];
    // log('read dir "'+dir+'" -> ', files);

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
            warn('view-utils.addFromDirectory(): unknow file in view root path: ', absPath);
        }
    });

    // log('read sub-dirs -> ', dirs);
    var size = dirs.length;
    if(size > 0){
        for(var i = 0; i < size; ++i){
            readSubDir(dirs[i], list, options);
        }
    }
}

function readSubDir(dirs: ViewDirInfo, list: ViewEntry[], options?: ViewBuildOptions): void {

    var dir = dirs.dir;
    var files = fs.readdirSync(dir);
    // log('read dir "'+dir+'" -> ', files);

    files.forEach(function(p){
        var absPath = path.join(dir, p);
        if(fileUtils.isDirectory(absPath)){
            warn('view-utils.addFromDirectory(): invalid sub-directory in view-directory: ', absPath);
        } else if(regExprFileExt.test(absPath)) {

            var normalized = fileUtils.normalizePath(absPath);
            var fileName = path.basename(normalized).replace(/\.ehtml/i, '');
            var isLayout = dirs.isLayout;

            var isPartial = false;
            let ctrlName: string, viewName: string;
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

            var id = dirs.ctrlName.toLowerCase() + '/' + fileName;
            var opt = options && options[id];

            list.push({
                id: id,
                ctrlName: ctrlName,
                viewName: viewName,
                file: normalized,
                viewImpl: isLayout? 'mmirf/layout' : isPartial? 'mmirf/partial' : 'mmirf/view',
                isLayout: isLayout,
                isPartial: isPartial,
                strict: opt && typeof opt.strict === 'boolean'? opt.strict : void(0)
            });

        } else {
            warn('view-utils.addFromDirectory(): unknown view template file: ', absPath);
        }
    });
    // log('results for dir "'+dir+'" -> ', ids, views);
}

function toAliasPath(view: ViewEntry): string {
    return path.normalize(view.file);//.replace(/\.ehtml$/i, '')
}

function toAliasId(view: ViewEntry): string {
    return 'mmirf/view/' + view.id;//FIXME formalize IDs for loading views in webpack (?)
}

function containsCtrl(ctrlName: string, ctrlList: Array<ImplementationBuildEntry | VirtualImplementationEntry>): boolean {
    return ctrlList.findIndex(function(c){
        return (c as ImplementationEntry).name === ctrlName;
    }) !== -1;
}

function addCtrlStub(view: ViewEntry, ctrlList: Array<ImplementationBuildEntry | VirtualImplementationEntry>, ctrlMap: Map<string, ImplementationBuildEntry | VirtualImplementationEntry>): void {

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

export = {

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
    viewTemplatesFromDir: function(dir: string, appRootDir: string, options?: ViewBuildOptions): ViewBuildEntry[] {

        if(!path.isAbsolute(dir)){
            dir = path.resolve(appRootDir, dir);
        }
        var list = [];
        readDir(dir, list, options);

        return list;
    },

    /**
     * apply the "global" options from `options` or default values to the entries
     * from `viewList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {ViewOptions} options the view options
     * @param  {{Array<ViewEntry>}} viewList
     * @return {{Array<ViewEntry>}}
     */
    applyDefaultOptions: function(options: ViewBuildOptions, viewList: ViewEntry[]): ViewEntry[] {

        //TODO impl. if/when addFromOpitions is implemented...
        viewList.forEach(function(v){
            [
                // {name: 'ignoreErrors', defaultValue: false},	//TODO impl. if/when addFromOpitions is implemented...
                // {name: 'force', defaultValue: false},	//TODO impl. if/when addFromOpitions is implemented...
                {name: 'strict', defaultValue: true}
            ].forEach(function(fieldInfo){
                optionUtils.applySetting(fieldInfo.name, v, options, fieldInfo.defaultValue);
            });

        });

        return viewList;
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
    addViewsToAppConfig: function(views: ViewEntry[], ctrls: ImplementationBuildEntry[], appConfig: BuildAppConfig | WebpackAppConfig, directories: DirectoriesInfo, resources: ResourceConfig, _runtimeConfiguration: RuntimeConfiguration): void {

        if(!views || views.length < 1){
            return;
        }

        var stubCtrlMap = new Map();

        views.forEach(function(v){

            var aliasId = toAliasId(v);
            if(isWebpackConfig(appConfig)){
                appConfigUtils.addIncludeModule(appConfig, aliasId, toAliasPath(v));
            }
            directoriesUtil.addView(directories, aliasId);
            if((appConfig as BuildAppConfig).includeViewTemplates){
                directoriesUtil.addViewTemplate(directories, aliasId);
            }

            addCtrlStub(v, ctrls, stubCtrlMap);
        });

        //FIXME set simpleViewEngine TODO support setting engine via appConfig
        resources.paths['mmirf/simpleViewEngine'] = 'env/view/simpleViewEngine';

        if(!isWebpackConfig(appConfig)){
            return;
        }

        // include dependencies for loading & rendering views:
        appConfig.includeModules.push('mmirf/storageUtils', 'mmirf/renderUtils');
        appConfig.includeModules.push('mmirf/yield', 'mmirf/layout', 'mmirf/view', 'mmirf/partial');//TODO only include types that were actually parsed

        if(!appConfig.paths){
            appConfig.paths = {};
        }

        // replace default viewLoader with webpack-viewLoader:
        appConfig.paths['mmirf/viewLoader'] = path.resolve(__dirname, '..', 'runtime', 'webpackViewLoader.js');

        //add generated stub controllers if necessary:
        if(stubCtrlMap.size > 0 && appConfig.controllers !== false){

            if(initVirtualModulePlugin()){

                if(!appConfig.webpackPlugins){
                    appConfig.webpackPlugins = [];
                }

                stubCtrlMap.forEach(function(ctrl, name){
                    var id = ctrl.moduleName;
                    log('view-utils: adding view controller stub "'+name+'": ', id, ' -> ', ctrl);//DEBUG
                    // appConfig.paths[id] = id;// path.resolve('./viewParser/webpackGenCtrl.js');
                    // appConfig.includeModules.push(id);
                    appConfigUtils.addIncludeModule(appConfig, id, id);

                    directoriesUtil.addCtrl(directories, ctrl.moduleName);
                    appConfig.webpackPlugins.push(new VirtualModulePlugin(ctrl));
                });

            } else {
                warn('view-utils: cannot add stub controllers, because of misssing package virtual-module-webpack-plugin');
            }
        }
    },

    // getCtrlImpl: function(){
    // 	return controllers.slice();
    // }
};
