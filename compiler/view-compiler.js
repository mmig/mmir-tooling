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
var view_gen_1 = __importDefault(require("../view/view-gen"));
var checksum_util_1 = __importDefault(require("../utils/checksum-util"));
var promise_1 = __importDefault(require("../utils/promise"));
var log_utils_1 = __importDefault(require("../utils/log-utils"));
var log = log_utils_1.default.log;
var warn = log_utils_1.default.warn;
var getViewTargetPath = function (viewInfo) {
    return path.join(viewInfo.targetDir, viewInfo.id + '.js');
};
var getViewChecksumPath = function (viewInfo) {
    return path.join(viewInfo.targetDir, viewInfo.id + checksum_util_1.default.getFileExt());
};
var getChecksumContent = function (content, type) {
    return checksum_util_1.default.createContent(content, type);
};
var checkUpToDate = function (viewInfo, jsonContent) {
    return checksum_util_1.default.upToDate(jsonContent, getViewChecksumPath(viewInfo), getViewTargetPath(viewInfo), void (0) // viewInfo.engine
    );
};
var writeView = function (err, viewCode, _map, meta) {
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
    var viewDir = path.dirname(viewPath);
    return fs.ensureDir(viewDir).then(function () {
        var p1 = fs.writeFile(viewPath, viewCode, 'utf8').catch(function (err) {
            var msg = 'ERROR writing compiled view to ' + viewPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        });
        var p2 = fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function (err) {
            var msg = 'ERROR writing checksum file for compiled view to ' + checksumPath + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        });
        return promise_1.default.all([p1, p2]);
    });
};
var prepareCompile = function (options) {
    return fs.ensureDir(options.config.targetDir);
};
var compile = function (loadOptions) {
    var tasks = [];
    loadOptions.mapping.forEach(function (v) {
        v.targetDir = loadOptions.config.targetDir;
        v.force = typeof v.force === 'boolean' ? v.force : loadOptions.config.force;
        var t = fs.readFile(v.file, 'utf8').then(function (content) {
            var doCompile = function () {
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
            };
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
        }).catch(function (err) {
            var msg = 'ERROR compiling view ' + v.file + ': ';
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
