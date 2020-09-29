"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const console_1 = __importDefault(require("console"));
function defaultLog(_message, ..._optionalParams) {
    if (_isLog())
        console_1.default.log.apply(console_1.default, arguments);
}
function defaultWarn(_message, ..._optionalParams) {
    if (_isWarn())
        console_1.default.error.apply(console_1.default, arguments);
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
    log: function (_message, ..._optionalParams) {
        _log.apply(null, arguments);
    },
    warn: function (_message, ..._optionalParams) {
        _warn.apply(null, arguments);
    },
    setLog(func) {
        _log = func;
    },
    setWarn(func) {
        _warn = func;
    },
    setIsLog(func) {
        _isLog = func;
    },
    setIsWarn(func) {
        _isWarn = func;
    }
};
