
const path = require('path');

var flatten = require('array-flatten').flatten;

var Promise = require('./utils/promise.js');

var directoriesUtils = require('./tools/directories-utils.js');

var createBuildConfig = require('./tools/create-build-config.js');
var createResourcesConfig = require('./tools/create-resources-config.js');

var grammarCompiler = require('./compiler/grammar-compiler.js');
var viewCompiler = require('./compiler/view-compiler.js');
var scxmlCompiler = require('./compiler/scxml-compiler.js');
var settingsCompiler = require('./compiler/settings-compiler.js');

var cliUtils = require('./utils/cli-utils.js');

var getTargetDir = function(appConfig, mainOptions, optType){
    return mainOptions[optType+'Options'].targetDir || (appConfig.targetDir && path.join(appConfig.targetDir, 'gen', optType));
}

var resolveTargetDir = function(appDir, targetDir){
    if(!path.isAbsolute(targetDir)){
        return path.join(appDir, targetDir);
    }
    return targetDir;
}

var processTargetDirs = function(appDir, appConfig, buildConfig){

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
            appConfig.settingsOptions && appConfig.settingsOptions.targetDir?
                appConfig.settingsOptions.targetDir : appConfig.targetDir?
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
var checkBuildOptions = function(buildConfig, resType, resTypeMessage){

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

var compileResources = function(mmirAppConfig){

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

    var resourcesConfig = createResourcesConfig();

    var buildConfig = createBuildConfig(mmirAppConfig, resourcesConfig);

    var appRootDir = mmirAppConfig.rootPath;

    // var moduleRules = [];

    var tasks = [];

    processTargetDirs(appRootDir, mmirAppConfig, buildConfig);

    tasks.push(settingsCompiler.prepareWriteSettings(buildConfig.settings, buildConfig.settingsOptions).then(function(){
        return settingsCompiler.writeSettings(buildConfig.settings, buildConfig.settingsOptions);
    }));
    tasks.push(settingsCompiler.writeDirectoriesJson(buildConfig.directories, buildConfig.directoriesTargetDir));

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

var getErrors = function(taskResults){

    if(taskResults instanceof Error){
        return [taskResults.stack? taskResults.stack : taskResults];
    }

    if(Array.isArray(taskResults)){
        return flatten(taskResults).filter(function(err){ return !!err});
    }
    return taskResults? [taskResults] : [];
}

module.exports = {
    /**
     * @param  {[type]} mmirAppConfig app-specific configuration for mmir-lib
     */
    apply: function(mmirAppConfig){

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
        };
        var taskList = compileResources(mmirAppConfig);

        return Promise.all(taskList).then(getErrors).catch(getErrors);
    }
};
