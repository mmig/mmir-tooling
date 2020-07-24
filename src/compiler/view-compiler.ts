
import { ViewBuildEntry, ViewCompilerOptions } from '../index.d';

import path from 'path';
import fs from 'fs-extra';

import viewGen from '../view/view-gen';

import checksumUtil from '../utils/checksum-util';

import promise from '../utils/promise';

import logUtils from '../utils/log-utils';
const log = logUtils.log;
const warn = logUtils.warn;

function getViewTargetPath(viewInfo: ViewBuildEntry): string {
    return path.join(viewInfo.targetDir, viewInfo.id + '.js');
}

function getViewChecksumPath(viewInfo: ViewBuildEntry): string {
    return path.join(viewInfo.targetDir, viewInfo.id + checksumUtil.getFileExt());
}

function getChecksumContent(content: string, type: string): string {
    return checksumUtil.createContent(content, type);
}

function checkUpToDate(viewInfo: ViewBuildEntry, jsonContent: string): Promise<boolean> {

    return checksumUtil.upToDate(
        jsonContent,
        getViewChecksumPath(viewInfo),
        getViewTargetPath(viewInfo),
        void(0)// viewInfo.engine
    );
}


async function writeView(err: Error | null, viewCode: string, _map: any, meta: any): Promise<Error | Error[] | any[]> {

    var v = meta && meta.info;
    if(err){
        var msg = 'ERROR compiling view '+(v? v.file : '')+': ';
        warn(msg, err);
        return promise.resolve(err.stack? err : new Error(msg+err));
    }

    var viewPath =  getViewTargetPath(v);
    var checksumContent = getChecksumContent(meta.json, v.engine);
    var checksumPath = getViewChecksumPath(v);
    log('###### writing compiled view to file (length '+viewCode.length+') ', viewPath, ' -> ', checksumContent);

    var viewDir = path.dirname(viewPath);
    return fs.ensureDir(viewDir).then(function(){

        var p1 = fs.writeFile(viewPath, viewCode, 'utf8').catch(function(err){
            var msg = 'ERROR writing compiled view to '+ viewPath+ ': ';
            warn(msg, err);
            return err.stack? err : new Error(msg+err);
        });

        var p2 = fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function(err){
            var msg = 'ERROR writing checksum file for compiled view to '+checksumPath+ ': ';
            warn(msg, err);
            return err.stack? err : new Error(msg+err);
        });

        return promise.all([p1, p2]);
    });

};

function prepareCompile(options: ViewCompilerOptions): Promise<void> {
    return fs.ensureDir(options.config.targetDir);
}

function compile(loadOptions: ViewCompilerOptions): Promise<Array<Error|Error[]> | any[]> {

    var tasks = [];
    loadOptions.mapping.forEach(v => {

        v.targetDir = loadOptions.config.targetDir;
        v.force = typeof v.force === 'boolean'? v.force : loadOptions.config.force;

        var t = fs.readFile(v.file, 'utf8').then(async function(content){

            function doCompile(){
                return new promise<void|Error>(function(resolve, reject){

                    viewGen.compile(content, v.file, loadOptions, function(err: null | Error, viewCode: string, _map: any, meta: any){

                        if(err){
                            var msg = 'ERROR compiling view '+(v? v.file : '')+': ';
                            warn(msg, err);
                            return resolve(err.stack? err : new Error(msg+err));
                        }

                        return writeView(err, viewCode, _map, meta).then(function(){
                            resolve();
                        }).catch(function(err){reject(err)});

                    }, null, {info: v, json: content});
                });
            };

            if(!v.force){

                return checkUpToDate(v, content).then(function(isUpdateToDate){

                    if(isUpdateToDate){
                        log('compiled view is up-to-date at '+getViewTargetPath(v));
                    } else {
                        return doCompile();
                    }

                }).catch(function(err){

                    var msg = 'ERROR compiling view '+v.file+': ';
                    warn(msg, err);
                    return err.stack? err : new Error(msg+err);
                });

            } else {

                return doCompile();
            }

        }).catch(function(err){

            var msg = 'ERROR compiling view '+v.file+': ';
            warn(msg, err);
            return err.stack? err : new Error(msg+err);
        });

        tasks.push(t);
    });

    return promise.all(tasks);
}

export = {
    prepareCompile: prepareCompile,
    compile: compile
}
