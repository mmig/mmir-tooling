const path = require('path');
const webpack = require('webpack');

var webpackConfig = {
	mode: 'none',
	entry: './webpack-main.js', //'./main.js',
	// resolve: {
	// 	alias: alias
	// },
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		library: "mmir-lib",
		libraryTarget: "umd"
	}
};

//FIXME TEST
// const mmirAppConfig = void(0);//FIXME from commandline argument/env-var ...?

//FIXME TEST grammar options
var grammarOptions = {
	directory: './config/languages',
	engine: 'pegjs',
	grammars: {
		ja: {ignore: true},
		de: {exclude: true},
		en: {engine: 'jison', async: true},

		//specifying JSON grammar files directly
		testing: {engine: 'jscc', file: path.resolve('./config/languages/de/grammar.json')},
		testing2: {id: '!id warning!', engine: 'jison', file: path.resolve('./config/languages/de/grammar.json_large-example')}
		// testing_id_collision TODO : {engine: 'jison', file: path.resolve('./config/languages/de/grammar.json_large-example')}

	}
};
//FIXME TEST view options
var viewOptions = {
	directory: './views',
}

//FIXME TEST app-configuratin
const mmirAppConfig = {
	grammars: grammarOptions,
	views: viewOptions,
	// includeModules: ['mmirf/jsccGen']
};

// require('./webpack-worker-loader-config').apply(webpackConfig);
require('./webpack-config-apply').apply(webpack, webpackConfig, mmirAppConfig);

module.exports = webpackConfig;
