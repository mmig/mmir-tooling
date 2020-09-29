import { GrammarCompilerOptions } from '../index.d';
declare function prepareCompile(options: GrammarCompilerOptions): Promise<void>;
declare function compile(grammarLoadOptions: GrammarCompilerOptions): Promise<Array<Error | Error[]> | any[]>;
declare const _default: {
    prepareCompile: typeof prepareCompile;
    compile: typeof compile;
};
export = _default;
