
import { BuildAppConfig } from '../index.d';

import path from 'path';
import fs from 'fs-extra';
import buildTools from '../index';

const mmirConfigFile = 'mmir.build.config.js';

async function doBuild(mmirBuildConfig: BuildAppConfig){
    return buildTools.apply(mmirBuildConfig).then(function(errors){
        const errMsg = errors.join('\n');
        const msg = '\n[mmir-tooling] Finished compiling resources'+(errMsg? ', with errors: ' +errMsg : '');
        console.log(msg);
        if(errMsg){
            process.exit(1);
        }
    });
};

function doLoadMmirBuildConfig(root: string): BuildAppConfig {
    const configFile = path.join(root, mmirConfigFile);
    if(fs.existsSync(configFile)){
        return require(configFile);
    }
    return {};
}

module.exports = function(ctx: any &{opts: {projectRoot: string}}){
    const root = ctx.opts.projectRoot;
    const mmirBuildConfig = doLoadMmirBuildConfig(root);
    if(typeof mmirBuildConfig.resourcesPath === 'undefined'){
        mmirBuildConfig.resourcesPath = path.join(root, 'www')
    }
    return doBuild(mmirBuildConfig);
};
