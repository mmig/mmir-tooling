
// var _modPaths = require('./webpack-resources-paths.js').paths;

var _conf = {};

//DISABLED: using webpack-plugin-replace-id.js instead for setting custom/own module IDs during compile time
// var _cleanStart = /^\.\//;
// var _cleanEnd = /\.js$/i;
//
// function normalizePath(mod){
// 	return ((mod.i || mod.id) + '').replace(_cleanStart, '').replace(_cleanEnd, '');
// }
//
// function getModId(path){
// 	if(_modPaths[path]){
// 		return path;
// 	}
// 	for(var p in _modPaths){
// 		if(_modPaths[p] === path){
// 			return p;
// 		}
// 	}
// }

module.exports = {
	config: function(mod){
		if(mod) {
			// var path = normalizePath(mod);
			var id = mod.i || mod.id;// getModId(path);
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
