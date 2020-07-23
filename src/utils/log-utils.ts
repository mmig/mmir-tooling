
import * as console from 'console';

function defaultLog(_message?: any, ..._optionalParams: any[]): void {
	if(_isLog())	console.log.apply(console, arguments);
}

function defaultWarn(_message?: any, ..._optionalParams: any[]): void{
	if(_isWarn()) console.error.apply(console, arguments);
}

function defaultIsLog(): boolean {
	return /^true$/.test(process.env.verbose);
}

function defaultIsWarn(): boolean {
	return true;
}

var _log = defaultLog;
var _warn = defaultWarn;
var _isLog = defaultIsLog;
var _isWarn = defaultIsWarn;

export = {
	log: function(_message?: any, ..._optionalParams: any[]): void {
		_log.apply(null, arguments);
	},
	warn: function(_message?: any, ..._optionalParams: any[]): void {
		_warn.apply(null, arguments);
	},
	setLog(func: (_message?: any, ..._optionalParams: any[]) => void){
		_log = func;
	},
	setWarn(func: (_message?: any, ..._optionalParams: any[]) => void){
		_warn = func;
	},
	setIsLog(func: () => boolean){
		_isLog = func;
	},
	setIsWarn(func: () => boolean){
		_isWarn = func;
	}
}
