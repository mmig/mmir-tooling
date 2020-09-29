import { GrammarEngineType } from 'mmir-lib';
import { GrammarBuildEntry, GrammarCompilerOptions, CompilerCallback } from '../index.d';
declare type AsyncPendingInfo = {
    jison: number;
    jscc: number;
    pegjs: number;
    reset(): void;
};
declare function createPendingAsyncGrammarsInfo(): AsyncPendingInfo;
declare function getEngine(grammarInfo: GrammarBuildEntry, options: GrammarCompilerOptions): GrammarEngineType;
declare function isAsyncCompile(grammarInfo: GrammarBuildEntry, options: GrammarCompilerOptions): boolean;
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
declare function compile(content: string, grammarFile: string, options: GrammarCompilerOptions, callback: CompilerCallback, _map: any, _meta: any): void;
/**
 * HELPER create info-object that helps deciding when to shut-down an async grammar compiler (i.e. stop its thread)
 *
 * @param  {GrammarLoadOptions} options the grammar options with property mapping (list of GrammarOptions)
 */
declare function initPendingAsyncGrammarInfo(options: GrammarCompilerOptions): void;
declare function updatePendingAsyncGrammarFinished(grammarInfo: GrammarBuildEntry, grammarLoadOptions: GrammarCompilerOptions): void;
declare const _default: {
    compile: typeof compile;
    isAsyncSupported: () => boolean;
    createPendingAsyncGrammarsInfo: typeof createPendingAsyncGrammarsInfo;
    getPendingAsyncGrammars: () => AsyncPendingInfo;
    setPendingAsyncGrammars: (pending: AsyncPendingInfo) => void;
    initPendingAsyncGrammarInfo: typeof initPendingAsyncGrammarInfo;
    getEngine: typeof getEngine;
    isAsyncCompile: typeof isAsyncCompile;
    updatePendingAsyncGrammarFinished: typeof updatePendingAsyncGrammarFinished;
    fileVersion: number;
};
export = _default;
