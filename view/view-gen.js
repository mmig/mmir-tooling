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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mmir = __importStar(require("../mmir-init"));
var Controller = mmir.require('mmirf/controller');
const log_utils_1 = __importDefault(require("../utils/log-utils"));
// const log = logUtils.log;
const warn = log_utils_1.default.warn;
///////////////////////////////////////////////////////////////////////////////
function getCtrl(viewInfo) {
    var name = viewInfo.ctrlName;
    var constr = function () { };
    var def = {
        views: [],
        partials: [],
        layout: null
    };
    try {
        return new Controller(name, def, constr);
    }
    catch (err) {
        warn('WARN: deprecated Controller implementation, using context (ctx) instead of instance constructor...');
        var ctx = {};
        ctx[name] = constr;
        return new Controller(name, def, ctx);
    }
}
///////////////////////////////////////////////////////////////////////////////
/**
 * compile view defintion (eHTML) into an executable JS view
 *
 * @param  {string} content the view definition (eHTML) as string
 * @param  {string} viewFile the path of the view file (for debugging/error information)
 * @param  {ViewLoadOptions} options the ViewLoadOptions with property mapping (list of ViewOptions)
 * @param  {Function} callback the callback when view compilation has been completed: callback(error | null, compiledView, map, meta)
 * @param  {any} [_map] source mapping (unused)
 * @param  {any} [_meta] meta data (unused)
 */
function compile(content, viewFile, options, callback, _map, _meta) {
    var i = options.mapping.findIndex(function (v) {
        return v.file === viewFile;
    });
    var viewInfo = options.mapping[i];
    if (!viewInfo || !viewInfo.id) {
        let error;
        if (options.mapping.length === 0) {
            error = 'failed to parse view template: empty list for grammar settings [{id: "the ID", file: "the file path", ...}, ...]';
        }
        else if (i === -1 || !viewInfo) {
            error = 'failed to parse view template: could not find settings for grammar in grammar-settings list: ' + JSON.stringify(options.mapping);
        }
        else if (!viewInfo.id) {
            error = 'failed to parse view template: missing field id for grammar: ' + JSON.stringify(viewInfo);
        }
        else {
            error = 'failed to parse view template: invalid grammar settings in list: ' + JSON.stringify(options.mapping);
        }
        callback(error, null, _map, _meta);
        return; /////////////// EARLY EXIT /////////////////
    }
    var strictMode = typeof viewInfo.strict === 'boolean' ? viewInfo.strict : (options.config && typeof options.config.strict === 'boolean' ? options.config.strict : true);
    var viewConstr = mmir.require(viewInfo.viewImpl);
    var viewInstance;
    if (viewInfo.isLayout) {
        viewInstance = new viewConstr(viewInfo.viewName, content);
    }
    else {
        var ctrl = getCtrl(viewInfo);
        // log('mmir-view-loader: creating view "'+viewInfo.viewName+'" for controller "'+viewInfo.ctrlName+'" -> ', ctrl);//DEBU
        viewInstance = new viewConstr(ctrl, viewInfo.viewName, content);
    }
    callback(null, '\n' + viewInstance.stringify(!strictMode) + '\n', _map, _meta);
    return;
}
;
module.exports = {
    compile: compile
};
