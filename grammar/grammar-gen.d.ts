declare function createPendingAsyncGrammarsInfo(): {
    jison: number;
    jscc: number;
    pegjs: number;
    reset: () => void;
};
declare function getEngine(grammarInfo: any, options: any): any;
declare function isAsyncCompile(grammarInfo: any, options: any): any;
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
declare function compile(content: any, grammarFile: any, options: any, callback: any, _map: any, _meta: any): void;
/**
 * HELPER create info-object that helps deciding when to shut-down an async grammar compiler (i.e. stop its thread)
 *
 * @param  {GrammarLoadOptions} options the grammar options with property mapping (list of GrammarOptions)
 */
declare function initPendingAsyncGrammarInfo(options: any): void;
declare function updatePendingAsyncGrammarFinished(grammarInfo: any, grammarLoadOptions: any): void;
declare const _default: {
    compile: typeof compile;
    isAsyncSupported: () => boolean;
    createPendingAsyncGrammarsInfo: typeof createPendingAsyncGrammarsInfo;
    getPendingAsyncGrammars: () => any;
    setPendingAsyncGrammars: (pending: any) => void;
    initPendingAsyncGrammarInfo: typeof initPendingAsyncGrammarInfo;
    getEngine: typeof getEngine;
    isAsyncCompile: typeof isAsyncCompile;
    updatePendingAsyncGrammarFinished: typeof updatePendingAsyncGrammarFinished;
    fileVersion: number;
};
export = _default;
