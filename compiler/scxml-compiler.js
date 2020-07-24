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
var scxml_gen_1 = __importDefault(require("../scxml/scxml-gen"));
var checksum_util_1 = __importDefault(require("../utils/checksum-util"));
var promise_1 = __importDefault(require("../utils/promise"));
var log_utils_1 = __importDefault(require("../utils/log-utils"));
var log = log_utils_1.default.log;
var warn = log_utils_1.default.warn;
var getStateChartTargetPath = function (scxmlInfo) {
    return path.join(scxmlInfo.targetDir, scxmlInfo.id + '.js');
};
var getStateChartChecksumPath = function (scxmlInfo) {
    return path.join(scxmlInfo.targetDir, scxmlInfo.id + checksum_util_1.default.getFileExt());
};
var getChecksumContent = function (content, type) {
    return checksum_util_1.default.createContent(content, type);
};
var checkUpToDate = function (scxmlInfo, jsonContent) {
    return checksum_util_1.default.upToDate(jsonContent, getStateChartChecksumPath(scxmlInfo), getStateChartTargetPath(scxmlInfo), void (0) // scxmlInfo.engine
    );
};
var writeStateChartModel = function (_err, scCode, _map, meta) {
    var sc = meta && meta.info;
    var scPath = getStateChartTargetPath(sc);
    var checksumContent = getChecksumContent(meta.json);
    var checksumPath = getStateChartChecksumPath(sc);
    log('###### writing compiled SCXML model to file (length ' + scCode.length + ') ', scPath, ' -> ', checksumContent);
    return promise_1.default.all([
        fs.writeFile(scPath, scCode, 'utf8').catch(function (err) {
            var msg = 'ERROR writing compiled SCXML model to ' + scPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        }),
        fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function (err) {
            var msg = 'ERROR writing checksum file for compiled SCXML model to ' + checksumPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        })
    ]);
};
var prepareCompile = function (options) {
    options.config.moduleType = options.config.moduleType ? options.config.moduleType : 'amd';
    return fs.ensureDir(options.config.targetDir);
};
var compile = function (loadOptions) {
    var tasks = [];
    loadOptions.mapping.forEach(function (sc) {
        sc.targetDir = loadOptions.config.targetDir;
        sc.force = typeof sc.force === 'boolean' ? sc.force : loadOptions.config.force;
        var t = fs.readFile(sc.file, 'utf8').then(function (content) {
            log('###### start processing SCXML model ' + sc.id);
            var doCompile = function () {
                return new promise_1.default(function (resolve, reject) {
                    scxml_gen_1.default.compile(content, sc.file, loadOptions, function (err, scCode, _map, meta) {
                        if (err) {
                            var msg = 'ERROR compiling SCXML model ' + (sc ? sc.file : '') + ': ';
                            warn(msg, err);
                            return resolve(err.stack ? err : new Error(msg + err));
                        }
                        return writeStateChartModel(err, scCode, _map, meta).then(function () {
                            resolve();
                        }).catch(function (err) { reject(err); });
                    }, null, { info: sc, json: content });
                });
            };
            if (!sc.force) {
                return checkUpToDate(sc, content).then(function (isUpdateToDate) {
                    if (isUpdateToDate) {
                        log('compiled SCXML model is up-to-date at ' + getStateChartTargetPath(sc));
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
            var msg = 'ERROR compiling SCXML model ' + sc.file + ': ';
            warn(msg, err);
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
