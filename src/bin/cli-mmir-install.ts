#!/usr/bin/env node

import * as meow from 'meow';
import * as path from 'path';

import mmirInstall from '../utils/install-mmir-lib';


const appName = 'mmirinstall';

export function main(){

    var cli = meow.default(`
        Usage
            ${appName} <target directory>

        Options
            --force, -f    force overwriting files in target directory
            --src, -s      source directory for mmir-lib library files
                                            DEFAUL directory of installed mmir-lib package:
                                            ${mmirInstall.getMmirDir()}
            --help         show usage information
            --verbose, -v  show additional information
                                            DEFAULT: false

        Examples
            ${appName} www/mmirf
            ${appName} --force src/mmirf
    `, {
        flags: {
            force: {
                type: 'boolean',
                alias: 'f',
                default: false
            },
            src: {
                type: 'string',
                alias: 's',
                default: mmirInstall.getMmirDir()
            },
            verbose: {
                type: 'boolean',
                alias: 'v',
                default: false
            }
        }
    });

// console.log(cli);

    if(!cli.input || !cli.input[0]){
        cli.showHelp();
        return;
    }

    if(cli.flags.verbose){
        process.env.verbose = true.toString();
    }

    try {

        var force = cli.flags.force;
        var targetDir = cli.input[0];
        if(!force && !mmirInstall.canCopy(targetDir)){
            console.error('[WARN] Aborted installation: target directory is not empty:');
            console.error('[WARN]   '+path.resolve(targetDir));
            console.error('[INFO] (use option --force for overwriting existing files)')
            return cli.showHelp();
        }

        if(!force && !mmirInstall.isStandardTarget(targetDir)){
            var defDir = mmirInstall.getStandardTargetSubDir();
            console.error('[WARN] Aborted installation: target directory is not '+defDir+':');
            console.error('[WARN]   if included in a web page via requirejs, you need to configure the');
            console.error('[WARN]   library\'s base path, if it is located in a non-standard sub-');
            console.error('[WARN]   directory, i.e. other than '+defDir);
            console.error('[INFO] (use option --force for installing anyway)')
            return cli.showHelp();
        }

        var srcDir = cli.flags.src;
        if(!mmirInstall.dirExists(srcDir)){
            console.error('[WARN] Cannot install: source directory does not exist, or is not a directory:');
            console.error('[WARN]   '+path.resolve(targetDir));
            return cli.showHelp();
        }

        mmirInstall.copyFiles(srcDir, targetDir, force).then(function(){
            console.log('finished installing mmir-lib files to '+targetDir);
        }).catch(function(err){
            handleError(err, cli);
        })

    } catch(err){

        handleError(err, cli);
    }

}

function handleError(err, cli){
    console.error(`
    An Error occurred for:
        ${appName} ${cli.input.join(' ')} -f ${cli.flags.force} -s ${cli.flags.src}

    Is the directory path correct?`);

    if(cli.flags.verbose)
        console.error('\n  ERROR Details:', err);
    else
        console.error('  (use flag --verbose for more details)');

    console.error('\nHELP:');
    cli.showHelp();
}

if(require.main === module){
    main();
}
