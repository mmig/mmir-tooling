
var loaderUtils = require('loader-utils');
var fileUtils = require('../webpack-filepath-utils.js');

var mmir = require('../mmir-init.js');
var Controller = mmir.require('mmirf/controller');

///////////////////////////////////////////////////////////////////////////////

function getCtrl(viewInfo){
	var name = viewInfo.ctrlName;
	var constr = function(){};
	var def = {
		views: [],
		partials: [],
		layout: null
	};
	try {
		return new Controller(name, def, constr);
	} catch(err) {
		console.log('WARN: deprecated Controller implementation, using context (ctx) instead of instance constructor...');
		var ctx = {};
		ctx[name] = constr;
		return new Controller(name, def, ctx);
	}
}
///////////////////////////////////////////////////////////////////////////////

module.exports = function(content, map, meta) {

	var callback = this.async();

	var options = loaderUtils.getOptions(this) || {};
	// console.log('mmir-view-loader: options -> ', options);//DEBU
	if(!options || !options.mapping){
		callback('failed to parse view template: missing list for view settings [{id: "the ID", file: "the file path", ...}, ...]');
		return;/////////////// EARLY EXIT /////////////////
	}

	var viewFile = fileUtils.normalizePath(this.resource);
	// console.log('mmir-view-loader: resource -> ', viewFile);//DEBU
	var i = options.mapping.findIndex(function(v){
		return v.file === viewFile;
	});
	var viewInfo = options.mapping[i];

	if(!viewInfo || !viewInfo.id){
		var error;
		if(options.mapping.length === 0){
			error = 'failed to parse view template: empty list for grammar settings [{id: "the ID", file: "the file path", ...}, ...]';
		}
		else if(i === -1 || !viewInfo){
			error = 'failed to parse view template: could not find settings for grammar in grammar-settings list: '+JSON.stringfy(options.mapping);
		} else if(!viewInfo.id){
			error = 'failed to parse view template: missing field id for grammar: '+JSON.stringfy(viewInfo);
		} else {
			error = 'failed to parse view template: invalid grammar settings in list: '+JSON.stringfy(options.mapping);
		}
		callback(error);
		return;/////////////// EARLY EXIT /////////////////
	}

	// console.log('mmir-view-loader: resource ID at '+i+' -> ', viewInfo.id);//DEBU
	// callback(null, 'console.log("######################### testing: '+viewInfo.id+'!");module.exports={}', map, meta);//FIXME TEST
	// return;

	var viewConstr = mmir.require(viewInfo.viewImpl);
	var viewInstance;
	if(viewInfo.isLayout){
		viewInstance = new viewConstr(viewInfo.viewName, content);
	} else {
		var ctrl = getCtrl(viewInfo);
		// console.log('mmir-view-loader: creating view "'+viewInfo.viewName+'" for controller "'+viewInfo.ctrlName+'" -> ', ctrl);//DEBU
		viewInstance = new viewConstr(ctrl, viewInfo.viewName, content);
	}

	callback(null, '\n' + viewInstance.stringify() + '\n', map, meta);//FIXME TEST
	return;
};
