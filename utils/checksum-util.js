
var fs = require('fs-extra');

var mmir = require('../mmir-init.js');
var checksumUtil = mmir.require('mmirf/checksumUtils').init();

var logUtils = require('../utils/log-utils.js');
var log = logUtils.log;
var warn = logUtils.warn;

var checkUpToDate = function(jsonContent, checksumPath, targetPath, additionalInfo){

    return fs.pathExists(targetPath).then(function(exists){
        if(!exists){
            log('no compiled resource at '+targetPath);
            return false;
        }

        return fs.pathExists(checksumPath).then(function(exists){
            if(exists){

                return fs.readFile(checksumPath, 'utf8').then(function(checksumContent){

                    log('verifying checksum file at '+checksumPath+' -> ', checksumUtil.isSame(jsonContent, checksumUtil.parseContent(checksumContent), additionalInfo));
                    log('  checksum info -> ', checksumUtil.parseContent(checksumContent));
                    log('  json info -> ', checksumUtil.parseContent(checksumUtil.createContent(jsonContent, additionalInfo)));

                    return checksumUtil.isSame(jsonContent, checksumUtil.parseContent(checksumContent), additionalInfo);

                }).catch(function(err){

                    if(err){
                        warn('ERROR reading checksum file at '+checksumPath+': ', err);
                        return false;
                    }
                });

            } else {
                log('no checksum file at '+checksumPath);
            }
            return false;
        });
    });
}

module.exports = {
    upToDate: checkUpToDate,
    createContent: function(content, type){
        return checksumUtil.createContent(content, type);
    },
    getFileExt: function(){
        return checksumUtil.getFileExt();
    }
}
