#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var meow = __importStar(require("meow"));
var path = __importStar(require("path"));
var install_mmir_lib_1 = __importDefault(require("../utils/install-mmir-lib"));
var appName = 'mmirinstall';
function main() {
    var cli = meow.default("\n        Usage\n            " + appName + " <target directory>\n\n        Options\n            --force, -f    force overwriting files in target directory\n            --src, -s      source directory for mmir-lib library files\n                                            DEFAUL directory of installed mmir-lib package:\n                                            " + install_mmir_lib_1.default.getMmirDir() + "\n            --help         show usage information\n            --verbose, -v  show additional information\n                                            DEFAULT: false\n\n        Examples\n            " + appName + " www/mmirf\n            " + appName + " --force src/mmirf\n    ", {
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
            console.error('[WARN]   ' + path.resolve(targetDir));
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
            console.error('[WARN]   ' + path.resolve(targetDir));
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
    console.error("\n    An Error occurred for:\n        " + appName + " " + cli.input.join(' ') + " -f " + cli.flags.force + " -s " + cli.flags.src + "\n\n    Is the directory path correct?");
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
