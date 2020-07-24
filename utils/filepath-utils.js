"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = require("fs");
var path_1 = require("path");
var reNormalize = path_1.sep !== '/' ? new RegExp(path_1.sep.replace(/\\/g, '\\\\'), 'g') : null;
var log_utils_1 = __importDefault(require("../utils/log-utils"));
var log = log_utils_1.default.log;
var normalizePath = function (path) {
    if (reNormalize) {
        path = path.replace(reNormalize, '/');
    }
    return path;
};
var createFileTestFunc = function (absolutePaths, debugStr) {
    debugStr = debugStr || '';
    var reTest = absolutePaths.map(function (absolutePath) {
        return new RegExp('^' + absolutePath.replace(/\./g, '\\.') + '$');
    });
    return function (path) {
        path = normalizePath(path);
        for (var i = 0, size = reTest.length; i < size; ++i) {
            var re = reTest[i];
            if (re.test(path)) {
                log('\ttest' + debugStr + ': ', path); //DEBUG
                return true;
            }
            ;
        }
        return false;
    };
};
var isDirectory = function (path) {
    return fs_1.lstatSync(path).isDirectory();
};
module.exports = {
    normalizePath: normalizePath,
    createFileTestFunc: createFileTestFunc,
    isDirectory: isDirectory
};
