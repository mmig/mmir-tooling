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
const promise_1 = __importDefault(require("./promise"));
const mmirDir = path_1.default.dirname(require.resolve('mmir-lib'));
module.exports = {
    getMmirDir: function () {
        return mmirDir;
    },
    dirExists: function (dir) {
        if (fs_extra_1.default.existsSync(dir)) {
            return fs_extra_1.default.statSync(dir).isDirectory();
        }
        return false;
    },
    isStandardTarget: function (targetDir) {
        return /^mmirf$/.test(path_1.default.basename(targetDir));
    },
    getStandardTargetSubDir: function () {
        return 'mmirf/';
    },
    canCopy: function (targetDir) {
        if (!fs_extra_1.default.existsSync(targetDir)) {
            return true;
        }
        else {
            // console.log(fs.readdirSync(targetDir));
            return fs_extra_1.default.readdirSync(targetDir).length === 0;
        }
    },
    copyFiles: function (srcDir, targetDir, force) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_extra_1.default.existsSync(srcDir)) {
                return promise_1.default.reject('Source directory does not exist!');
            }
            return fs_extra_1.default.ensureDir(targetDir).then(function () {
                return fs_extra_1.default.copy(srcDir, targetDir, {
                    overwrite: force,
                    errorOnExist: !force,
                    preserveTimestamps: true
                });
            });
        });
    }
};
