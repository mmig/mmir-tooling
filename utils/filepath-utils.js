"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = require("fs");
const path_1 = require("path");
const reNormalize = path_1.sep !== '/' ? new RegExp(path_1.sep.replace(/\\/g, '\\\\'), 'g') : null;
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const normalizePath = function (path) {
    if (reNormalize) {
        path = path.replace(reNormalize, '/');
    }
    return path;
};
const createFileTestFunc = function (absolutePaths, debugStr) {
    debugStr = debugStr || '';
    const reTest = absolutePaths.map(function (absolutePath) {
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
const isDirectory = function (path) {
    return (0, fs_1.lstatSync)(path).isDirectory();
};
module.exports = {
    normalizePath: normalizePath,
    createFileTestFunc: createFileTestFunc,
    isDirectory: isDirectory
};
