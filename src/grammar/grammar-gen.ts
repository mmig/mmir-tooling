
import { MmirModule, SemanticInterpreter, GrammarEngineType } from 'mmir-lib';

import asyncSupportUtil from '../utils/node-worker-support';

import * as mmir from '../mmir-init';
const semantic: SemanticInterpreter = (mmir as MmirModule).require('mmirf/semanticInterpreter');

import logUtils from '../utils/log-utils';
var log = logUtils.log;
// var warn = logUtils.warn;

var asyncSupport = asyncSupportUtil.isAsyncSupported();

//helpers for keeping track of pending grammar-compile tasks when in async compile mode
// -> will not try to destroy the compiler thread as long as there a still tasks for that compiler engine
function createPendingAsyncGrammarsInfo(){
    return {
        jison: 0,
        jscc: 0,
        pegjs: 0,
        reset: function(){
            this.jison = 0;
            this.jscc = 0;
            this.pegjs = 0;
        }
    };
}
var pendingAsyncGrammars;
//////// END: async / threaded grammar compiler ////////////////


function getEngine(grammarInfo, options){
    return grammarInfo.engine || (options.config && options.config.engine) || /*default: */ 'jscc';
}

function isAsyncCompile(grammarInfo, options){
    return asyncSupport && (typeof grammarInfo.asyncCompile === 'boolean'? grammarInfo.asyncCompile : (!options.config || options.config.asyncCompile !== false));
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

    var grammar;
    try{
        grammar = JSON.parse(content);
    } catch(err){
        // warn('ERROR parsing JSON grammar at '+this.resource+' -> ', JSON.stringify(content), arguments, ', [this:] ', this);//DEBUG
        callback(err, null, _map, _meta);
        return;/////////////// EARLY EXIT /////////////////
    }
    // log('mmir-grammer-loader: ', JSON.stringify(grammar));

    log('mmir-grammer-loader: resource -> ', grammarFile);//DEBUG
    var i = options.mapping.findIndex(function(g){
        return g.file === grammarFile;
    });
    var grammarInfo = options.mapping[i];

    if(!grammarInfo || !grammarInfo.id){
        var error;
        if(options.mapping.length === 0){
            error = 'failed to parse JSON grammar: empty list for grammar settings [{id: "the ID", file: "the file path", ...}, ...]';
        }
        else if(i === -1 || !grammarInfo){
            error = 'failed to parse JSON grammar: could not find settings for grammar in grammar-settings list: '+JSON.stringify(options.mapping);
        } else if(!grammarInfo.id){
            error = 'failed to parse JSON grammar: missing field id for grammar: '+JSON.stringify(grammarInfo);
        } else {
            error = 'failed to parse JSON grammar: invalid grammar settings in list: '+JSON.stringify(options.mapping);
        }
        callback(error, null, _map, _meta);
        return;/////////////// EARLY EXIT /////////////////
    }

    log('mmir-grammer-loader: resource ID at '+i+' -> ', grammarInfo.id);//DEBUG

    //TODO(?):
            // //TODO impl. automated sync/async loading&execution for compiled grammars
            // //				var grammarExecMode = configurationManager.get('grammarExecMode');
            // //				if(typeof grammarExecMode !== 'undefined'){
            // //					semanticInterpreter.setGrammarExecMode(grammarExecMode);//TODO add async-loaded grammars to ignoreGrammarFiles-list (to prevent loading them in "sync-exec mode")
            // //				}
            //
            // TODO add ignored (and excluded) grammars to ignore-list of mmir.conf
            // var ignoreGrammarIds = configurationManager.get('ignoreGrammarFiles', void(0));

    var engine = getEngine(grammarInfo, options);
    // log('mmir-grammer-loader: setting compiler "'+engine+'" for grammar "'+grammarInfo.id+'"...');//DEBUG

    // var async = grammarInfo.async || (options.config && options.config.async) || /*default: */ false;
    // async = true;//FIXME currently WebWorker library does not handle relative paths for importScripts() correctly -> DISABLE async mode

    var async = isAsyncCompile(grammarInfo, options);
    log('mmir-grammer-loader: using '+(async? 'async' : 'SYNC')+' mode ('+engine+') for grammar "'+grammarInfo.id+'" ...');//DEBUG

    var strictMode = typeof grammarInfo.strict === 'boolean'? grammarInfo.strict : (options.config && typeof options.config.strict === 'boolean'? options.config.strict : true);

    semantic.setGrammarEngine(engine, async, strictMode);

    updatePendingAsyncGrammarStarted(engine, async);

    var id = grammarInfo.id;
    semantic.createGrammar(grammar, id, function(result){

        log('mmir-grammer-loader: grammar '+id+' compiled...');//DEBUG

        var grammarCode = ';' + result.js_grammar_definition;
        // log('mmir-grammer-loader: grammar code size ', grammarCode.length);//DEBUG

        // try{
            if(async){
                var pending = pendingAsyncGrammars;
                --pending[engine];
                log('mmir-grammer-loader: updated pending async grammar ('+engine+') for grammar "'+grammarInfo.id+'": ', pending);//DEBUG
                if(pending[engine] <= 0){
                    log('mmir-grammer-loader: stopping grammer generator for '+engine+'...');//DEBUG
                    (mmir as MmirModule).require('mmirf/'+engine+'AsyncGen').destroy();
                }
            }
        // } catch(err){
        // 	log('could not destroy async grammar engine '+engine, err);//DEBUG
        // }

        log('mmir-grammer-loader: emitting grammar code for ('+engine+') for grammar "'+grammarInfo.id+'"...');//DEBUG

        callback(null, grammarCode, _map, _meta);
    });

    return;
};

/**
 * HELPER create info-object that helps deciding when to shut-down an async grammar compiler (i.e. stop its thread)
 *
 * @param  {GrammarLoadOptions} options the grammar options with property mapping (list of GrammarOptions)
 */
function initPendingAsyncGrammarInfo(options){

    if(asyncSupport && !pendingAsyncGrammars){
        // log('mmir-grammer-loader: init [ASYNC PREPARATION] options -> ', options);//DEBUG
        var pending = createPendingAsyncGrammarsInfo();
        if(options && options.mapping){
            options.mapping.forEach(function(g){
                if(isAsyncCompile(g, options)){
                    var engine = getEngine(g, options);
                    ++pending[engine];
                }
            });
            pendingAsyncGrammars = pending;//NOTE: store into "global"/module var, since this should keep trac of all ALL pending grammar jobs, not just the current one
            log('mmir-grammer-loader: PITCHing [ASYNC PREPARATION] pending grammars -> ',pendingAsyncGrammars, options.mapping);//DEBUG
        }
    }
}


function updatePendingAsyncGrammarStarted(engine, isAsync){
    if(isAsync){
        pendingAsyncGrammars[engine+'Started'] = true;
    }
}

function updatePendingAsyncGrammarFinished(grammarInfo, grammarLoadOptions){
    if(isAsyncCompile(grammarInfo, grammarLoadOptions)){
        var engine = getEngine(grammarInfo, grammarLoadOptions);
        var pending = pendingAsyncGrammars;
        --pending[engine];
        log('mmir-grammer-loader: updated pending async grammar ('+engine+') for grammar "'+grammarInfo.id+'": ', pending);//DEBUG

        for(var n in pending){
            if(pending[n] <= 0 && pending[n+'Started']){
                log('mmir-grammer-loader: stopping grammer generator for '+engine+'...');//DEBUG
                (mmir as MmirModule).require('mmirf/'+engine+'AsyncGen').destroy();
            }
        }
    }
}

export = {
    compile: compile,
    isAsyncSupported: function(){ return asyncSupport;},
    createPendingAsyncGrammarsInfo: createPendingAsyncGrammarsInfo,
    getPendingAsyncGrammars: function(){ return pendingAsyncGrammars; },
    setPendingAsyncGrammars: function(pending){ pendingAsyncGrammars = pending; },
    initPendingAsyncGrammarInfo: initPendingAsyncGrammarInfo,
    getEngine: getEngine,
    isAsyncCompile: isAsyncCompile,
    updatePendingAsyncGrammarFinished: updatePendingAsyncGrammarFinished,
    fileVersion: semantic.getFileVersion()
}
