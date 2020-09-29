"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const grammar_gen_1 = __importDefault(require("../grammar/grammar-gen"));
const checksum_util_1 = __importDefault(require("../utils/checksum-util"));
const settings_utils_1 = __importDefault(require("../tools/settings-utils"));
const promise_1 = __importDefault(require("../utils/promise"));
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
function getGrammarTargetPath(grammarInfo) {
    return path_1.default.join(grammarInfo.targetDir, grammarInfo.id + '.js');
}
function getGrammarChecksumPath(grammarInfo) {
    return path_1.default.join(grammarInfo.targetDir, grammarInfo.id + checksum_util_1.default.getFileExt());
}
function getChecksumContent(content, type) {
    return checksum_util_1.default.createContent(content, type);
}
function getAdditionalChecksumInfo(grammarInfo) {
    return grammarInfo.engine + ' ' + grammar_gen_1.default.fileVersion;
}
function checkUpToDate(grammarInfo, jsonContent) {
    return checksum_util_1.default.upToDate(jsonContent, getGrammarChecksumPath(grammarInfo), getGrammarTargetPath(grammarInfo), getAdditionalChecksumInfo(grammarInfo));
}
function setPendingAsyncGrammarFinished(g) {
    if (!g.asyncCompile) {
        log('did not update pending grammar count for ' + g.id + ' with engine ' + g.engine + ', since it would have been sync-compiled.');
        return;
    }
    grammar_gen_1.default.updatePendingAsyncGrammarFinished(g, {});
}
function writeGrammar(_err, grammarCode, _map, meta) {
    var g = meta && meta.info;
    var grammarPath = getGrammarTargetPath(g);
    var checksumContent = getChecksumContent(meta.json, getAdditionalChecksumInfo(g));
    var checksumPath = getGrammarChecksumPath(g);
    log('###### writing compiled grammar to file (length ' + grammarCode.length + ') ', grammarPath, ' -> ', checksumContent);
    return promise_1.default.all([
        fs_extra_1.default.writeFile(grammarPath, grammarCode, 'utf8').catch(function (err) {
            var msg = 'ERROR writing compiled grammar to ' + grammarPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        }),
        fs_extra_1.default.writeFile(checksumPath, checksumContent, 'utf8').catch(function (err) {
            var msg = 'ERROR writing checksum file for compiled grammar to ' + checksumPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        })
    ]);
}
;
function prepareCompile(options) {
    grammar_gen_1.default.initPendingAsyncGrammarInfo(options);
    return fs_extra_1.default.ensureDir(options.config.targetDir);
}
function compile(grammarLoadOptions) {
    const tasks = [];
    grammarLoadOptions.mapping.forEach(g => {
        g.targetDir = grammarLoadOptions.config.targetDir;
        if (!g.engine) {
            g.engine = grammar_gen_1.default.getEngine(g, grammarLoadOptions);
        }
        if (typeof g.asyncCompile !== 'boolean') {
            g.asyncCompile = grammar_gen_1.default.isAsyncCompile(g, grammarLoadOptions);
        }
        g.force = typeof g.force === 'boolean' ? g.force : grammarLoadOptions.config.force;
        const t = settings_utils_1.default.loadSettingsFrom(g.file, g.fileType, true).then(function (grammarJsonObj) {
            return __awaiter(this, void 0, void 0, function* () {
                log('###### start processing grammar ' + g.id + ' (engine ' + g.engine + ', asyncCompile ' + g.asyncCompile + ')...');
                let content;
                try {
                    content = JSON.stringify(grammarJsonObj);
                }
                catch (err) {
                    const msg = 'ERROR parsing grammar definition from ' + (g ? g.file : '<UNKNOWN>') + ': ';
                    warn(msg, err);
                    return promise_1.default.reject(err.stack ? err : new Error(msg + err));
                }
                function doCompile() {
                    return new promise_1.default(function (resolve, reject) {
                        grammar_gen_1.default.compile(content, g.file, grammarLoadOptions, function (err, grammarCode, _map, meta) {
                            if (err) {
                                const msg = 'ERROR compiling grammar ' + (g ? g.file : '') + ': ';
                                warn(msg, err);
                                return resolve(err.stack ? err : new Error(msg + err));
                            }
                            writeGrammar(err, grammarCode, _map, meta).then(function () {
                                resolve();
                            }).catch(function (err) { reject(err); });
                        }, null, { info: g, json: content });
                    });
                }
                ;
                if (!g.force) {
                    return checkUpToDate(g, content).then(function (isUpToDate) {
                        if (isUpToDate) {
                            log('compiled grammar is up-to-date at ' + getGrammarTargetPath(g));
                            setPendingAsyncGrammarFinished(g);
                        }
                        else {
                            return doCompile();
                        }
                    });
                }
                else {
                    return doCompile();
                }
            });
        }).catch(function (err) {
            const msg = 'ERROR compiling grammar ' + g.file + ': ';
            warn(msg, err);
            setPendingAsyncGrammarFinished(g);
            return err.stack ? err : new Error(msg + err);
        });
        tasks.push(t);
    });
    return promise_1.default.all(tasks);
}
module.exports = {
    prepareCompile: prepareCompile,
    compile: compile
};
