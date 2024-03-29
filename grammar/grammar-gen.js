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
const node_worker_support_1 = __importDefault(require("../utils/node-worker-support"));
const mmir = __importStar(require("../mmir-init"));
const semantic = mmir.require('mmirf/semanticInterpreter');
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const asyncSupport = node_worker_support_1.default.isAsyncSupported();
//helpers for keeping track of pending grammar-compile tasks when in async compile mode
// -> will not try to destroy the compiler thread as long as there a still tasks for that compiler engine
function createPendingAsyncGrammarsInfo() {
    return {
        jison: 0,
        jscc: 0,
        pegjs: 0,
        reset: function () {
            this.jison = 0;
            this.jscc = 0;
            this.pegjs = 0;
        }
    };
}
var pendingAsyncGrammars;
//////// END: async / threaded grammar compiler ////////////////
function getEngine(grammarInfo, options) {
    return grammarInfo.engine || (options.config && options.config.engine) || /*default: */ 'jscc';
}
function isAsyncCompile(grammarInfo, options) {
    return asyncSupport && (typeof grammarInfo.asyncCompile === 'boolean' ? grammarInfo.asyncCompile : (!options.config || options.config.asyncCompile !== false));
}
/**
 * compile a JSON grammar into an executable JS grammar
 *
 * @param  {string} content the JSON grammar as string
 * @param  {string} grammarFile the path of the JSON grammar (for debugging/error information)
 * @param  {GrammarLoadOptions} options the GrammarLoadOptions with property mapping (list of GrammarOptions)
 * @param  {Function} callback the callback when grammar compilation has been completed: callback(error | null, compiledGrammar, map, meta)
 * @param  {any} [_map] source mapping (unused)
 * @param  {any} [_meta] meta data (unused)
 */
function compile(content, grammarFile, options, callback, _map, _meta) {
    let grammar;
    try {
        grammar = JSON.parse(content);
    }
    catch (err) {
        // warn('ERROR parsing JSON grammar at '+this.resource+' -> ', JSON.stringify(content), arguments, ', [this:] ', this);//DEBUG
        callback(err, null, _map, _meta);
        return; /////////////// EARLY EXIT /////////////////
    }
    // log('mmir-grammer-loader: ', JSON.stringify(grammar));
    log('mmir-grammer-loader: resource -> ', grammarFile); //DEBUG
    const i = options.mapping.findIndex(function (g) {
        return g.file === grammarFile;
    });
    const grammarInfo = options.mapping[i];
    if (!grammarInfo || !grammarInfo.id) {
        var error;
        if (options.mapping.length === 0) {
            error = 'failed to parse JSON grammar: empty list for grammar settings [{id: "the ID", file: "the file path", ...}, ...]';
        }
        else if (i === -1 || !grammarInfo) {
            error = 'failed to parse JSON grammar: could not find settings for grammar in grammar-settings list: ' + JSON.stringify(options.mapping);
        }
        else if (!grammarInfo.id) {
            error = 'failed to parse JSON grammar: missing field id for grammar: ' + JSON.stringify(grammarInfo);
        }
        else {
            error = 'failed to parse JSON grammar: invalid grammar settings in list: ' + JSON.stringify(options.mapping);
        }
        callback(error, null, _map, _meta);
        return; /////////////// EARLY EXIT /////////////////
    }
    log('mmir-grammer-loader: resource ID at ' + i + ' -> ', grammarInfo.id); //DEBUG
    //TODO(?):
    // //TODO impl. automated sync/async loading&execution for compiled grammars
    // //				var grammarExecMode = configurationManager.get('grammarExecMode');
    // //				if(typeof grammarExecMode !== 'undefined'){
    // //					semanticInterpreter.setGrammarExecMode(grammarExecMode);//TODO add async-loaded grammars to ignoreGrammarFiles-list (to prevent loading them in "sync-exec mode")
    // //				}
    //
    // TODO add ignored (and excluded) grammars to ignore-list of mmir.conf
    // var ignoreGrammarIds = configurationManager.get('ignoreGrammarFiles', void(0));
    const engine = getEngine(grammarInfo, options);
    // log('mmir-grammer-loader: setting compiler "'+engine+'" for grammar "'+grammarInfo.id+'"...');//DEBUG
    // var async = grammarInfo.async || (options.config && options.config.async) || /*default: */ false;
    // async = true;//FIXME currently WebWorker library does not handle relative paths for importScripts() correctly -> DISABLE async mode
    const async = isAsyncCompile(grammarInfo, options);
    log('mmir-grammer-loader: using ' + (async ? 'async' : 'SYNC') + ' mode (' + engine + ') for grammar "' + grammarInfo.id + '" ...'); //DEBUG
    const strictMode = typeof grammarInfo.strict === 'boolean' ? grammarInfo.strict : (options.config && typeof options.config.strict === 'boolean' ? options.config.strict : true);
    semantic.setGrammarEngine(engine, async, strictMode);
    updatePendingAsyncGrammarStarted(engine, async);
    const id = grammarInfo.id;
    semantic.createGrammar(grammar, id, function (result) {
        log('mmir-grammer-loader: grammar ' + id + ' compiled...'); //DEBUG
        const grammarCode = ';' + result.js_grammar_definition;
        // log('mmir-grammer-loader: grammar code size ', grammarCode.length);//DEBUG
        // try{
        if (async) {
            var pending = pendingAsyncGrammars;
            --pending[engine];
            log('mmir-grammer-loader: updated pending async grammar (' + engine + ') for grammar "' + grammarInfo.id + '": ', pending); //DEBUG
            if (pending[engine] <= 0) {
                log('mmir-grammer-loader: stopping grammer generator for ' + engine + '...'); //DEBUG
                mmir.require('mmirf/' + engine + 'AsyncGen').destroy();
            }
        }
        // } catch(err){
        // 	log('could not destroy async grammar engine '+engine, err);//DEBUG
        // }
        log('mmir-grammer-loader: emitting grammar code for (' + engine + ') for grammar "' + grammarInfo.id + '"...'); //DEBUG
        callback(null, grammarCode, _map, _meta);
    });
    return;
}
;
/**
 * HELPER create info-object that helps deciding when to shut-down an async grammar compiler (i.e. stop its thread)
 *
 * @param  {GrammarLoadOptions} options the grammar options with property mapping (list of GrammarOptions)
 */
function initPendingAsyncGrammarInfo(options) {
    if (asyncSupport && !pendingAsyncGrammars) {
        // log('mmir-grammer-loader: init [ASYNC PREPARATION] options -> ', options);//DEBUG
        const pending = createPendingAsyncGrammarsInfo();
        if (options && options.mapping) {
            options.mapping.forEach(function (g) {
                if (isAsyncCompile(g, options)) {
                    var engine = getEngine(g, options);
                    ++pending[engine];
                }
            });
            pendingAsyncGrammars = pending; //NOTE: store into "global"/module var, since this should keep trac of all ALL pending grammar jobs, not just the current one
            log('mmir-grammer-loader: PITCHing [ASYNC PREPARATION] pending grammars -> ', pendingAsyncGrammars, options.mapping); //DEBUG
        }
    }
}
function updatePendingAsyncGrammarStarted(engine, isAsync) {
    if (isAsync) {
        pendingAsyncGrammars[engine + 'Started'] = true;
    }
}
function updatePendingAsyncGrammarFinished(grammarInfo, grammarLoadOptions) {
    if (isAsyncCompile(grammarInfo, grammarLoadOptions)) {
        var engine = getEngine(grammarInfo, grammarLoadOptions);
        var pending = pendingAsyncGrammars;
        --pending[engine];
        log('mmir-grammer-loader: updated pending async grammar (' + engine + ') for grammar "' + grammarInfo.id + '": ', pending); //DEBUG
        for (var n in pending) {
            if (pending[n] <= 0 && pending[n + 'Started']) {
                log('mmir-grammer-loader: stopping grammer generator for ' + engine + '...'); //DEBUG
                mmir.require('mmirf/' + engine + 'AsyncGen').destroy();
            }
        }
    }
}
module.exports = {
    compile: compile,
    isAsyncSupported: function () { return asyncSupport; },
    createPendingAsyncGrammarsInfo: createPendingAsyncGrammarsInfo,
    getPendingAsyncGrammars: function () { return pendingAsyncGrammars; },
    setPendingAsyncGrammars: function (pending) { pendingAsyncGrammars = pending; },
    initPendingAsyncGrammarInfo: initPendingAsyncGrammarInfo,
    getEngine: getEngine,
    isAsyncCompile: isAsyncCompile,
    updatePendingAsyncGrammarFinished: updatePendingAsyncGrammarFinished,
    fileVersion: semantic.getFileVersion()
};
