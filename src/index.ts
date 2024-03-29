
import { BuildAppConfig, BuildConfig , SettingsBuildOptions } from './index.d';

import path from 'path';

import { flatten } from 'array-flatten';

import promise from './utils/promise';

import directoriesUtils from './tools/directories-utils';

import { createBuildConfig } from './tools/create-build-config';
import createResourcesConfig from './tools/create-resources-config';

import grammarCompiler from './compiler/grammar-compiler';
import viewCompiler from './compiler/view-compiler';
import scxmlCompiler from './compiler/scxml-compiler';
import settingsCompiler from './compiler/settings-compiler';

import cliUtils from './utils/cli-utils';

function getTargetDir(appConfig: BuildAppConfig, mainOptions: BuildConfig, optType: 'grammar' | 'view' | 'state'){
    return mainOptions[optType+'Options'].targetDir || (appConfig.targetDir && path.join(appConfig.targetDir, 'gen', optType));
}

function resolveTargetDir(appDir: string, targetDir: string): string {
    if(!path.isAbsolute(targetDir)){
        return path.join(appDir, targetDir);
    }
    return targetDir;
}

function processTargetDirs(appDir: string, appConfig: BuildAppConfig, buildConfig: BuildConfig){

    if(typeof buildConfig.stateOptions === 'undefined'){
        buildConfig.stateOptions = {};
    }

    if(buildConfig.grammarOptions) buildConfig.grammarOptions.targetDir  = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'grammar') || path.join('www', 'gen', 'grammar'));
    if(buildConfig.viewOptions)    buildConfig.viewOptions.targetDir     = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'view')    || path.join('www', 'gen', 'view'));
    if(buildConfig.stateOptions)   buildConfig.stateOptions.targetDir    = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'state')   || path.join('www', 'gen', 'state'));

    buildConfig.directoriesTargetDir = resolveTargetDir(appDir,
        appConfig.directoriesTargetDir?
            appConfig.directoriesTargetDir : appConfig.targetDir?
                path.join(appConfig.targetDir, 'gen') : path.join('www', 'gen')
    );

    if(buildConfig.settingsOptions){
        buildConfig.settingsOptions.targetDir = resolveTargetDir(appDir,
            appConfig.settings && (appConfig.settings as SettingsBuildOptions).targetDir?
                (appConfig.settings as SettingsBuildOptions).targetDir : appConfig.targetDir?
                    path.join(appConfig.targetDir, 'config') : path.join('www', 'config')
        );
    }
}

/**
 * HELPER disable build options that are not supported in "bare build"
 *
 * NOTE these may be supported in other integrations, e.g. via webpack
 *
 * @param  {any} buildConfig the build options (or sub-build options)
 * @param  {string | Array<string>} resType the build-option name or path to a sub-build option
 */
function checkBuildOptions(buildConfig: BuildConfig, resType: string | string[], resTypeMessage: string): void {

    if(Array.isArray(resType)){
        resTypeMessage = resTypeMessage || resType.join('.');
        var optName = resType.shift();
        if(buildConfig[optName] === false){
            return;
        }
        if(!buildConfig[optName]){
            buildConfig[optName] = {};
        }
        checkBuildOptions(buildConfig[optName], resType.length === 1? resType[0] : resType, resTypeMessage);

    } else {

        if(buildConfig[resType] !== false){
            resTypeMessage = resTypeMessage || resType;
            if(buildConfig[resType]) console.log('  buildOptions.'+resTypeMessage+' not supported, ignoring the options...');
            buildConfig[resType] = false;
        }
    }
};

function compileResources(mmirAppConfig: BuildAppConfig): Promise<Array<Error|Error[]> | any>[] {

    //set defaults specific for tooling-build
    directoriesUtils.setMode('file');
    mmirAppConfig.includeViewTemplates = typeof mmirAppConfig.includeViewTemplates === 'boolean'? mmirAppConfig.includeViewTemplates : true;

    //NOTE need to check for controllers etc. so that they get included in directories.json
    // checkBuildOptions(mmirAppConfig, 'controllers');
    // checkBuildOptions(mmirAppConfig, 'helpers');
    // checkBuildOptions(mmirAppConfig, 'models');

    //NOTE need to check for config/** resources in order to include them in directories.json
    // checkBuildOptions(mmirAppConfig, ['settings', 'configuration']);
    // checkBuildOptions(mmirAppConfig, ['settings', 'grammar']);
    // checkBuildOptions(mmirAppConfig, ['settings', 'speech']);

    const resourcesConfig = createResourcesConfig();

    const buildConfig = createBuildConfig(mmirAppConfig, resourcesConfig) as BuildConfig &{directoriesTargetDir?: string};

    const appRootDir = mmirAppConfig.rootPath;

    // const moduleRules = [];

    const tasks: Promise<Error[] | any[]>[] = [];

    processTargetDirs(appRootDir, mmirAppConfig, buildConfig);

    tasks.push(settingsCompiler.prepareWriteSettings(buildConfig.settings, buildConfig.settingsOptions).then(function(){
        return settingsCompiler.writeSettings(buildConfig.settings, buildConfig.settingsOptions);
    }));
    tasks.push(settingsCompiler.writeDirectoriesJson(buildConfig.directories, buildConfig.directoriesTargetDir) as Promise<any>);

    if(buildConfig.grammars.length > 0){

        // compile JSON grammars & include executables if necessary:

        console.log('start processing '+buildConfig.grammars.length+' grammars ...');

        var grammarLoadOptions = {mapping: buildConfig.grammars, config: buildConfig.grammarOptions};

        tasks.push(grammarCompiler.prepareCompile(grammarLoadOptions).then(function(){
            return grammarCompiler.compile(grammarLoadOptions);
        }).then(function(res){console.log('  completed processing grammars.'); return res;}));

    }


    if(buildConfig.views.length > 0){
        // compile view templates & include if necessary:

        console.log('start processing '+buildConfig.views.length+' views ...');
        // console.log('###### views: ',buildConfig.views);

        var viewLoadOptions = {mapping: buildConfig.views, config: buildConfig.viewOptions};

        tasks.push(viewCompiler.prepareCompile(viewLoadOptions).then(function(){
            return viewCompiler.compile(viewLoadOptions);
        }).then(function(res){console.log('  completed processing views.'); return res;}));
    }

    if(buildConfig.states.length > 0){
        // // compile SCXML models & include if necessary:

        console.log('start processing '+buildConfig.states.length+' scxml files ...');
        // console.log('###### scxml: ',buildConfig.states);

        var stateLoadOptions = {mapping: buildConfig.states, config: buildConfig.stateOptions};

        tasks.push(scxmlCompiler.prepareCompile(stateLoadOptions).then(function(){
            return scxmlCompiler.compile(stateLoadOptions);
        }).then(function(res){console.log('  completed processing scxml files.'); return res;}));
    }

    return tasks;
}

function getErrors(taskResults: Error | Array<Error | Error[] | any>): Error[] {

    if(taskResults instanceof Error){
        return [taskResults];
    }

    if(Array.isArray(taskResults)){
        return flatten(taskResults).filter(function(err){ return !!err});
    }
    return taskResults? [taskResults] : [];
}

export = {
    /**
     * @param  {[type]} mmirAppConfig app-specific configuration for mmir-lib
     */
    apply: async function(mmirAppConfig: BuildAppConfig): Promise<Error[]> {

        cliUtils.parseCli();

        mmirAppConfig = mmirAppConfig || {
            rootPath: process.cwd(),
            resourcesPath: 'www',
            controllers: false,
            helpers: false,
            models: false,
            settings: {
                configuration: false,
                speech: false
            }
        } as BuildAppConfig;
        var taskList = compileResources(mmirAppConfig);

        return promise.all(taskList).then(getErrors).catch(getErrors);
    }
};
