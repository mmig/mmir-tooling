"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
