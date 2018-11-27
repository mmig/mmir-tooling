/*
 * generates (strigified) module code from app-specific configruation:
 *  * additional/replaced modules/module-paths
 *  * included (optional) modules/functionality
 */

var path = require('path');

/**
 * [description]
 * @param  {PlainObject} mmirAppConfig JSON-like configuration object:
 * 							mmirAppConfig.config: module configuration object (analogous to requirejs module configuration)
 * 							mmirAppConfig.paths: mapping of module names to file-paths (additional or overwriting implemenation of existing modules)
 * @return {string} stringified module code
 */
var generateFromAppConfig = function(mmirAppConfig){

	var moduleImplStr = '';
	var moduleExportsStr = '';
	if(mmirAppConfig){

		var moduleExports = [];
		if(mmirAppConfig.config) {
			moduleImplStr += 'var appConfig = ' + JSON.stringify([{config: mmirAppConfig.config}], null, 2) + ';\n';
			moduleExports.push(['configList', 'appConfig']);
			// console.log('app config module -> appConfig: ', moduleImplStr);
		}

		if(mmirAppConfig.includeModules) {
			// ['asyncGrammar'] -> 'var doIncludeModules = function(){\n  require.resolve("mmirf/asyncGrammar");\n};\n';

			var rePrefix = /^mmirf\//;
			moduleImplStr += 'var doIncludeModules = function(){\n' +
						mmirAppConfig.includeModules.map(function(incl){
							incl = rePrefix.test(incl)? incl : 'mmirf/' + incl;
							return '  require.resolve("'+incl+'");'
						}).join('\n') +
				'\n};\n';

			moduleExports.push(['applyIncludes', 'doIncludeModules']);
			// console.log('app config module -> includeModules: ', moduleImplStr);
		}

		moduleExportsStr = moduleExports.length > 0?
			'{' + (moduleExports.map(
					function(pairs){
						return pairs[0] +': ' + pairs[1];
					})).join(',\n')+
			'};' : 'false;';

	} else {

		moduleExportsStr = 'false;';
	}

	// console.log('app config module exports: ', moduleExportsStr);

	return moduleImplStr + '\nmodule.exports=' + moduleExportsStr;
}

/**
 * add/overwrite module alias (i.e. mapping module ID to file path)
 *
 * @param  {{paths?: {[moduleId: string]: string}}} mmirAppConfig the app-specific configuration: applies module-path-specifications from mmirAppConfig.paths
 * @param  {[{[moduleId: string]: string}]} alias the (default) mapping of module IDs to (absolute) paths
 */
var addAliasFrom = function(mmirAppConfig, alias){

	if(mmirAppConfig && mmirAppConfig.paths){
		// console.log('adding/overwriting paths with app paths: ', mmirAppConfig.paths);
		// Object.assign(alias, mmirAppConfig.paths);
		var appRoot = mmirAppConfig.rootPath || process.cwd();
		var p;
		for (var n in mmirAppConfig.paths) {
			p = mmirAppConfig.paths[n];
			alias[n] = path.isAbsolute(p)? p : path.join(appRoot, p);
			// aliasList.push(n);
		}
		// console.log('set paths to -> ', alias);
	}

}

module.exports = {
	generateModuleCode: generateFromAppConfig,
	addAliasFrom: addAliasFrom
}
