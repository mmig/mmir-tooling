import * as path from 'path';
import * as fs from 'fs-extra';
import buildTools from '../index';

var mmirConfigFile = 'mmir.build.config.js';

var doBuild = function(mmirBuildConfig){
	return buildTools.apply(mmirBuildConfig).then(function(errors){
		var errMsg = errors.join('\n');
		var msg = '\n[mmir-tooling] Finished compiling resources'+(errMsg? ', with errors: ' +errMsg : '');
		console.log(msg);
		if(errMsg){
			process.exit(1);
		}
	});
};

var doLoadMmirBuildConfig = function(root){
	var configFile = path.join(root, mmirConfigFile);
	if(fs.existsSync(configFile)){
		return require(configFile);
	}
	return {};
}

module.exports = function(ctx){
	var root = ctx.opts.projectRoot;
	var mmirBuildConfig = doLoadMmirBuildConfig(root);
	if(typeof mmirBuildConfig.resourcesPath === 'undefined'){
		mmirBuildConfig.resourcesPath = path.join(root, 'www')
	}
	return doBuild(mmirBuildConfig);
};
