
import { lstatSync } from 'fs';
import { sep } from 'path';

const reNormalize = sep !== '/' ? new RegExp(sep.replace(/\\/g, '\\\\'), 'g') : null;

import logUtils from '../utils/log-utils';
const log = logUtils.log;

const normalizePath = function(path: string): string {
    if (reNormalize) {
        path = path.replace(reNormalize, '/');
    }
    return path;
}

const createFileTestFunc = function(absolutePaths: string[], debugStr?: string): (path: string) => boolean {

    debugStr = debugStr || '';

    const reTest = absolutePaths.map(function(absolutePath) {
        return new RegExp('^' + absolutePath.replace(/\./g, '\\.') + '$');
    });

    return function(path: string): boolean {
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

const isDirectory = function(path: string): boolean {
    return lstatSync(path).isDirectory();
}

export = {
    normalizePath: normalizePath,
    createFileTestFunc: createFileTestFunc,
    isDirectory: isDirectory
};
