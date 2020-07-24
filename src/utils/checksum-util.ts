
import { MmirModule, ChecksumUtils } from 'mmir-lib';

import fs from 'fs-extra';

import * as mmir from '../mmir-init';
const checksumUtil: ChecksumUtils = (mmir as MmirModule).require('mmirf/checksumUtils').init();

import logUtils from '../utils/log-utils';
const log = logUtils.log;
const warn = logUtils.warn;

async function checkUpToDate(jsonContent: string, checksumPath: string, targetPath: string, additionalInfo: string): Promise<boolean> {

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

export = {
    upToDate: checkUpToDate,
    createContent: function(content: string, type?: string){
        return checksumUtil.createContent(content, type);
    },
    getFileExt: function(){
        return checksumUtil.getFileExt();
    }
}
