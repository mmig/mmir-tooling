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
var mmir_lib_1 = __importDefault(require("mmir-lib"));
// log('########################## mmir-loader: set start module ', mmirLib.mmir.startModule);//, ', config-paths: ', mmirLib.config.paths);
var mmir = mmir_lib_1.default.init(function (mmir) {
    mmir.startModule = 'mmirf/main-minimal';
    (mmir_lib_1.default._config || mmir_lib_1.default.config).paths['mmirf/main-minimal'] = path.join(__dirname, 'main-minimal');
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
