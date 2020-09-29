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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const mmir = __importStar(require("../mmir-init"));
const checksumUtil = mmir.require('mmirf/checksumUtils').init();
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
function checkUpToDate(jsonContent, checksumPath, targetPath, additionalInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs_extra_1.default.pathExists(targetPath).then(function (exists) {
            if (!exists) {
                log('no compiled resource at ' + targetPath);
                return false;
            }
            return fs_extra_1.default.pathExists(checksumPath).then(function (exists) {
                if (exists) {
                    return fs_extra_1.default.readFile(checksumPath, 'utf8').then(function (checksumContent) {
                        log('verifying checksum file at ' + checksumPath + ' -> ', checksumUtil.isSame(jsonContent, checksumUtil.parseContent(checksumContent), additionalInfo));
                        log('  checksum info -> ', checksumUtil.parseContent(checksumContent));
                        log('  json info -> ', checksumUtil.parseContent(checksumUtil.createContent(jsonContent, additionalInfo)));
                        return checksumUtil.isSame(jsonContent, checksumUtil.parseContent(checksumContent), additionalInfo);
                    }).catch(function (err) {
                        if (err) {
                            warn('ERROR reading checksum file at ' + checksumPath + ': ', err);
                            return false;
                        }
                    });
                }
                else {
                    log('no checksum file at ' + checksumPath);
                }
                return false;
            });
        });
    });
}
module.exports = {
    upToDate: checkUpToDate,
    createContent: function (content, type) {
        return checksumUtil.createContent(content, type);
    },
    getFileExt: function () {
        return checksumUtil.getFileExt();
    }
};
