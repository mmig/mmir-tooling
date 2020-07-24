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
var promise_1 = __importDefault(require("./promise"));
var mmirDir = path.dirname(require.resolve('mmir-lib'));
module.exports = {
    getMmirDir: function () {
        return mmirDir;
    },
    dirExists: function (dir) {
        if (fs.existsSync(dir)) {
            return fs.statSync(dir).isDirectory();
        }
        return false;
    },
    isStandardTarget: function (targetDir) {
        return /^mmirf$/.test(path.basename(targetDir));
    },
    getStandardTargetSubDir: function () {
        return 'mmirf/';
    },
    canCopy: function (targetDir) {
        if (!fs.existsSync(targetDir)) {
            return true;
        }
        else {
            // console.log(fs.readdirSync(targetDir));
            return fs.readdirSync(targetDir).length = 0;
        }
    },
    copyFiles: function (srcDir, targetDir, force) {
        if (!fs.existsSync(srcDir)) {
            return promise_1.default.reject('Source directory does not exist!');
        }
        return fs.ensureDir(targetDir).then(function () {
            return fs.copy(srcDir, targetDir, {
                overwrite: force,
                errorOnExist: !force,
                preserveTimestamps: true
            });
        });
    }
};
