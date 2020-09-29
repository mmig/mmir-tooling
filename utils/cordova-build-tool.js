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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const index_1 = __importDefault(require("../index"));
const mmirConfigFile = 'mmir.build.config.js';
function doBuild(mmirBuildConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        return index_1.default.apply(mmirBuildConfig).then(function (errors) {
            const errMsg = errors.join('\n');
            const msg = '\n[mmir-tooling] Finished compiling resources' + (errMsg ? ', with errors: ' + errMsg : '');
            console.log(msg);
            if (errMsg) {
                process.exit(1);
            }
        });
    });
}
;
function doLoadMmirBuildConfig(root) {
    const configFile = path_1.default.join(root, mmirConfigFile);
    if (fs_extra_1.default.existsSync(configFile)) {
        return require(configFile);
    }
    return {};
}
module.exports = function (ctx) {
    const root = ctx.opts.projectRoot;
    const mmirBuildConfig = doLoadMmirBuildConfig(root);
    if (typeof mmirBuildConfig.resourcesPath === 'undefined') {
        mmirBuildConfig.resourcesPath = path_1.default.join(root, 'www');
    }
    return doBuild(mmirBuildConfig);
};
