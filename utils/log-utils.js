
var console = require('console');

function defaultLog(){
	if(_isLog())	console.log.apply(console, arguments);
}

function defaultWarn(){
	if(_isWarn()) console.error.apply(console, arguments);
}

function defaultIsLog(){
	return process.env.verbose;
}

function defaultIsWarn(){
	return true;
}

var _log = defaultLog;
var _warn = defaultWarn;
var _isLog = defaultIsLog;
var _isWarn = defaultIsWarn;

module.exports = {
	log: function(){
		_log.apply(null, arguments);
	},
	warn: function(){
		_warn.apply(null, arguments);
	},
	setLog(func){
		_log = func;
	},
	setWarn(func){
		_warn = func;
	},
	setIsLog(func){
		_isLog = func;
	},
	setIsWarn(func){
		_isWarn = func;
	}
}
