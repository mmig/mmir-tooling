
/**
 * Helper module for adding requirejs' module.config() functionality to webpack-modules:
 *
 * this module be injected via ProvidePlugin, so that webpack replaces calls
 *
 * module.config(module);
 *
 *  -> to something like:
 *
 * __webpack_provided_module_dot_config(module);
 *
 * NOTE: if webpack cannot statically infer the type as Module, this helper must be invoked explicitly like:
 *
 * if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
 * 	require('build-tool/module-config-helper').config(module);
 * }
 *
 */

var _conf = {};

module.exports = {
	config: function(mod){
		if(mod) {
			var id = mod.i || mod.id;
			if(_conf.config && _conf.config[id]){
				return _conf.config[id];
			}
			return {};
		}
		return _conf;
	},
	setConfig: function(c){
		_conf = c;
	}
}
