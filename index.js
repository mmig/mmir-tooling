
const path = require('path');

var createBuildConfig = require('./tools/create-build-config.js');
var createResourcesConfig = require('./tools/create-resources-config.js');

var grammarCompiler = require('./compiler/grammar-compiler.js');
var viewCompiler = require('./compiler/view-compiler.js');
var scxmlCompiler = require('./compiler/scxml-compiler.js');

// var isDisableLogging = false;

// console.log('mmir-lib: ', require('mmir-lib'))

// var rootDir = path.dirname(require.resolve('mmir-lib'));
// var toolingRootDir = __dirname;

var processTargetDirs = function(appDir, buildConfig){

	buildConfig.grammarOptions.targetDir = buildConfig.grammarOptions.targetDir || path.join(appDir, 'www', 'gen', 'grammar');
	buildConfig.viewOptions.targetDir = buildConfig.viewOptions.targetDir || path.join(appDir, 'www', 'gen', 'view');
	buildConfig.scxmlOptions.targetDir = buildConfig.scxmlOptions.targetDir || path.join(appDir, 'www', 'gen', 'scxml');
}


var compileResources = function(mmirAppConfig){

	// if(mmirAppConfig.jquery){
	// 	enableJQuery(mmirAppConfig);
	// }

	var resourcesConfig = createResourcesConfig();

	var buildConfig = createBuildConfig(mmirAppConfig, resourcesConfig);

	var appRootDir = mmirAppConfig.rootPath;

	// var moduleRules = [];

	processTargetDirs(appRootDir, buildConfig);

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
