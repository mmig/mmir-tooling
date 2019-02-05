
var path = require('path');
var mmirModuleBaseConfig = require('mmir-lib/modulesBaseConfig');

var webpackRemovedPaths = ['jquery'];

var webpackDefaultPaths = {
	'mmirf/scion': 'vendor/libs/scion-amd-mod.min.pp',
	'mmirf/simpleViewEngine': 'env/view/stubViewEngine',
	//FIXME add package util as path:
	'mmirf/util': 'tools/util_purejs',

	//FIXME replace in mmir-lib?
	'mmirf/antlr3':         path.resolve('viewParser/antlr3-all_amd'),
	'mmirf/ES3Lexer':       path.resolve('viewParser/ES3Lexer_amd'),
	'mmirf/ES3Parser':      path.resolve('viewParser/ES3Parser_amd'),
	'mmirf/scriptLexer':    path.resolve('viewParser/MmirScriptLexer_amd'),
	'mmirf/scriptParser':   path.resolve('viewParser/MmirScriptParser_amd'),
	'mmirf/contentLexer':   path.resolve('viewParser/MmirScriptContentLexer_amd'),
	'mmirf/contentParser':  path.resolve('viewParser/MmirScriptContentParser_amd'),
	'mmirf/templateLexer':  path.resolve('viewParser/MmirTemplateLexer_amd'),
	'mmirf/templateParser': path.resolve('viewParser/MmirTemplateParser_amd'),

	'build-tool/module-config-helper': 'module-config-helper',
	'build-tool/webpack-helper-module-config': 'webpack-helper-module-config',
	'build-tool/webpack-app-config': 'webpack-app-module-config'
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
