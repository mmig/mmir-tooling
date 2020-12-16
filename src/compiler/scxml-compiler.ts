
import { StateModelBuildEntry, StateCompilerOptions } from '../index.d';

import path from 'path';
import fs from 'fs-extra';

import scxmlGen from '../scxml/scxml-gen';

import checksumUtil from '../utils/checksum-util';

import promise from '../utils/promise';

import logUtils from '../utils/log-utils';
const log = logUtils.log;
const warn = logUtils.warn;

function getStateChartTargetPath(scxmlInfo: StateModelBuildEntry): string {
    return path.join(scxmlInfo.targetDir, scxmlInfo.id + '.js');
}

function getStateChartChecksumPath(scxmlInfo: StateModelBuildEntry): string {
    return path.join(scxmlInfo.targetDir, scxmlInfo.id + checksumUtil.getFileExt());
}

function getChecksumContent(content: string, type?: string): string {
    return checksumUtil.createContent(content, type);
}

function checkUpToDate(scxmlInfo: StateModelBuildEntry, jsonContent: string): Promise<boolean> {

    return checksumUtil.upToDate(
        jsonContent,
        getStateChartChecksumPath(scxmlInfo),
        getStateChartTargetPath(scxmlInfo),
        void(0)// scxmlInfo.engine
    );
}


function writeStateChartModel(_err: Error, scCode: string, _map: any, meta: any): Promise<Error | Error[] | any> {

    var sc = meta && meta.info;
    var scPath =  getStateChartTargetPath(sc);
    var checksumContent = getChecksumContent(meta.json);
    var checksumPath = getStateChartChecksumPath(sc);

    log('###### writing compiled SCXML model to file (length '+scCode.length+') ', scPath, ' -> ', checksumContent);

    return promise.all([
        fs.writeFile(scPath, scCode, 'utf8').catch(function(err){
            var msg = 'ERROR writing compiled SCXML model to '+ scPath+ ': ';
            warn(msg, err);
            return err.stack? err : new Error(msg+err)
        }),
        fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function(err){
            var msg = 'ERROR writing checksum file for compiled SCXML model to '+checksumPath+ ': ';
            warn(msg, err);
            return err.stack? err : new Error(msg+err);
        })
    ]);
};

function prepareCompile(options: StateCompilerOptions){
    options.config.moduleType = options.config.moduleType? options.config.moduleType : 'amd';
    return fs.ensureDir(options.config.targetDir);
}

function compile(loadOptions: StateCompilerOptions): Promise<Array<Error|Error[]> | any[]> {

    var tasks = [];
    loadOptions.mapping.forEach(sc => {

        sc.targetDir = loadOptions.config.targetDir;
        sc.force = typeof sc.force === 'boolean'? sc.force : loadOptions.config.force;

        const t = fs.readFile(sc.file, 'utf8').then(async function(content){

            log('###### start processing SCXML model '+sc.id);

            function doCompile(){
                return new promise<void | Error>(function(resolve, reject){
                    scxmlGen.compile(content, sc.file, loadOptions, async function(err: Error, scCode: string, _map: any, meta: any): Promise<Error | any> {

                        if(err){
                            var msg = 'ERROR compiling SCXML model '+(sc? sc.file : '')+': ';
                            warn(msg, err);
                            return resolve(err.stack? err : new Error(msg+err)) as any;
                        }

                        return writeStateChartModel(err, scCode, _map, meta).then(function(){
                            resolve();
                        }).catch(function(err){reject(err)});

                    }, null, {info: sc, json: content});

                });
            };

            if(!sc.force){

                return checkUpToDate(sc, content).then(function(isUpdateToDate){

                    if(isUpdateToDate){
                        log('compiled SCXML model is up-to-date at '+getStateChartTargetPath(sc));
                    } else {
                        return doCompile();
                    }
                });

            } else {

                return doCompile();
            }

        }).catch(function(err){

            var msg = 'ERROR compiling SCXML model '+sc.file+': ';
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
