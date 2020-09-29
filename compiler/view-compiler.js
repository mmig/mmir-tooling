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
const view_gen_1 = __importDefault(require("../view/view-gen"));
const checksum_util_1 = __importDefault(require("../utils/checksum-util"));
const promise_1 = __importDefault(require("../utils/promise"));
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
function getViewTargetPath(viewInfo) {
    return path_1.default.join(viewInfo.targetDir, viewInfo.id + '.js');
}
function getViewChecksumPath(viewInfo) {
    return path_1.default.join(viewInfo.targetDir, viewInfo.id + checksum_util_1.default.getFileExt());
}
function getChecksumContent(content, type) {
    return checksum_util_1.default.createContent(content, type);
}
function checkUpToDate(viewInfo, jsonContent) {
    return checksum_util_1.default.upToDate(jsonContent, getViewChecksumPath(viewInfo), getViewTargetPath(viewInfo), void (0) // viewInfo.engine
    );
}
function writeView(err, viewCode, _map, meta) {
    return __awaiter(this, void 0, void 0, function* () {
        var v = meta && meta.info;
        if (err) {
            var msg = 'ERROR compiling view ' + (v ? v.file : '') + ': ';
            warn(msg, err);
            return promise_1.default.resolve(err.stack ? err : new Error(msg + err));
        }
        var viewPath = getViewTargetPath(v);
        var checksumContent = getChecksumContent(meta.json, v.engine);
        var checksumPath = getViewChecksumPath(v);
        log('###### writing compiled view to file (length ' + viewCode.length + ') ', viewPath, ' -> ', checksumContent);
        var viewDir = path_1.default.dirname(viewPath);
        return fs_extra_1.default.ensureDir(viewDir).then(function () {
            var p1 = fs_extra_1.default.writeFile(viewPath, viewCode, 'utf8').catch(function (err) {
                var msg = 'ERROR writing compiled view to ' + viewPath + ': ';
                warn(msg, err);
                return err.stack ? err : new Error(msg + err);
            });
            var p2 = fs_extra_1.default.writeFile(checksumPath, checksumContent, 'utf8').catch(function (err) {
                var msg = 'ERROR writing checksum file for compiled view to ' + checksumPath + ': ';
                warn(msg, err);
                return err.stack ? err : new Error(msg + err);
            });
            return promise_1.default.all([p1, p2]);
        });
    });
}
;
function prepareCompile(options) {
    return fs_extra_1.default.ensureDir(options.config.targetDir);
}
function compile(loadOptions) {
    var tasks = [];
    loadOptions.mapping.forEach(v => {
        v.targetDir = loadOptions.config.targetDir;
        v.force = typeof v.force === 'boolean' ? v.force : loadOptions.config.force;
        var t = fs_extra_1.default.readFile(v.file, 'utf8').then(function (content) {
            return __awaiter(this, void 0, void 0, function* () {
                function doCompile() {
                    return new promise_1.default(function (resolve, reject) {
                        view_gen_1.default.compile(content, v.file, loadOptions, function (err, viewCode, _map, meta) {
                            if (err) {
                                var msg = 'ERROR compiling view ' + (v ? v.file : '') + ': ';
                                warn(msg, err);
                                return resolve(err.stack ? err : new Error(msg + err));
                            }
                            return writeView(err, viewCode, _map, meta).then(function () {
                                resolve();
                            }).catch(function (err) { reject(err); });
                        }, null, { info: v, json: content });
                    });
                }
                ;
                if (!v.force) {
                    return checkUpToDate(v, content).then(function (isUpdateToDate) {
                        if (isUpdateToDate) {
                            log('compiled view is up-to-date at ' + getViewTargetPath(v));
                        }
                        else {
                            return doCompile();
                        }
                    }).catch(function (err) {
                        var msg = 'ERROR compiling view ' + v.file + ': ';
                        warn(msg, err);
                        return err.stack ? err : new Error(msg + err);
                    });
                }
                else {
                    return doCompile();
                }
            });
        }).catch(function (err) {
            var msg = 'ERROR compiling view ' + v.file + ': ';
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
