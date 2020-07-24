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
var path = __importStar(require("path"));
var fs = __importStar(require("fs-extra"));
var grammar_gen_1 = __importDefault(require("../grammar/grammar-gen"));
var checksum_util_1 = __importDefault(require("../utils/checksum-util"));
var settings_utils_1 = __importDefault(require("../tools/settings-utils"));
var promise_1 = __importDefault(require("../utils/promise"));
var log_utils_1 = __importDefault(require("../utils/log-utils"));
var log = log_utils_1.default.log;
var warn = log_utils_1.default.warn;
var getGrammarTargetPath = function (grammarInfo) {
    return path.join(grammarInfo.targetDir, grammarInfo.id + '.js');
};
var getGrammarChecksumPath = function (grammarInfo) {
    return path.join(grammarInfo.targetDir, grammarInfo.id + checksum_util_1.default.getFileExt());
};
var getChecksumContent = function (content, type) {
    return checksum_util_1.default.createContent(content, type);
};
var getAdditionalChecksumInfo = function (grammarInfo) {
    return grammarInfo.engine + ' ' + grammar_gen_1.default.fileVersion;
};
var checkUpToDate = function (grammarInfo, jsonContent) {
    return checksum_util_1.default.upToDate(jsonContent, getGrammarChecksumPath(grammarInfo), getGrammarTargetPath(grammarInfo), getAdditionalChecksumInfo(grammarInfo));
};
var setPendingAsyncGrammarFinished = function (g) {
    if (!g.asyncCompile) {
        log('did not update pending grammar count for ' + g.id + ' with engine ' + g.engine + ', since it would have been sync-compiled.');
        return;
    }
    grammar_gen_1.default.updatePendingAsyncGrammarFinished(g, {});
};
var writeGrammar = function (_err, grammarCode, _map, meta) {
    var g = meta && meta.info;
    var grammarPath = getGrammarTargetPath(g);
    var checksumContent = getChecksumContent(meta.json, getAdditionalChecksumInfo(g));
    var checksumPath = getGrammarChecksumPath(g);
    log('###### writing compiled grammar to file (length ' + grammarCode.length + ') ', grammarPath, ' -> ', checksumContent);
    return promise_1.default.all([
        fs.writeFile(grammarPath, grammarCode, 'utf8').catch(function (err) {
            var msg = 'ERROR writing compiled grammar to ' + grammarPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        }),
        fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function (err) {
            var msg = 'ERROR writing checksum file for compiled grammar to ' + checksumPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        })
    ]);
};
var prepareCompile = function (options) {
    grammar_gen_1.default.initPendingAsyncGrammarInfo(options);
    return fs.ensureDir(options.config.targetDir);
};
var compile = function (grammarLoadOptions) {
    var tasks = [];
    grammarLoadOptions.mapping.forEach(function (g) {
        g.targetDir = grammarLoadOptions.config.targetDir;
        if (!g.engine) {
            g.engine = grammar_gen_1.default.getEngine(g, grammarLoadOptions);
        }
        if (typeof g.asyncCompile !== 'boolean') {
            g.asyncCompile = grammar_gen_1.default.isAsyncCompile(g, grammarLoadOptions);
        }
        g.force = typeof g.force === 'boolean' ? g.force : grammarLoadOptions.config.force;
        var t = settings_utils_1.default.loadSettingsFrom(g.file, g.fileType, true).then(function (grammarJsonObj) {
            log('###### start processing grammar ' + g.id + ' (engine ' + g.engine + ', asyncCompile ' + g.asyncCompile + ')...');
            var content;
            try {
                content = JSON.stringify(grammarJsonObj);
            }
            catch (err) {
                var msg = 'ERROR parsing grammar definition from ' + (g ? g.file : '<UNKNOWN>') + ': ';
                warn(msg, err);
                return promise_1.default.reject(err.stack ? err : new Error(msg + err));
            }
            var doCompile = function () {
                return new promise_1.default(function (resolve, reject) {
                    grammar_gen_1.default.compile(content, g.file, grammarLoadOptions, function (err, grammarCode, _map, meta) {
                        if (err) {
                            var msg = 'ERROR compiling grammar ' + (g ? g.file : '') + ': ';
                            warn(msg, err);
                            return resolve(err.stack ? err : new Error(msg + err));
                        }
                        writeGrammar(err, grammarCode, _map, meta).then(function () {
                            resolve();
                        }).catch(function (err) { reject(err); });
                    }, null, { info: g, json: content });
                });
            };
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
        }).catch(function (err) {
            var msg = 'ERROR compiling grammar ' + g.file + ': ';
            warn(msg, err);
            setPendingAsyncGrammarFinished(g);
            return err.stack ? err : new Error(msg + err);
        });
        tasks.push(t);
    });
    return promise_1.default.all(tasks);
};
module.exports = {
    prepareCompile: prepareCompile,
    compile: compile
};
