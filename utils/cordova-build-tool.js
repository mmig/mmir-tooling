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
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs-extra"));
var index_1 = __importDefault(require("../index"));
var mmirConfigFile = 'mmir.build.config.js';
var doBuild = function (mmirBuildConfig) {
    return index_1.default.apply(mmirBuildConfig).then(function (errors) {
        var errMsg = errors.join('\n');
        var msg = '\n[mmir-tooling] Finished compiling resources' + (errMsg ? ', with errors: ' + errMsg : '');
        console.log(msg);
        if (errMsg) {
            process.exit(1);
        }
    });
};
var doLoadMmirBuildConfig = function (root) {
    var configFile = path.join(root, mmirConfigFile);
    if (fs.existsSync(configFile)) {
        return require(configFile);
    }
    return {};
};
module.exports = function (ctx) {
    var root = ctx.opts.projectRoot;
    var mmirBuildConfig = doLoadMmirBuildConfig(root);
    if (typeof mmirBuildConfig.resourcesPath === 'undefined') {
        mmirBuildConfig.resourcesPath = path.join(root, 'www');
    }
    return doBuild(mmirBuildConfig);
};
