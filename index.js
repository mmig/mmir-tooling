
const fs = require('fs')
const path = require('path');

var mkdir = require('make-dir');

var createBuildConfig = require('./tools/create-build-config.js');
var createResourcesConfig = require('./tools/create-resources-config.js');

var grammarCompiler = require('./compiler/grammar-compiler.js');
var viewCompiler = require('./compiler/view-compiler.js');
var scxmlCompiler = require('./compiler/scxml-compiler.js');

// var isDisableLogging = false;

// console.log('mmir-lib: ', require('mmir-lib'))

// var rootDir = path.dirname(require.resolve('mmir-lib'));
// var toolingRootDir = __dirname;

var getTargetDir = function(appConfig, mainOptions, optType){
	return mainOptions[optType+'Options']? mainOptions[optType+'Options'].targetDir : appConfig.targetDir && path.join(appConfig.targetDir, optType);
}

var resolveTargetDir = function(appDir, targetDir){
	if(!path.isAbsolute(targetDir)){
		return path.join(appDir, targetDir);
	}
	return targetDir;
}

var processTargetDirs = function(appDir, appConfig, buildConfig){

	buildConfig.grammarOptions.targetDir = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'grammar') || path.join('www', 'gen', 'grammar'));
	buildConfig.viewOptions.targetDir    = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'view')    || path.join('www', 'gen', 'view'));
	buildConfig.scxmlOptions.targetDir   = resolveTargetDir(appDir, getTargetDir(appConfig, buildConfig, 'scxml')   || path.join('www', 'gen', 'scxml'));

	buildConfig.settingsOptions.targetDir   = resolveTargetDir(appDir, appConfig.settingsOptions && appConfig.settingsOptions.targetDir? appConfig.settingsOptions.targetDir : appConfig.targetDir? path.join(appConfig.targetDir, 'config') : path.join('www', 'config'));
}

var writeDirectoriesJson = function(directories, targetDir){

	mkdir.sync(targetDir);
	fs.writeFile(path.join(targetDir, 'directories.json'), JSON.stringify(directories), 'utf8', function(err){
		if(err){
			console.log('ERROR writing directories.json to '+targetDir+': ', err);
		}
	})
}


var compileResources = function(mmirAppConfig){

	// if(mmirAppConfig.jquery){
	// 	enableJQuery(mmirAppConfig);
	// }

	var resourcesConfig = createResourcesConfig();

	var buildConfig = createBuildConfig(mmirAppConfig, resourcesConfig);

	var appRootDir = mmirAppConfig.rootPath;

	// var moduleRules = [];

	processTargetDirs(appRootDir, mmirAppConfig, buildConfig);

	writeDirectoriesJson(buildConfig.directories, buildConfig.settingsOptions.targetDir);

	if(buildConfig.grammars.length > 0){

		// compile JSON grammars & include executables if necessary:

		console.log('###### start processing '+buildConfig.grammars.length+' grammars ...');

		var grammarLoadOptions = {mapping: buildConfig.grammars, config: buildConfig.grammarOptions};

		grammarCompiler.prepareCompile(grammarLoadOptions);
		grammarCompiler.compile(grammarLoadOptions);

	}


	if(buildConfig.views.length > 0){
		// compile view templates & include if necessary:

		console.log('###### start processing '+buildConfig.views.length+' views ...');
		// console.log('###### views: ',buildConfig.views);

		var viewLoadOptions = {mapping: buildConfig.views, config: buildConfig.viewOptions};

		viewCompiler.prepareCompile(viewLoadOptions);
		viewCompiler.compile(viewLoadOptions);
	}

	if(buildConfig.scxmlModels.length > 0){
		// // compile SCXML models & include if necessary:

		console.log('###### start processing '+buildConfig.scxmlModels.length+' scxml files ...');
		// console.log('###### scxml: ',buildConfig.scxmlModels);

		var scxmlLoadOptions = {mapping: buildConfig.scxmlModels, config: buildConfig.scxmlOptions};

		scxmlCompiler.prepareCompile(scxmlLoadOptions);
		scxmlCompiler.compile(scxmlLoadOptions);
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

	return;//moduleRules;
}

module.exports = {
	/**
	 * @param  {[type]} mmirAppConfig app-specific configuration for mmir-lib
	 */
	apply: function(mmirAppConfig){

		compileResources(mmirAppConfig);

		// //add alias resolving:
		// var alias = createResolveAlias(mmirAppConfig);
		// if(!webpackConfig.resolve){
		// 	webpackConfig.resolve = {alias: alias};
		// } else {
		// 	if(webpackConfig.resolve.alias){
		// 		Object.assign(webpackConfig.resolve.alias, alias);
		// 	} else {
		// 		webpackConfig.resolve.alias = alias;
		// 	}
		// }

	}
};
