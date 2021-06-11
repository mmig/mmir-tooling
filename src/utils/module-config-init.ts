
import { WebpackAppConfig } from '../index-webpack.d';

import path from 'path';

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

    /** add alias (i.e. "lookup information" for module ID -> file) for module */
    registerModuleId: registerModuleId,
    /** add alias (i.e. "lookup information") for module AND include module in main script */
    addIncludeModule: addIncludeModule,
    /** add alias (i.e. "lookup information") for module AND "auto-load" module in main script during initialization */
    addAutoLoadModule: addAutoLoadModule,
    addAppSettings: addAppSettings
}
