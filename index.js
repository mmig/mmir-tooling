"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const array_flatten_1 = require("array-flatten");
const promise_1 = __importDefault(require("./utils/promise"));
const directories_utils_1 = __importDefault(require("./tools/directories-utils"));
const create_build_config_1 = require("./tools/create-build-config");
const create_resources_config_1 = __importDefault(require("./tools/create-resources-config"));
const grammar_compiler_1 = __importDefault(require("./compiler/grammar-compiler"));
const view_compiler_1 = __importDefault(require("./compiler/view-compiler"));
const scxml_compiler_1 = __importDefault(require("./compiler/scxml-compiler"));
const settings_compiler_1 = __importDefault(require("./compiler/settings-compiler"));
const cli_utils_1 = __importDefault(require("./utils/cli-utils"));
function getTargetDir(appConfig, mainOptions, optType) {
    return mainOptions[optType + 'Options'].targetDir || (appConfig.targetDir && path_1.default.join(appConfig.targetDir, 'gen', optType));
}
function resolveTargetDir(appDir, targetDir) {
    if (!path_1.default.isAbsolute(targetDir)) {
        return path_1.default.join(appDir, targetDir);
    }
    return targetDir;
}
function processTargetDirs(appDir, appConfig, buildConfig) {
    if (typeof buildConfig.stateOptions === 'undefined') {
        buildConfig.stateOptions = {};
    }
    if (buildConfig.grammarOptions)
        buildConfig.grammarOptions.targetDir = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'grammar') || path_1.default.join('www', 'gen', 'grammar'));
    if (buildConfig.viewOptions)
        buildConfig.viewOptions.targetDir = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'view') || path_1.default.join('www', 'gen', 'view'));
    if (buildConfig.stateOptions)
        buildConfig.stateOptions.targetDir = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'state') || path_1.default.join('www', 'gen', 'state'));
    buildConfig.directoriesTargetDir = resolveTargetDir(appDir, appConfig.directoriesTargetDir ?
        appConfig.directoriesTargetDir : appConfig.targetDir ?
        path_1.default.join(appConfig.targetDir, 'gen') : path_1.default.join('www', 'gen'));
    if (buildConfig.settingsOptions) {
        buildConfig.settingsOptions.targetDir = resolveTargetDir(appDir, appConfig.settings && appConfig.settings.targetDir ?
            appConfig.settings.targetDir : appConfig.targetDir ?
            path_1.default.join(appConfig.targetDir, 'config') : path_1.default.join('www', 'config'));
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
function checkBuildOptions(buildConfig, resType, resTypeMessage) {
    if (Array.isArray(resType)) {
        resTypeMessage = resTypeMessage || resType.join('.');
        var optName = resType.shift();
        if (buildConfig[optName] === false) {
            return;
        }
        if (!buildConfig[optName]) {
            buildConfig[optName] = {};
        }
        checkBuildOptions(buildConfig[optName], resType.length === 1 ? resType[0] : resType, resTypeMessage);
    }
    else {
        if (buildConfig[resType] !== false) {
            resTypeMessage = resTypeMessage || resType;
            if (buildConfig[resType])
                console.log('  buildOptions.' + resTypeMessage + ' not supported, ignoring the options...');
            buildConfig[resType] = false;
        }
    }
}
;
function compileResources(mmirAppConfig) {
    //set defaults specific for tooling-build
    directories_utils_1.default.setMode('file');
    mmirAppConfig.includeViewTemplates = typeof mmirAppConfig.includeViewTemplates === 'boolean' ? mmirAppConfig.includeViewTemplates : true;
    //NOTE need to check for controllers etc. so that they get included in directories.json
    // checkBuildOptions(mmirAppConfig, 'controllers');
    // checkBuildOptions(mmirAppConfig, 'helpers');
    // checkBuildOptions(mmirAppConfig, 'models');
    //NOTE need to check for config/** resources in order to include them in directories.json
    // checkBuildOptions(mmirAppConfig, ['settings', 'configuration']);
    // checkBuildOptions(mmirAppConfig, ['settings', 'grammar']);
    // checkBuildOptions(mmirAppConfig, ['settings', 'speech']);
    const resourcesConfig = create_resources_config_1.default();
    const buildConfig = create_build_config_1.createBuildConfig(mmirAppConfig, resourcesConfig);
    const appRootDir = mmirAppConfig.rootPath;
    // const moduleRules = [];
    const tasks = [];
    processTargetDirs(appRootDir, mmirAppConfig, buildConfig);
    tasks.push(settings_compiler_1.default.prepareWriteSettings(buildConfig.settings, buildConfig.settingsOptions).then(function () {
        return settings_compiler_1.default.writeSettings(buildConfig.settings, buildConfig.settingsOptions);
    }));
    tasks.push(settings_compiler_1.default.writeDirectoriesJson(buildConfig.directories, buildConfig.directoriesTargetDir));
    if (buildConfig.grammars.length > 0) {
        // compile JSON grammars & include executables if necessary:
        console.log('start processing ' + buildConfig.grammars.length + ' grammars ...');
        var grammarLoadOptions = { mapping: buildConfig.grammars, config: buildConfig.grammarOptions };
        tasks.push(grammar_compiler_1.default.prepareCompile(grammarLoadOptions).then(function () {
            return grammar_compiler_1.default.compile(grammarLoadOptions);
        }).then(function (res) { console.log('  completed processing grammars.'); return res; }));
    }
    if (buildConfig.views.length > 0) {
        // compile view templates & include if necessary:
        console.log('start processing ' + buildConfig.views.length + ' views ...');
        // console.log('###### views: ',buildConfig.views);
        var viewLoadOptions = { mapping: buildConfig.views, config: buildConfig.viewOptions };
        tasks.push(view_compiler_1.default.prepareCompile(viewLoadOptions).then(function () {
            return view_compiler_1.default.compile(viewLoadOptions);
        }).then(function (res) { console.log('  completed processing views.'); return res; }));
    }
    if (buildConfig.states.length > 0) {
        // // compile SCXML models & include if necessary:
        console.log('start processing ' + buildConfig.states.length + ' scxml files ...');
        // console.log('###### scxml: ',buildConfig.states);
        var stateLoadOptions = { mapping: buildConfig.states, config: buildConfig.stateOptions };
        tasks.push(scxml_compiler_1.default.prepareCompile(stateLoadOptions).then(function () {
            return scxml_compiler_1.default.compile(stateLoadOptions);
        }).then(function (res) { console.log('  completed processing scxml files.'); return res; }));
    }
    //TODO? impl. processing?
    // if(buildConfig.implList.length > 0){
    // 	// load & pre-process implemetation files if necessary
    // 	moduleRules.push({
    // 		test: fileUtils.createFileTestFunc(buildConfig.implList.map(function(s){return s.file;}), ' for [controller | helper | model] files'),
    // 		use: {
    // 			loader: path.resolve(toolingRootDir, 'impl', 'impl-loader.js'),
    // 			options: {mapping: buildConfig.implList},
    // 		},
    // 		type: 'javascript/auto'
    // 	});
    // }
    //TODO? settings processing?
    // var settingsFiles = buildConfig.settings.filter(function(s){return s.include === 'file';});
    // if(settingsFiles && settingsFiles.length > 0){
    //
    // 	if(!mmirAppConfig.webpackPlugins){
    // 		mmirAppConfig.webpackPlugins = [];
    // 	}
    //
    // 	mmirAppConfig.webpackPlugins.push(function(webpackInstance, alias){
    // 		return new webpackInstance.NormalModuleReplacementPlugin(
    // 			/mmirf\/settings\/(configuration|dictionary|grammar|speech)\//i,
    // 			function(resource) {
    // 				if(alias[resource.request]){
    //
    // 					// console.log('NormalModuleReplacementPlugin: redirecting resource: ', resource, ' -> ', alias[resource.request]);//DEBU
    //
    // 					// resource.request = alias[resource.request];//DISABLED hard-rewire request ... instead, add an alias resolver (see below)
    //
    // 					var ca = {};
    // 					ca[resource.request] = alias[resource.request];
    // 					resource.resolveOptions = {alias: ca};
    // 				}
    // 			}
    // 	)});
    //
    // 	moduleRules.push({
    // 		test: fileUtils.createFileTestFunc(buildConfig.settings.filter(function(s){return !_.isArray(s.file) && s.type !== 'grammar';}).map(function(s){return s.file;}), ' for [language resource] files'),
    // 		use: {
    // 			loader: 'file-loader',
    // 			options: {
    // 				name: function(file) {
    //
    // 					// var ofile = file;//DEBU
    //
    // 					var root = appRootDir;
    // 					//use relative path (from root) in target/output directory for the resouce:
    // 					if(file.indexOf(root) === 0){
    // 						file = file.substring(root.length).replace(/^(\\|\/)/, '');
    // 					}
    // 					// console.log('including [from '+root+'] dictionary file ', ofile , ' -> ', file)//DEBU
    // 					return file;
    // 				}
    // 			}
    // 		},
    // 		type: 'javascript/auto'
    // 	});
    // }
    return tasks;
}
function getErrors(taskResults) {
    if (taskResults instanceof Error) {
        return [taskResults];
    }
    if (Array.isArray(taskResults)) {
        return array_flatten_1.flatten(taskResults).filter(function (err) { return !!err; });
    }
    return taskResults ? [taskResults] : [];
}
module.exports = {
    /**
     * @param  {[type]} mmirAppConfig app-specific configuration for mmir-lib
     */
    apply: function (mmirAppConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            cli_utils_1.default.parseCli();
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
            };
            var taskList = compileResources(mmirAppConfig);
            return promise_1.default.all(taskList).then(getErrors).catch(getErrors);
        });
    }
};
