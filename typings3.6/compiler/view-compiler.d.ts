import { ViewCompilerOptions } from '../index.d';
declare function prepareCompile(options: ViewCompilerOptions): Promise<void>;
declare function compile(loadOptions: ViewCompilerOptions): Promise<Array<Error | Error[]> | any[]>;
declare const _default: {
    prepareCompile: typeof prepareCompile;
    compile: typeof compile;
};
export = _default;
