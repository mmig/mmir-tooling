"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const lodash_1 = __importDefault(require("lodash"));
var mmirModuleBaseConfig = lodash_1.default.cloneDeep(require('mmir-lib/lib/modulesBaseConfig'));
// //remove paths that match the ID from mmir base paths:
// var removePathsList = ['jquery'];
//
// //NOTE: non-absolute paths will be resolved against the mmir-lib package's path
//
// var customPaths = {
//
// 	'mmirf/scion': 'vendor/libs/scion-amd-mod',
// 	'mmirf/simpleViewEngine': 'env/view/stubViewEngine',
// 	//use non-jQuery utils by default:
// 	'mmirf/util': 'tools/util_purejs',
//
// 	'mmirf/util/resourceLoader': path.resolve(__dirname, 'runtime', 'webpackLoadFile'),
//
// 	'build-tool/module-config-helper':         path.resolve(__dirname, 'runtime', 'moduleConfigImpl'),
// 	'build-tool/webpack-helper-module-config': path.resolve(__dirname, 'runtime', 'webpackModuleUtils'),
// 	'build-tool/webpack-app-config':           path.resolve(__dirname, 'runtime', 'webpackModuleInit')
// };
//
// var paths = mmirModuleBaseConfig.paths;
// log('############## mmir module paths for webpack build: ', paths);
var defaultResourcesConfig = {
    paths: null,
    // paths for web worker entry points (i.e. new Worker(<path>)):
    workers: [
        'workers/scionQueueWorker.js',
        'workers/asyncGrammarWorker.js',
        'workers/jisonCompiler.js',
        'workers/jsccCompiler.js',
        'workers/pegjsCompiler.js'
    ],
    //paths for "raw" files that will be included as-is (i.e. copied)
    fileResources: [
        'vendor/sounds/beep-notification.mp3',
        'vendor/styles/simpleViewLayout.css',
        'vendor/styles/stdlne-wait-dlg.css'
    ],
    //path for text resources
    textResources: [
        'env/grammar/grammarTemplate_reduced.tpl'
    ],
    //path mappings for copied files etc (i.e. will be included/copied to the specified relative file path/name)
    resourcesPaths: {}
};
function applyRemovePaths(paths, removePathsList) {
    removePathsList.forEach(function (entry) {
        delete paths[entry];
    });
}
function applyCustomPaths(paths, customPaths) {
    for (var n in customPaths) {
        paths[n] = customPaths[n];
    }
}
/**
 * create config for mmir resources:
 *
 *  * paths: the mapping moduleID -> resourcePath (combined default mmir paths & removePathsList & customPaths)
 *  * workers: list of resourcePaths that are entry points for WebWorkers
 *  * fileResources: list of resourcePaths that refer to "raw"/binary files (e.g. mp3 audio, css stylesheets)
 *  * textResources: list of resourcePaths that refer to plain text files
 *  * resourcesPaths: mapping for resourcePaths {[sourcePath: string]: TargetPath}, i.e. specifies replacement of source-file by the traget-file
 *
 * @param  {Array<string>} [removePathsList] list of module IDs that will be removed from the mmir paths mapping
 * @param  {{[moduleId: string]: string}} [customPaths] mapping of additional/overriding module IDs to URI/paths
 * @return {ResourcesConfig} the resource config object
 */
function createResourcesConfig(removePathsList, customPaths) {
    var paths = lodash_1.default.cloneDeep(mmirModuleBaseConfig.paths);
    if (removePathsList) {
        applyRemovePaths(paths, removePathsList);
    }
    if (customPaths) {
        applyCustomPaths(paths, customPaths);
    }
    var resConfig = lodash_1.default.cloneDeep(defaultResourcesConfig);
    resConfig.paths = paths;
    return resConfig;
}
module.exports = createResourcesConfig;
