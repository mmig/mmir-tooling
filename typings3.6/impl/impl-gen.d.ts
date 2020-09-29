import { CompilerCallback, ImplementationCompilerOptions } from '../index.d';
/**
 * compile/convert implementation (controller, helper, model) as module
 *
 * @param  {string} content the implementation code as string
 * @param  {string} implFile the path of the implementation file (for debugging/error information)
 * @param  {ImplLoadOptions} options the ImplLoadOptions with property mapping (list of ImplOptions)
 * @param  {Function} callback the callback when impl. compilation has been completed: callback(error | null, compiledImpl, map, meta)
 * @param  {any} [_map] source mapping (unused)
 * @param  {any} [_meta] meta data (unused)
 */
declare function compile(content: string, implFile: string, options: ImplementationCompilerOptions, callback: CompilerCallback, _map: any, _meta: any): void;
declare const _default: {
    compile: typeof compile;
};
export = _default;
