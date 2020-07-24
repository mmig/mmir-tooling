declare function parseRuntimeConfigurationForOptions(options: any, config: any): any;
declare function toAliasPath(grammar: any): string;
declare function toAliasId(grammar: any): string;
declare const _default: {
    /**
     * parse directories for JSON grammars and create/return GrammarEntry list
     *
     * @param  {GrammarOptions} options the grammar options where
     * 										options.path: REQUIRED the directory from which to add the grammars, and has the following structure:
     * 																				<directory>/<grammar-id-1>/grammar.json
     * 																				<directory>/<grammar-id-2>/grammar.json
     * 																				...
     * 										options.grammars: OPTIONAL a map of grammar IDs, i.e. {[grammarID: string]: GrammarOption} with specific options for compiling the corresponding JSON grammar:
     *														options.grammars[id].engine {"jscc" | "jison" | "pegjs"}: OPTIONAL the Grammar engine that will be used to compile the executable grammar.
     *																																									DEFAULT: "jscc"
     *														options.grammars[id].async {Boolean}: OPTIONAL if <code>true</code>, and the execution environment supports Workers, then the grammar will be loaded
     *																																			in a Worker on app start-up, i.e. execution will be asynchronously in a worker-thread
     *														options.grammars[id].exclude {Boolean}: OPTIONAL if <code>true</code>, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
     *																																				from the corresponding JSON grammar
     *														options.grammars[id].ignore {Boolean}: OPTIONAL if <code>true</code>, the grammar will not be loaded
     *														                                   (and registered) when the the app is initialized, i.e. needs to be
     *														                                   "manually" loaded/initialized by app implementation and/or other mechanisms.
     *														                                   If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
     *														                                   and then will be available e.g. via <code>mmir.semantic.interpret(<input phrase string>, <grammar-id>)</code>.
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param {Array<GrammarEntry>} [grammarList] OPTIONAL list of GrammarEntry objects, to which the new entries (read from the options.directory) will be added
     * 																					if omitted, a new list will be created and returned.
     * 										GrammarEntry.id {String}: the grammar id (usually the language code, e.g. "en" or "de")
     * 										GrammarEntry.file {String}: the path to the JSON grammar (from which the executable grammar will be created)
     * 										GrammarEntry.engine {"jscc" | "jison" | "pegjs"}: OPTIONAL the Grammar engine that will be used to compile the executable grammar.
     * 																												DEFAULT: "jscc"
     * 										GrammarEntry.ignore {Boolean}: OPTIONAL if <code>true</code>, the grammar will not be loaded
     * 										                                   (and registered) when the the app is initialized, i.e. needs to be
     * 										                                   "manually" loaded/initialized by app implementation and/or other mechanisms.
     * 										                                   If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
     * 										                                   and then will be available e.g. via <code>mmir.semantic.interpret(<input phrase string>, <grammar-id>)</code>.
     * 										GrammarEntry.async {Boolean}: OPTIONAL if <code>true</code>, and the execution environment supports Workers, then the grammar will be loaded
     * 																												in a Worker on app start-up, i.e. execution will be asynchronously in a worker-thread
     * 										GrammarEntry.initPhrase {String}: OPTIONAL an initalization phrase that will be executed, if grammar is set for async-execution
     * 										GrammarEntry.asyncCompile {Boolean}: OPTIONAL if <code>true</code>, and the build environment supports Workers, then the grammar will be compiled
     * 																												in a Worker (during build)
     * @return {Array<GrammarEntry>} the list of GrammarEntry objects
     */
    jsonGrammarsFromDir: (options: any, appRootDir: any, grammarList: any) => any;
    /**
     * add grammars from options.grammar map {[grammarID: string]: GrammarOption}, if the GrammarOption has a <code>file</code> field set.
     * @param  {GrammarOptions} options the grammar options with field options.grammars
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param  {{Array<GrammarEntry>}} [grammarList] OPTIONAL
     * @return {{Array<GrammarEntry>}}
     */
    jsonGrammarsFromOptions: (options: any, appRootDir: any, grammarList: any) => any;
    /**
     * parse RuntimeConfiguration for grammar-related settings and "convert" them to the corresponding GrammarOptions
     * @param  {GrammarOptions} options the grammar options
     * @param  {RuntimeConfiguration} config the runtime configuration settings
     * @return {GrammarOptions} the grammar options with new/modified options from RuntimeConfiguration
     */
    parseRuntimeConfigurationForOptions: typeof parseRuntimeConfigurationForOptions;
    /**
     * apply the "global" options from `options` or default values to the entries
     * from `grammarList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {GrammarOptions} options the grammar options
     * @param  {{Array<GrammarEntry>}} grammarList
     * @return {{Array<GrammarEntry>}}
     */
    applyDefaultOptions: (options: any, grammarList: any) => any;
    /**
     * add grammars to (webpack) app build configuration
     *
     * @param  {Array<GrammarEntry>} grammars list of GrammarEntry objects:
     * 										grammar.id {String}: the grammar id (usually the language code, e.g. "en" or "de")
     * 										grammar.file {String}: the path to the JSON grammar (from which the executable grammar will be created)
     * 										grammar.ignore {Boolean}: OPTIONAL if <code>true</code>, the grammar will not be loaded
     * 										                                   (and registered) when the the app is initialized, i.e. needs to be
     * 										                                   "manually" loaded/initialized by app implementation and/or other mechanisms.
     * 										                                   If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
     * 										                                   and then will be available e.g. via <code>mmir.semantic.interpret(<input phrase string>, <grammar-id>)</code>.
     * @param  {[type]} appConfig the app configuration to which the grammars will be added
     * @param  {[type]} directories the directories.json representation
     * @param  {ResourcesConfig} _resources the resources configuration
     * @param  {[type]} runtimeConfiguration the configuration.json representation
     */
    addGrammarsToAppConfig: (grammars: any, appConfig: any, directories: any, _resources: any, runtimeConfiguration: any) => void;
    toAliasId: typeof toAliasId;
    toAliasPath: typeof toAliasPath;
};
export = _default;
