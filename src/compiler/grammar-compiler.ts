
import { GrammarBuildEntry, GrammarCompilerOptions } from '../index.d';
import { Grammar } from 'mmir-lib';

import path from 'path';
import fs from 'fs-extra';

import grammarGen from '../grammar/grammar-gen';

import checksumUtil from '../utils/checksum-util';

import configurationUtil from '../tools/settings-utils';

import promise from '../utils/promise';

import logUtils from '../utils/log-utils';
const log = logUtils.log;
const warn = logUtils.warn;

function getGrammarTargetPath(grammarInfo: GrammarBuildEntry): string {
    return path.join(grammarInfo.targetDir, grammarInfo.id + '.js');
}

function getGrammarChecksumPath(grammarInfo: GrammarBuildEntry): string {
    return path.join(grammarInfo.targetDir, grammarInfo.id + checksumUtil.getFileExt());
}

function getChecksumContent(content: string, type: string): string {
    return checksumUtil.createContent(content, type);
}

function getAdditionalChecksumInfo(grammarInfo: GrammarBuildEntry): string {
    return grammarInfo.engine + ' ' + grammarGen.fileVersion;
}

function checkUpToDate(grammarInfo: GrammarBuildEntry, jsonContent: string): Promise<boolean> {

    return checksumUtil.upToDate(
        jsonContent,
        getGrammarChecksumPath(grammarInfo),
        getGrammarTargetPath(grammarInfo),
        getAdditionalChecksumInfo(grammarInfo)
    );
}

function setPendingAsyncGrammarFinished(g: GrammarBuildEntry): void {
    if(!g.asyncCompile){
        log('did not update pending grammar count for '+g.id+' with engine '+g.engine+', since it would have been sync-compiled.');
        return;
    }
    grammarGen.updatePendingAsyncGrammarFinished(g, {} as GrammarCompilerOptions);
}

function writeGrammar(_err: Error, grammarCode: string, _map: any, meta: any): Promise<Error[] | any[]> {

    var g = meta && meta.info;

    var grammarPath =  getGrammarTargetPath(g);
    var checksumContent = getChecksumContent(meta.json, getAdditionalChecksumInfo(g));
    var checksumPath = getGrammarChecksumPath(g);
    log('###### writing compiled grammar to file (length '+grammarCode.length+') ', grammarPath, ' -> ', checksumContent);

    return promise.all([
        fs.writeFile(grammarPath, grammarCode, 'utf8').catch(function(err){
            var msg = 'ERROR writing compiled grammar to '+ grammarPath + ': ';
            warn(msg, err);
            return err.stack? err : new Error(msg+err);
        }),
        fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function(err){
            var msg = 'ERROR writing checksum file for compiled grammar to '+checksumPath+ ': ';
            warn(msg, err);
            return err.stack? err : new Error(msg+err);
        })
    ]);
};

function prepareCompile(options: GrammarCompilerOptions): Promise<void> {
    grammarGen.initPendingAsyncGrammarInfo(options);
    return fs.ensureDir(options.config.targetDir);
}

function compile(grammarLoadOptions: GrammarCompilerOptions): Promise<Array<Error|Error[]> | any[]> {

    const tasks = [];

    grammarLoadOptions.mapping.forEach(g => {

        g.targetDir = grammarLoadOptions.config.targetDir;
        if(!g.engine){
            g.engine = grammarGen.getEngine(g, grammarLoadOptions);
        }
        if(typeof g.asyncCompile !== 'boolean'){
            g.asyncCompile = grammarGen.isAsyncCompile(g, grammarLoadOptions);
        }

        g.force = typeof g.force === 'boolean'? g.force : grammarLoadOptions.config.force;


        const t = configurationUtil.loadSettingsFrom(g.file, g.fileType, true).then(async function(grammarJsonObj: Grammar){

            log('###### start processing grammar '+g.id+' (engine '+g.engine+', asyncCompile '+g.asyncCompile+')...');

            let content: string;
            try{
                content = JSON.stringify(grammarJsonObj);
            } catch(err){
                const msg = 'ERROR parsing grammar definition from '+(g? g.file : '<UNKNOWN>')+': ';
                warn(msg, err);
                return promise.reject(err.stack? err : new Error(msg+err));
            }

            function doCompile(){
                return new promise(function(resolve, reject){
                    grammarGen.compile(content, g.file, grammarLoadOptions, function(err: Error, grammarCode: string, _map: any, meta: any): Promise<Array<Error|Error[]> | any[]> {

                        if(err){
                            const msg = 'ERROR compiling grammar '+(g? g.file : '')+': ';
                            warn(msg, err);
                            return resolve(err.stack? err : new Error(msg+err)) as any;
                        }
                        writeGrammar(err, grammarCode, _map, meta).then(function(){
                            resolve();
                        }).catch(function(err){reject(err)});

                    }, null, {info: g, json: content});
                });
            };

            if(!g.force){

                return checkUpToDate(g, content).then(function(isUpToDate){

                    if(isUpToDate){

                        log('compiled grammar is up-to-date at '+getGrammarTargetPath(g));
                        setPendingAsyncGrammarFinished(g);

                    } else {
                        return doCompile();
                    }
                });

            } else {

                return doCompile();
            }

        }).catch(function(err: Error){

            const msg = 'ERROR compiling grammar '+g.file+': ';
            warn(msg, err);

            setPendingAsyncGrammarFinished(g);

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
