
import * as path from 'path';
import * as fs from 'fs-extra';

import promise from './promise';

const mmirDir = path.dirname(require.resolve('mmir-lib'));

export = {
    getMmirDir: function(){
        return mmirDir;
    },
    dirExists: function(dir){
        if(fs.existsSync(dir)){
            return fs.statSync(dir).isDirectory();
        }
        return false;
    },
    isStandardTarget: function(targetDir){
        return /^mmirf$/.test(path.basename(targetDir));
    },
    getStandardTargetSubDir: function(){
        return 'mmirf/';
    },
    canCopy: function(targetDir){
        if(!fs.existsSync(targetDir)){
            return true;
        } else {
            // console.log(fs.readdirSync(targetDir));
            return fs.readdirSync(targetDir).length = 0;
        }
    },
    copyFiles: function(srcDir, targetDir, force){
        if(!fs.existsSync(srcDir)){
            return promise.reject('Source directory does not exist!');
        }
        return fs.ensureDir(targetDir).then(function(){
            return fs.copy(srcDir, targetDir, {
                overwrite: force,
                errorOnExist: !force,
                preserveTimestamps: true
            });
        });
    }
}
