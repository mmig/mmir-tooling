
import { AppConfig , BuildAppConfig } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';

import path from 'path';
import { isWebpackConfig } from '../tools/type-utils';

/**
 * add/overwrite module alias (i.e. mapping module ID to file path)
 *
 * @param  {{paths?: {[moduleId: string]: string}}} mmirAppConfig the app-specific configuration: applies module-path-specifications from mmirAppConfig.paths
 * @param  {[{[moduleId: string]: string}]} alias the (default) mapping of module IDs to (absolute) paths
 */
function addAliasFrom(mmirAppConfig: AppConfig | BuildAppConfig | WebpackAppConfig, alias: {[moduleId: string]: string}): void {

    if(isWebpackConfig(mmirAppConfig)){
        // log('adding/overwriting paths with app paths: ', mmirAppConfig.paths);
        // Object.assign(alias, mmirAppConfig.paths);
        const appRoot = mmirAppConfig.rootPath || process.cwd();
        let p: string;
        for (let n in mmirAppConfig.paths) {
            p = mmirAppConfig.paths[n];
            alias[n] = path.isAbsolute(p)? p : path.join(appRoot, p);
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

function contains(list: any[], entry: any): boolean {
    return list.findIndex(function(item){
        return item === entry;
    }) !== -1;
}

function toAliasPath(moduleFilePath: string): string {
    return path.normalize(moduleFilePath);
}

function registerModuleId(appConfig: WebpackAppConfig, id: string, file: string): void {
    doRegisterModuleId(appConfig, id, file);
}

function addAutoLoadModule(appConfig: WebpackAppConfig, id: string, file: string): void {
    doAddModule(appConfig, 'loadAfterInit', id, file);
}

function addIncludeModule(appConfig: WebpackAppConfig, id: string, file?: string): void {
    doAddModule(appConfig, 'includeModules', id, file);
}

type IncludeType = 'loadAfterInit' | 'loadBeforeInit' | 'includeModules';

function doAddModule(appConfig: WebpackAppConfig, includeType: IncludeType, id: string, file?: string): void {

    if(file){
        doRegisterModuleId(appConfig, id, file);
    }

    if(!appConfig[includeType]){
        appConfig[includeType] = [];
    }

    if(!contains(appConfig[includeType], id)){
        appConfig[includeType].push(id);
    }
}

function doRegisterModuleId(appConfig: WebpackAppConfig, id: string, file: string){

    if(!appConfig.paths){
        appConfig.paths = {};
    }
    appConfig.paths[id] = toAliasPath(file);
}

function addAppSettings(appConfig: WebpackAppConfig, id: string, settings: any){

    if(!appConfig.runtimeSettings){
        appConfig.runtimeSettings = {};
    }
    appConfig.runtimeSettings[id] = settings;
}

export = {
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
}
