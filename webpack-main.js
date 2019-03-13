
//bootstrapping for webpack

require('build-tool/webpack-helper-module-config');

var appConfig = require('build-tool/webpack-app-config');
require('build-tool/webpack-helper-module-config').init(appConfig);

if(appConfig.applyAutoPreloads){
	appConfig.applyAutoPreloads();
}

//trigger initialization
require('mmirf/logger');
require('mmirf/main');
module.exports = require('mmirf/core');

if(appConfig.applyIncludes){
	appConfig.applyIncludes();
}

if(appConfig.applyAutoLoads){
	appConfig.applyAutoLoads();
}

if(appConfig.jqueryInit){
	appConfig.jqueryInit();
}
