import { CompilerCallback, StateCompilerOptions } from '../index.d';
/**
 * compile an SCXML file to exectuable scion statechart model
 *
 * @param  {string} content the SCXML definition as string
 * @param  {string} scxmlFile the path of the SCXML file (for debugging/error information)
 * @param  {ScxmlLoadOptions} options the ScxmlLoadOptions with property mapping (list of ScxmlOptions)
 * @param  {Function} callback the callback when SCXML compilation has been completed: callback(error | null, compiledStatechart, map, meta)
 * @param  {any} [_map] source mapping (unused)
 * @param  {any} [_meta] meta data (unused)
 */
declare function compile(content: string, scxmlFile: string, options: StateCompilerOptions, callback: CompilerCallback, _map: any, _meta: any): void;
declare const _default: {
    compile: typeof compile;
};
export = _default;
