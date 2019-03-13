
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

var fileUtils = require('./utils/filepath-utils.js');

var createBuildConfig = require('./tools/create-build-config.js');
var createResourcesConfig = require('./tools/create-resources-config.js');

// var isDisableLogging = false;

// console.log('mmir-lib: ', require('mmir-lib'))

var rootDir = path.dirname(require.resolve('mmir-lib'));

var toolingRootDir = __dirname;

var createModuleRules = function(mmirAppConfig){

	// if(mmirAppConfig.jquery){
	// 	enableJQuery(mmirAppConfig);
	// }

	var resourcesConfig = createResourcesConfig();

	var buildConfig = createBuildConfig(mmirAppConfig, resourcesConfig);

	var appRootDir = mmirAppConfig.rootPath;

	// var mmirAppConfigContent = appConfigUtils.generateModuleCode(mmirAppConfig);
	// var appConfigModulePath = fileUtils.normalizePath(path.join(toolingRootDir, 'runtime', 'webpackModuleInit.js'));

	// console.log('###### creating module webpack-app-module-config.js with contents: '+ JSON.stringify(mmirAppConfigContent));

	var binFilePaths = resourcesConfig.fileResources.map(function(val){
		return fileUtils.normalizePath(path.isAbsolute(val)? val : path.join(rootDir, val));
	});

	//console.log('###### including as raw files: '+ binFilePaths);

	var textFilePaths = resourcesConfig.textResources.map(function(val){
		return fileUtils.normalizePath(path.isAbsolute(val)? val : path.join(rootDir, val));
	});

	// console.log('###### including as text files: '+ textFilePaths);

	var fileResourcesPathMap = resourcesConfig.resourcesPaths;

	var moduleRules = [

		// handle binary files (e.g. *.mp3):
		{
			test: fileUtils.createFileTestFunc(binFilePaths, ' for [raw file]'),
			use: {
				loader: 'file-loader',
				options: {
					name: function(file) {

						if(fileResourcesPathMap && fileResourcesPathMap[fileUtils.normalizePath(file)]){

							//if there is an explicit mapping entry, use the entry:
							console.log('  including [raw file] from plugin, remapping include-path "'+file+'" -> ', fileResourcesPathMap[fileUtils.normalizePath(file)]);
							file = fileResourcesPathMap[fileUtils.normalizePath(file)];

						} else if(file.indexOf(rootDir) === 0){

							//use relative path path (from mmir-lib root) in target/output directory for the resouce:
							console.log('  including [raw file], remapping include-path "'+file+'" -> ', file.substring(rootDir.length).replace(/^(\\|\/)/, ''));
							file = file.substring(rootDir.length).replace(/^(\\|\/)/, '');

						} else {
							//otherwise: include as bare file-name
							console.log('  including [raw file] remapping include-path "'+file+'" -> ', path.basename(file));
							file = path.basename(file);
						}

						//do normalize path-separators to '/' for proper usage in JS code -> "var url = require(<file resource>)"
						return fileUtils.normalizePath(file);
					}
				}
			}
		},

		// // creates a module implementation for the app-config:
		// {
		// 	test: fileUtils.createFileTestFunc([appConfigModulePath], ' for [app config]'),
		// 	use: {
		// 		loader: 'val-loader',
		// 		options: {
    //       appConfigCode: mmirAppConfigContent
    //     }
		// 	}
		// },

		// handle/include "raw" text files:
		{
			test: fileUtils.createFileTestFunc(textFilePaths, ' for [text files]'),
			use: {
				loader: 'raw-loader'
			}
		}

	];

	if(buildConfig.grammars.length > 0){

		// // compile JSON grammars & include executables if necessary:
		// moduleRules.push({
		// 	test: fileUtils.createFileTestFunc(buildConfig.grammars.map(function(g){return g.file;}), ' for [grammar] files'),
		// 	use: {
		// 		loader: path.resolve(toolingRootDir, 'grammar', 'grammar-loader.js'),
		// 		options: {mapping: buildConfig.grammars, config: buildConfig.grammarOptions},
		// 	},
		// 	type: 'javascript/auto'
		// });

		var grammarGen = require('./grammar/grammar-gen.js');
		var grammarLoadOptions = {mapping: buildConfig.grammars, config: buildConfig.grammarOptions};
		grammarGen.initPendingAsyncGrammarInfo(grammarLoadOptions);
		var writeGrammar = function(err, grammarCode, _map, meta){
			if(err){
				console.log('ERROR compiling grammar '+g.file+': ', err);
				return;
			}
			console.log('###### TODO write compiled grammar to file (length '+grammarCode.length+') ', meta);
		};
		buildConfig.grammars.forEach(g => {

			fs.readFile(g.file, 'utf8', function(err, content){
				if(err){
					console.log('ERROR compiling grammar '+g.file+': ', err);
					return;
				}
				grammarGen.compile(content, g.file, grammarLoadOptions, writeGrammar, null, g);
			});
		});
	}


	if(buildConfig.views.length > 0){
		// compile view templates & include if necessary:
		moduleRules.push({
			test: fileUtils.createFileTestFunc(buildConfig.views.map(function(v){return v.file;}), ' for [view] files'),
			use: {
				loader: path.resolve(toolingRootDir, 'view', 'view-loader.js'),
				options: {mapping: buildConfig.views},
			},
			type: 'javascript/auto'
		});
	}

	if(buildConfig.scxmlModels.length > 0){
		// compile SCXML models & include if necessary:
		moduleRules.push({
			test: fileUtils.createFileTestFunc(buildConfig.scxmlModels.map(function(s){return s.file;}), ' for [scxml] files'),
			use: {
				loader: path.resolve(toolingRootDir, 'scxml', 'scxml-loader.js'),
				options: {mapping: buildConfig.scxmlModels, ignoreErrors: buildConfig.scxmlOptions && buildConfig.scxmlOptions.ignoreErrors},
			},
			type: 'javascript/auto'
		});
	}
	//FIXME TODO: else include default/minimal state engines

	if(buildConfig.implList.length > 0){
		// load & pre-process implemetation files if necessary
		moduleRules.push({
			test: fileUtils.createFileTestFunc(buildConfig.implList.map(function(s){return s.file;}), ' for [controller | helper | model] files'),
			use: {
				loader: path.resolve(toolingRootDir, 'impl', 'impl-loader.js'),
				options: {mapping: buildConfig.implList},
			},
			type: 'javascript/auto'
		});
	}

	var settingsFiles = buildConfig.settings.filter(function(s){return s.include === 'file';});
	if(settingsFiles && settingsFiles.length > 0){

		if(!mmirAppConfig.webpackPlugins){
			mmirAppConfig.webpackPlugins = [];
		}

		mmirAppConfig.webpackPlugins.push(function(webpackInstance, alias){
			return new webpackInstance.NormalModuleReplacementPlugin(
				/mmirf\/settings\/(configuration|dictionary|grammar|speech)\//i,
				function(resource) {
					if(alias[resource.request]){

						// console.log('NormalModuleReplacementPlugin: redirecting resource: ', resource, ' -> ', alias[resource.request]);//DEBU

						// resource.request = alias[resource.request];//DISABLED hard-rewire request ... instead, add an alias resolver (see below)

						var ca = {};
						ca[resource.request] = alias[resource.request];
						resource.resolveOptions = {alias: ca};
					}
				}
		)});

		moduleRules.push({
			test: fileUtils.createFileTestFunc(buildConfig.settings.filter(function(s){return !_.isArray(s.file) && s.type !== 'grammar';}).map(function(s){return s.file;}), ' for [language resource] files'),
			use: {
				loader: 'file-loader',
				options: {
					name: function(file) {

						// var ofile = file;//DEBU

						var root = appRootDir;
						//use relative path (from root) in target/output directory for the resouce:
						if(file.indexOf(root) === 0){
							file = file.substring(root.length).replace(/^(\\|\/)/, '');
						}
						// console.log('including [from '+root+'] dictionary file ', ofile , ' -> ', file)//DEBU
						return file;
					}
				}
			},
			type: 'javascript/auto'
		});
	}

	return moduleRules;
}

module.exports = {
	/**
	 * @param  {[type]} mmirAppConfig app-specific configuration for mmir-lib
	 */
	apply: function(mmirAppConfig){

		//add loader configurations:
		// (NOTE must do this before creating alias definition as some loaders may add alias mappings to mmirAppConfig)
		var moduleRules = createModuleRules(mmirAppConfig);

    console.log(moduleRules);

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
