import { ViewCompilerOptions, CompilerCallback } from '../index.d';
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
declare function compile(content: string, viewFile: string, options: ViewCompilerOptions, callback: CompilerCallback, _map: any, _meta: any): void;
declare const _default: {
    compile: typeof compile;
};
export = _default;
