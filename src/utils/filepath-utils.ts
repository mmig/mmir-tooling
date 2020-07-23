import { lstatSync } from 'fs';
import { sep } from 'path';
var reNormalize = sep !== '/' ? new RegExp(sep.replace(/\\/g, '\\\\'), 'g') : null;

import logUtils from '../utils/log-utils';
var log = logUtils.log;

var normalizePath = function(path) {
    if (reNormalize) {
        path = path.replace(reNormalize, '/');
    }
    return path;
}

var createFileTestFunc = function(absolutePaths, debugStr){

    debugStr = debugStr || '';

    var reTest = absolutePaths.map(function(absolutePath) {
        return new RegExp('^' + absolutePath.replace(/\./g, '\\.') + '$');
    });

    return function(path) {
        path = normalizePath(path);
        for (var i = 0, size = reTest.length; i < size; ++i) {
            var re = reTest[i];
            if (re.test(path)) {
                log('\ttest'+debugStr+': ', path); //DEBUG
                return true;
            };
        }
        return false;
    };
}

var isDirectory = function(path){
    return lstatSync(path).isDirectory();
}

export = {
    normalizePath: normalizePath,
    createFileTestFunc: createFileTestFunc,
    isDirectory: isDirectory
};
