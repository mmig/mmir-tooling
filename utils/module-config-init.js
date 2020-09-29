"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const type_utils_1 = require("../tools/type-utils");
/**
 * add/overwrite module alias (i.e. mapping module ID to file path)
 *
 * @param  {{paths?: {[moduleId: string]: string}}} mmirAppConfig the app-specific configuration: applies module-path-specifications from mmirAppConfig.paths
 * @param  {[{[moduleId: string]: string}]} alias the (default) mapping of module IDs to (absolute) paths
 */
function addAliasFrom(mmirAppConfig, alias) {
    if (type_utils_1.isWebpackConfig(mmirAppConfig)) {
        // log('adding/overwriting paths with app paths: ', mmirAppConfig.paths);
        // Object.assign(alias, mmirAppConfig.paths);
        const appRoot = mmirAppConfig.rootPath || process.cwd();
        let p;
        for (let n in mmirAppConfig.paths) {
            p = mmirAppConfig.paths[n];
            alias[n] = path_1.default.isAbsolute(p) ? p : path_1.default.join(appRoot, p);
            // aliasList.push(n);
        }
        // log('set paths to -> ', alias);
    }
    //DISABLED redirection must be handled by NormalModuleReplacementPlugin, because loadFile is not directly require'ed, but vie package (sub) path 'mmirf/util'
    // //add "proxy" for mmirf/util/loadFile, so that inlined resouces get returned directly:
    // alias['mmirf/util/loadFile'] = path.resolve('./runtime/webpack-loadFile.js');
    // var origLoadFile = path.resolve(alias['mmirf/util'], 'loadFile.js');
    // alias['mmirf/util/loadFile__raw'] = origLoadFile;
}
function contains(list, entry) {
    return list.findIndex(function (item) {
        return item === entry;
    }) !== -1;
}
function toAliasPath(moduleFilePath) {
    return path_1.default.normalize(moduleFilePath);
}
function registerModuleId(appConfig, id, file) {
    doRegisterModuleId(appConfig, id, file);
}
function addAutoLoadModule(appConfig, id, file) {
    doAddModule(appConfig, 'loadAfterInit', id, file);
}
function addIncludeModule(appConfig, id, file) {
    doAddModule(appConfig, 'includeModules', id, file);
}
function doAddModule(appConfig, includeType, id, file) {
    if (file) {
        doRegisterModuleId(appConfig, id, file);
    }
    if (!appConfig[includeType]) {
        appConfig[includeType] = [];
    }
    if (!contains(appConfig[includeType], id)) {
        appConfig[includeType].push(id);
    }
}
function doRegisterModuleId(appConfig, id, file) {
    if (!appConfig.paths) {
        appConfig.paths = {};
    }
    appConfig.paths[id] = toAliasPath(file);
}
function addAppSettings(appConfig, id, settings) {
    if (!appConfig.runtimeSettings) {
        appConfig.runtimeSettings = {};
    }
    appConfig.runtimeSettings[id] = settings;
}
module.exports = {
    // addModulePaths: function(userConfig, mmirAppConfig: WebpackAppConfig){
    //     if(userConfig.modulePaths){
    //         for(var p in userConfig.modulePaths){
    //             mmirAppConfig.paths[p] = userConfig.modulePaths[p];
    //         }
    //     }
    // },
    // addModuleConfigs: function(userConfig, mmirAppConfig: WebpackAppConfig){
    //     if(userConfig.moduleConfigs){
    //         if(!mmirAppConfig.config){
    //             mmirAppConfig.config = {};
    //         }
    //         for(var c in userConfig.moduleConfigs){
    //             mmirAppConfig.config[c] = userConfig.moduleConfigs[c];
    //         }
    //     }
    // },
    addAliasFrom: addAliasFrom,
    /** add alias (i.e. "lookup information" for module ID -> file) for module */
    registerModuleId: registerModuleId,
    /** add alias (i.e. "lookup information") for module AND include module in main script */
    addIncludeModule: addIncludeModule,
    /** add alias (i.e. "lookup information") for module AND "auto-load" module in main script during initialization */
    addAutoLoadModule: addAutoLoadModule,
    addAppSettings: addAppSettings
};
