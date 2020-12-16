"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mmirLib = __importStar(require("mmir-lib"));
// log('########################## mmir-loader: set start module ', mmirLib.mmir.startModule);//, ', config-paths: ', mmirLib.config.paths);
var mmir = mmirLib.init(function (mmir) {
    mmir.startModule = 'mmirf/main-minimal';
    (mmirLib._config || mmirLib.config).paths['mmirf/main-minimal'] = path_1.default.join(__dirname, 'main-minimal');
    mmir.config({
        config: {
            'mmirf/configurationManager': {
                configuration: {}
            },
            'mmirf/commonUtils': {
                directories: {}
            }
        }
    });
});
//TODO detect debug/log-level setting when running in webpack ... for now statically set to 'warn'
mmir.require('mmirf/logger').setDefaultLogLevel('warn');
module.exports = mmir;
