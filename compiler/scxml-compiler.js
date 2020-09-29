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
const scxml_gen_1 = __importDefault(require("../scxml/scxml-gen"));
const checksum_util_1 = __importDefault(require("../utils/checksum-util"));
const promise_1 = __importDefault(require("../utils/promise"));
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
function getStateChartTargetPath(scxmlInfo) {
    return path_1.default.join(scxmlInfo.targetDir, scxmlInfo.id + '.js');
}
function getStateChartChecksumPath(scxmlInfo) {
    return path_1.default.join(scxmlInfo.targetDir, scxmlInfo.id + checksum_util_1.default.getFileExt());
}
function getChecksumContent(content, type) {
    return checksum_util_1.default.createContent(content, type);
}
function checkUpToDate(scxmlInfo, jsonContent) {
    return checksum_util_1.default.upToDate(jsonContent, getStateChartChecksumPath(scxmlInfo), getStateChartTargetPath(scxmlInfo), void (0) // scxmlInfo.engine
    );
}
function writeStateChartModel(_err, scCode, _map, meta) {
    var sc = meta && meta.info;
    var scPath = getStateChartTargetPath(sc);
    var checksumContent = getChecksumContent(meta.json);
    var checksumPath = getStateChartChecksumPath(sc);
    log('###### writing compiled SCXML model to file (length ' + scCode.length + ') ', scPath, ' -> ', checksumContent);
    return promise_1.default.all([
        fs_extra_1.default.writeFile(scPath, scCode, 'utf8').catch(function (err) {
            var msg = 'ERROR writing compiled SCXML model to ' + scPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        }),
        fs_extra_1.default.writeFile(checksumPath, checksumContent, 'utf8').catch(function (err) {
            var msg = 'ERROR writing checksum file for compiled SCXML model to ' + checksumPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        })
    ]);
}
;
function prepareCompile(options) {
    options.config.moduleType = options.config.moduleType ? options.config.moduleType : 'amd';
    return fs_extra_1.default.ensureDir(options.config.targetDir);
}
function compile(loadOptions) {
    var tasks = [];
    loadOptions.mapping.forEach(sc => {
        sc.targetDir = loadOptions.config.targetDir;
        sc.force = typeof sc.force === 'boolean' ? sc.force : loadOptions.config.force;
        const t = fs_extra_1.default.readFile(sc.file, 'utf8').then(function (content) {
            return __awaiter(this, void 0, void 0, function* () {
                log('###### start processing SCXML model ' + sc.id);
                function doCompile() {
                    return new promise_1.default(function (resolve, reject) {
                        scxml_gen_1.default.compile(content, sc.file, loadOptions, function (err, scCode, _map, meta) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (err) {
                                    var msg = 'ERROR compiling SCXML model ' + (sc ? sc.file : '') + ': ';
                                    warn(msg, err);
                                    return resolve(err.stack ? err : new Error(msg + err));
                                }
                                return writeStateChartModel(err, scCode, _map, meta).then(function () {
                                    resolve();
                                }).catch(function (err) { reject(err); });
                            });
                        }, null, { info: sc, json: content });
                    });
                }
                ;
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
            });
        }).catch(function (err) {
            var msg = 'ERROR compiling SCXML model ' + sc.file + ': ';
            warn(msg, err);
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
