import { StateCompilerOptions } from '../index.d';
declare function prepareCompile(options: StateCompilerOptions): Promise<void>;
declare function compile(loadOptions: StateCompilerOptions): Promise<Array<Error | Error[]> | any[]>;
declare const _default: {
    prepareCompile: typeof prepareCompile;
    compile: typeof compile;
};
export = _default;
