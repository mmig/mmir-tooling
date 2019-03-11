var path = require('path');
var fileUtils = require('./utils/filepath-utils.js');

var createWebWorkerLoaderConfig = function(rootDir){

	var webworkerPaths = require('./webpack-resources-paths.js').workers.map(function(val){
		return fileUtils.normalizePath(path.isAbsolute(val)? val : path.join(rootDir, val));
	});


	// console.log('webworkerPaths: ', webworkerPaths);

	var testWebWorkerFunc = fileUtils.createFileTestFunc(webworkerPaths, ' for [web worker]');

	return {
		test: testWebWorkerFunc,
		use: {
			loader: 'worker-loader',
			options: { name: 'worker-[name].[hash].js' }
		}
	};
}

module.exports = {
	config: null,
	apply: function(webpackConfig, rootDir, useRulesForLoaders) {
		var webWorkerLoaderConfig = createWebWorkerLoaderConfig(rootDir);
		this.config = webWorkerLoaderConfig;
		webpackConfig = webpackConfig || {};
		if (!webpackConfig.module) {
			webpackConfig.module = {};
		}
		var targetList = webpackConfig.module.rules || (useRulesForLoaders ? null : webpackConfig.module.loaders);
		if (!targetList) {
			targetList = [];
			webpackConfig.module[useRulesForLoaders ? 'rules' : 'loaders'] = targetList;
		}
		var doAdd = true;
		var size = targetList.length;
		if (size > 0) {
			for (var i = 0; i < size; ++i) {
				var c = targetList[i];
				if (c && c.test === webWorkerLoaderConfig.test) {
					doAdd = false;
					break;
				}
			}
		}
		if (doAdd) {
			targetList.push(webWorkerLoaderConfig);
		}
		return webpackConfig;
	}
};
