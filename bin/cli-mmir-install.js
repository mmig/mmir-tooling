#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const meow_1 = __importDefault(require("meow"));
const path_1 = __importDefault(require("path"));
const install_mmir_lib_1 = __importDefault(require("../utils/install-mmir-lib"));
const appName = 'mmirinstall';
function main() {
    const cli = meow_1.default(`
        Usage
            ${appName} <target directory>

        Options
            --force, -f    force overwriting files in target directory
            --src, -s      source directory for mmir-lib library files
                                            DEFAUL directory of installed mmir-lib package:
                                            ${install_mmir_lib_1.default.getMmirDir()}
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
                default: install_mmir_lib_1.default.getMmirDir()
            },
            verbose: {
                type: 'boolean',
                alias: 'v',
                default: false
            }
        }
    });
    // console.log(cli);
    if (!cli.input || !cli.input[0]) {
        cli.showHelp();
        return;
    }
    if (cli.flags.verbose) {
        process.env.verbose = true.toString();
    }
    try {
        var force = cli.flags.force;
        var targetDir = cli.input[0];
        if (!force && !install_mmir_lib_1.default.canCopy(targetDir)) {
            console.error('[WARN] Aborted installation: target directory is not empty:');
            console.error('[WARN]   ' + path_1.default.resolve(targetDir));
            console.error('[INFO] (use option --force for overwriting existing files)');
            return cli.showHelp();
        }
        if (!force && !install_mmir_lib_1.default.isStandardTarget(targetDir)) {
            var defDir = install_mmir_lib_1.default.getStandardTargetSubDir();
            console.error('[WARN] Aborted installation: target directory is not ' + defDir + ':');
            console.error('[WARN]   if included in a web page via requirejs, you need to configure the');
            console.error('[WARN]   library\'s base path, if it is located in a non-standard sub-');
            console.error('[WARN]   directory, i.e. other than ' + defDir);
            console.error('[INFO] (use option --force for installing anyway)');
            return cli.showHelp();
        }
        var srcDir = cli.flags.src;
        if (!install_mmir_lib_1.default.dirExists(srcDir)) {
            console.error('[WARN] Cannot install: source directory does not exist, or is not a directory:');
            console.error('[WARN]   ' + path_1.default.resolve(targetDir));
            return cli.showHelp();
        }
        install_mmir_lib_1.default.copyFiles(srcDir, targetDir, force).then(function () {
            console.log('finished installing mmir-lib files to ' + targetDir);
        }).catch(function (err) {
            handleError(err, cli);
        });
    }
    catch (err) {
        handleError(err, cli);
    }
}
exports.main = main;
function handleError(err, cli) {
    console.error(`
    An Error occurred for:
        ${appName} ${cli.input.join(' ')} -f ${cli.flags.force} -s ${cli.flags.src}

    Is the directory path correct?`);
    if (cli.flags.verbose)
        console.error('\n  ERROR Details:', err);
    else
        console.error('  (use flag --verbose for more details)');
    console.error('\nHELP:');
    cli.showHelp();
}
if (require.main === module) {
    main();
}
