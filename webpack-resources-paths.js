
var path = require('path');
var mmirModuleBaseConfig = require('mmir-lib/modulesBaseConfig');

var webpackRemovedPaths = ['jquery'];

var webpackDefaultPaths = {
	'mmirf/scion': 'vendor/libs/scion-amd-mod.min.pp',
	'mmirf/simpleViewEngine': 'env/view/stubViewEngine',
	//FIXME add package util as path:
	'mmirf/util': 'tools/util_purejs',

	//FIXME replace in mmir-lib?
	'mmirf/antlr3':         path.resolve(__dirname, 'viewParser/antlr3-all_amd'),
	'mmirf/ES3Lexer':       path.resolve(__dirname, 'viewParser/ES3Lexer_amd'),
	'mmirf/ES3Parser':      path.resolve(__dirname, 'viewParser/ES3Parser_amd'),
	'mmirf/scriptLexer':    path.resolve(__dirname, 'viewParser/MmirScriptLexer_amd'),
	'mmirf/scriptParser':   path.resolve(__dirname, 'viewParser/MmirScriptParser_amd'),
	'mmirf/contentLexer':   path.resolve(__dirname, 'viewParser/MmirScriptContentLexer_amd'),
	'mmirf/contentParser':  path.resolve(__dirname, 'viewParser/MmirScriptContentParser_amd'),
	'mmirf/templateLexer':  path.resolve(__dirname, 'viewParser/MmirTemplateLexer_amd'),
	'mmirf/templateParser': path.resolve(__dirname, 'viewParser/MmirTemplateParser_amd'),

	'mmirf/util/resourceLoader': path.resolve(__dirname, 'webpack-loadFile'),

	'build-tool/module-config-helper':         path.resolve(__dirname, 'module-config-helper'),
	'build-tool/webpack-helper-module-config': path.resolve(__dirname, 'webpack-helper-module-config'),
	'build-tool/webpack-app-config':           path.resolve(__dirname, 'webpack-app-module-config')
};

// delete mmirModuleBaseConfig.shim;

var paths = mmirModuleBaseConfig.paths;
webpackRemovedPaths.forEach(function(entry){
	delete paths[entry];
});

for(var n in webpackDefaultPaths){
	paths[n] = webpackDefaultPaths[n];
}

// console.log('############## mmir module paths for webpack build: ', paths);

var webpackModuleConfig = {
	paths: paths,

	// paths for web worker entry points (i.e. new Worker(<path>)):
	workers: [
		'workers/ScionQueueWorker.js',
		'workers/asyncGrammarWorker.js',
		'workers/jisonCompiler.js',
		'workers/jsccCompiler.js',
		'workers/pegjsCompiler.js'
	],
	fileResources: [
		'vendor/sounds/beep-notification.mp3',
		'vendor/styles/simpleViewLayout.css',
		'vendor/styles/stdlne-wait-dlg.css'
	],
	textResources: [
		'env/grammar/grammarTemplate_reduced.tpl'
	]
}

module.exports = webpackModuleConfig;
