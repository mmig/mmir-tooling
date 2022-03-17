"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const filepath_utils_1 = __importDefault(require("../utils/filepath-utils"));
const module_config_init_1 = __importDefault(require("../utils/module-config-init"));
const directories_utils_1 = __importDefault(require("../tools/directories-utils"));
const option_utils_1 = __importDefault(require("../tools/option-utils"));
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const type_utils_1 = require("../tools/type-utils");
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
var VirtualModulePlugin;
function initVirtualModulePlugin() {
    if (!VirtualModulePlugin) {
        try {
            VirtualModulePlugin = require('webpack-virtual-modules');
        }
        catch (err) {
            warn('view-utils: failed to initialize webpack-virtual-modules ', err);
        }
    }
    return !!VirtualModulePlugin;
}
function isPartialView(name) {
    return name.charAt(0) == '~';
}
;
var regExprFileExt = /\.ehtml$/i;
function readDir(dir, list, options) {
    const files = fs_extra_1.default.readdirSync(dir);
    const dirs = [];
    // log('read dir "'+dir+'" -> ', files);
    files.forEach(function (p) {
        var absPath = path_1.default.join(dir, p);
        if (filepath_utils_1.default.isDirectory(absPath)) {
            var name = path_1.default.basename(absPath);
            var isLayout = /layouts/i.test(name);
            if (!isLayout && name) {
                name = name[0].toUpperCase() + name.substring(1);
            }
            dirs.push({ dir: absPath, ctrlName: name, isLayout: isLayout });
        }
        else {
            warn('view-utils.addFromDirectory(): unknow file in view root path: ', absPath);
        }
    });
    // log('read sub-dirs -> ', dirs);
    var size = dirs.length;
    if (size > 0) {
        for (var i = 0; i < size; ++i) {
            readSubDir(dirs[i], list, options);
        }
    }
}
function readSubDir(dirs, list, options) {
    var dir = dirs.dir;
    var files = fs_extra_1.default.readdirSync(dir);
    // log('read dir "'+dir+'" -> ', files);
    files.forEach(function (p) {
        var absPath = path_1.default.join(dir, p);
        if (filepath_utils_1.default.isDirectory(absPath)) {
            warn('view-utils.addFromDirectory(): invalid sub-directory in view-directory: ', absPath);
        }
        else if (regExprFileExt.test(absPath)) {
            var normalized = filepath_utils_1.default.normalizePath(absPath);
            var fileName = path_1.default.basename(normalized).replace(/\.ehtml/i, '');
            var isLayout = dirs.isLayout;
            var isPartial = false;
            let ctrlName, viewName;
            if (isLayout && fileName) {
                ctrlName = fileName[0].toUpperCase() + fileName.substring(1);
                viewName = ctrlName;
            }
            else {
                ctrlName = dirs.ctrlName;
                viewName = fileName;
                isPartial = isPartialView(viewName);
                if (isPartial) {
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
                viewImpl: isLayout ? 'mmirf/layout' : isPartial ? 'mmirf/partial' : 'mmirf/view',
                isLayout: isLayout,
                isPartial: isPartial,
                strict: opt && typeof opt.strict === 'boolean' ? opt.strict : void (0)
            });
        }
        else {
            warn('view-utils.addFromDirectory(): unknown view template file: ', absPath);
        }
    });
    // log('results for dir "'+dir+'" -> ', ids, views);
}
function toAliasPath(view) {
    return path_1.default.normalize(view.file); //.replace(/\.ehtml$/i, '')
}
function toAliasId(view) {
    return 'mmirf/view/' + view.id; //FIXME formalize IDs for loading views in webpack (?)
}
function containsCtrl(ctrlName, ctrlList) {
    return ctrlList.findIndex(function (c) {
        return c.name === ctrlName;
    }) !== -1;
}
function addCtrlStub(view, ctrlList, ctrlMap) {
    if (view.isLayout) {
        return;
    }
    if (containsCtrl(view.ctrlName, ctrlList)) {
        return;
    }
    var ctrl = ctrlMap.get(view.ctrlName);
    var isDebug = true; //DEBUG TODO make configurable/settable via options
    if (!ctrl) {
        ctrl = {
            moduleName: 'mmirf/controller/' + view.ctrlName[0].toLowerCase() + view.ctrlName.substring(1),
            contents: 'function ' + view.ctrlName + '(){' + (isDebug ? 'console.log("created stub controller ' + view.ctrlName + '");' : '') + '}; ' +
                view.ctrlName + '.prototype.on_page_load = function(){' + (isDebug ? 'console.log("invoked on_page_load() on stub controller ' + view.ctrlName + '");' : '') + '};' +
                // 'window.'+view.ctrlName+' = '+view.ctrlName+';' +
                'module.exports = ' + view.ctrlName + ';'
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
    viewTemplatesFromDir: function (dir, appRootDir, options) {
        if (!path_1.default.isAbsolute(dir)) {
            dir = path_1.default.resolve(appRootDir, dir);
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
    applyDefaultOptions: function (options, viewList) {
        //TODO impl. if/when addFromOpitions is implemented...
        viewList.forEach(function (v) {
            [
                // {name: 'ignoreErrors', defaultValue: false},	//TODO impl. if/when addFromOpitions is implemented...
                // {name: 'force', defaultValue: false},	//TODO impl. if/when addFromOpitions is implemented...
                { name: 'strict', defaultValue: true }
            ].forEach(function (fieldInfo) {
                option_utils_1.default.applySetting(fieldInfo.name, v, options, fieldInfo.defaultValue);
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
    addViewsToAppConfig: function (views, ctrls, appConfig, directories, resources, _runtimeConfiguration) {
        if (!views || views.length < 1) {
            return;
        }
        var stubCtrlMap = new Map();
        views.forEach(function (v) {
            var aliasId = toAliasId(v);
            if ((0, type_utils_1.isWebpackConfig)(appConfig)) {
                module_config_init_1.default.addIncludeModule(appConfig, aliasId, toAliasPath(v));
            }
            directories_utils_1.default.addView(directories, aliasId);
            if (appConfig.includeViewTemplates) {
                directories_utils_1.default.addViewTemplate(directories, aliasId);
            }
            addCtrlStub(v, ctrls, stubCtrlMap);
        });
        //FIXME set simpleViewEngine TODO support setting engine via appConfig
        resources.paths['mmirf/simpleViewEngine'] = 'env/view/simpleViewEngine';
        if (!(0, type_utils_1.isWebpackConfig)(appConfig)) {
            return;
        }
        // include dependencies for loading & rendering views:
        appConfig.includeModules.push('mmirf/storageUtils', 'mmirf/renderUtils');
        appConfig.includeModules.push('mmirf/yield', 'mmirf/layout', 'mmirf/view', 'mmirf/partial'); //TODO only include types that were actually parsed
        if (!appConfig.paths) {
            appConfig.paths = {};
        }
        // replace default viewLoader with webpack-viewLoader:
        appConfig.paths['mmirf/viewLoader'] = path_1.default.resolve(__dirname, '..', 'runtime', 'webpackViewLoader.js');
        //add generated stub controllers if necessary:
        if (stubCtrlMap.size > 0 && appConfig.controllers !== false) {
            if (initVirtualModulePlugin()) {
                if (!appConfig.webpackPlugins) {
                    appConfig.webpackPlugins = [];
                }
                var virtualModules = {};
                stubCtrlMap.forEach(function (ctrl, name) {
                    var id = ctrl.moduleName;
                    log('view-utils: adding view controller stub "' + name + '": ', id, ' -> ', ctrl); //DEBUG
                    // appConfig.paths[id] = id;// path.resolve('./viewParser/webpackGenCtrl.js');
                    // appConfig.includeModules.push(id);
                    module_config_init_1.default.addIncludeModule(appConfig, id, id);
                    directories_utils_1.default.addCtrl(directories, ctrl.moduleName);
                    virtualModules[ctrl.moduleName] = ctrl.contents;
                });
                appConfig.webpackPlugins.push(new VirtualModulePlugin(virtualModules));
            }
            else {
                warn('view-utils: cannot add stub controllers, because of misssing package virtual-module-webpack-plugin');
            }
        }
    },
    // getCtrlImpl: function(){
    // 	return controllers.slice();
    // }
};
