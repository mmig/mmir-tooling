const path = require('path');
const webpack = require('webpack');
// // const CopyWebpackPlugin = require('copy-webpack-plugin');
//
// // ---------------------------------------
// var paths = require('./webpack-resources-paths.js').paths;
//
// var alias = {};
// // var aliasList = [];
// for (var n in paths) {
// 	alias[n] = path.join(__dirname, paths[n]);
// 	// aliasList.push(n);
// }
//
// // var AddToContextPlugin = require('./webpack-plugin-add-to-context.js');
// var ReplaceModuleIdPlugin = require('./webpack-plugin-replace-id.js');
//
// // ---------------------------------------
//
// //convert shims
// var shims = [
// 	//Shim Examples
// 	// {
// 	//   test: /handlebars/,
// 	//   use: [
// 	//     'imports-loader?this=>window',
// 	//     'exports-loader?Handlebars'
// 	//   ]
// 	// },
// 	// {
// 	//   test: /jquery\-1\.9\.1\.js/,
// 	//   use: [
// 	//     'imports-loader?this=>window',
// 	//     'exports-loader?jQuery'
// 	//   ]
// 	// },
// 	// {
// 	//   test: /backbone/,
// 	//   use: [
// 	//     'expose-loader?Backbone',
// 	//     'imports-loader?this=>window,jquery,underscore'
// 	//   ]
// 	// },
// 	// {
// 	//   test: /underscore/,
// 	//   loader: 'expose-loader?_' },
// 	// {
// 	//   test: /chaplin/,
// 	//   loader: 'imports-loader?this=>window,backbone'
// 	// },
//
//
// 	// {
// 	//   test: /main\.js/,
// 	//   use: [
// 	//     'imports-loader?webpackMmirConfig=build-tool/webpack-helper-module-config,logger=mmirf/logger',
// 	//     'exports-loader?window.mmir'
// 	//   ]
// 	// },
// 	// {
// 	//   test: /core\.js/,
// 	//   use: [
// 	//     'imports-loader?moduleConfigHelper=build-tool/module-config-helper',
// 	//     'exports-loader?window.mmir'
// 	//   ]
// 	// },
//
// 	// {
// 	// 	test: /worker\.js$/i,
// 	// 	use: {
// 	// 		loader: 'worker-loader',
// 	// 		options: {}//{inline: true}
// 	// 	}
// 	// },
//
// 	{
// 		test: /\.(mp3)$/,
// 		use: {
// 			loader: 'file-loader',
// 			options: {
// 				name: '[path][name].[ext]',//'[name].[ext]'
// 				// outputPath: '../assets/mmirf/vendor/sounds/' //'../assets/'
// 			}
// 		}
// 	}
// ];

var webpackConfig = {
	mode: 'none',
	entry: './webpack-main.js', //'./main.js',
	// resolve: {
	// 	alias: alias
	// },
	// resolveLoader: {
	// 	moduleExtensions: ["-loader"]
	// },
	// module: {
	// 	rules: shims
	// },
	// plugins: [
	// 	new webpack.ProvidePlugin({
	// 		'module.config': ['build-tool/module-config-helper', 'config'],
	// 	}),
	// 	new webpack.IgnorePlugin(/^xmlhttprequest$/),
	// 	// new AddToContextPlugin(aliasList),
	// 	new ReplaceModuleIdPlugin(alias),
	// 	// new CopyWebpackPlugin([
	// 	// 	// { from: 'workers/*', to: 'mmirf' },
	// 	// 	{
	// 	// 		from: 'vendor/sounds/*',
	// 	// 		to: 'mmirf'
	// 	// 	},
	// 	// ]) //, options)
	// ],
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		library: "mmir-lib",
		libraryTarget: "umd"
	}
};

const mmirAppConfig = void(0);//FIXME from commandline argument/env-var ...?

// require('./webpack-worker-loader-config').apply(webpackConfig);
require('./webpack-config-apply').apply(webpack, webpackConfig, mmirAppConfig);

module.exports = webpackConfig;
