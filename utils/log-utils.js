"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var console = __importStar(require("console"));
function defaultLog(_message) {
    var _optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _optionalParams[_i - 1] = arguments[_i];
    }
    if (_isLog())
        console.log.apply(console, arguments);
}
function defaultWarn(_message) {
    var _optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _optionalParams[_i - 1] = arguments[_i];
    }
    if (_isWarn())
        console.error.apply(console, arguments);
}
function defaultIsLog() {
    return /^true$/.test(process.env.verbose);
}
function defaultIsWarn() {
    return true;
}
var _log = defaultLog;
var _warn = defaultWarn;
var _isLog = defaultIsLog;
var _isWarn = defaultIsWarn;
module.exports = {
    log: function (_message) {
        var _optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _optionalParams[_i - 1] = arguments[_i];
        }
        _log.apply(null, arguments);
    },
    warn: function (_message) {
        var _optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _optionalParams[_i - 1] = arguments[_i];
        }
        _warn.apply(null, arguments);
    },
    setLog: function (func) {
        _log = func;
    },
    setWarn: function (func) {
        _warn = func;
    },
    setIsLog: function (func) {
        _isLog = func;
    },
    setIsWarn: function (func) {
        _isWarn = func;
    }
};
