
/* ********************************************* */
/* ** NOTE do not change directly:            ** */
/* **      original source file is located at ** */
/* **      /assets/index.d.ts                 ** */
/* ********************************************* */

/**
 * @packageDocumentation
 * @module mmir-tooling
 */

/// <reference types="mmir-lib" />

import { MediaManagerPluginEntry, GrammarEngineType } from 'mmir-lib';//FIXME

export * from './index-webpack';

/**
 * `mmir-tooling` generates/compiles/builds _mmir_ resources, e.g.
 * grammars or state-models.
 *
 * @see [[apply]]
 * @module mmir-tooling
 */

/**
 * compiles the _mmir_ resources:
 * configure/include/compile/generate _mmir_ resources (e.g. grammars, state-models)
 *
 * @param buildConfig the _mmir_ build configuration
 *
 * @returns a promise that is resolved when compilation has completed.
 *          If errors ocurred during compilation, the promise is resolved
 *          with a list of errors.
 */
export function apply(buildConfig: BuildAppConfig): Promise<Error[]>;

/**
 * @example
 * ```
 * var appConfig = {
 * 	//path to directory that contains classic mmir directory structure
 * 	resourcesPath: 'src/mmir',
 * 	resourcesPathOptions: {
 * 		//for included models, controllers, helpers: convert old-style
 * 		// implementations by adding an export statement
 * 		addModuleExport: true,
 * 		//exlude model implementations, and do not include JSON grammar resources
 * 		exclude: ['models', 'settings/grammar']
 * 	},
 * 	//utilize jQuery in mmir instead of (less backwards compatible)
 * 	// alternative implementations (npm package jquery needs to be installed!)
 * 	jquery: true,
 * 	//specify language for runtime configuration (== configuration.json)
 * 	configuration: {language: 'en'},
 * 	//do include controller implementation found within resourcesPath
 * 	// (NOTE: this is the default behavior)
 * 	controllers: true,
 * 	//do NOT include helper implemenations found within resourcesPath
 * 	helpers: false,
 * 	//...
 * }
 * ```
 */
export interface AppConfig {

    /** used for resolving non-absolute paths: the absolute path to the app's root/sources directory (if omitted the current working directory is used for resolving non-absolute paths) */
    rootPath?: string;

    /** specify the path to the MMIR resources directory with the default structure:
     *  ```bash
     *  config/
     *        /languages/
     *                  /<lang>/
     *                         /grammar.json
     *                         /dictionary.json
     *                         /speech.json
     *        /states/
     *               /input.xml
     *               /dialog.xml
     *        /configuration.json
     *  controllers/*
     *  helpers/*
     *  models/*
     *  views/*
     *  ```
     *
     * The path will be used to collect all available resources and create the correspondig
     * options for including them.
     *
     * @default "www"
     */
    resourcesPath?: string;
    resourcesPathOptions?: ResourcesOptions;

    /**
     * Specify how (JSON) grammars should be parsed/included, and/or
     * specify additional grammars that should be included.
     *
     * Compiled grammars will be available via the [[SemanticInterpreter]].
     *
     * If `false`, grammars will be excluded/ignored.
     */
    grammars?: GrammarOptions | boolean;
    /**
     * Specify how (SCXML) state-machines/-models should be parsed/included, and/or
     * specify additional state-models that should be included.
     *
     * If `false`, state-models will be excluded/ignored.
     *
     * By default, if no state-models are include, "minimal" state-models
     * for the [[InputManager]] and the [[DialogManager]] will be included,
     * see [mmir-tooling/defaultValues](https://github.com/mmig/mmir-tooling/tree/master/defaultValues).
     */
    states?: StateOptions | boolean;

    /**
     * Specify how (mmir) views should be parsed/included, and/or
     * specify additional views that should be included.
     *
     * If `false`, views will be excluded/ignored.
     */
    views?: ViewOptions | boolean;

    /**
     * Specify how (mmir) configuration and settings should be parsed/included,
     * and/or specify additional settings that should be included.
     *
     * The `mmir` configuration/settings are the resources that are by default
     * located in the mmir `config/` directory
     * (with exception of the `states` sub-directory; for those instead use [[WebpackAppConfig.states]]):
     *  ```bash
     *  config/
     *        /languages/
     *                  /<lang>/
     *                         /grammar.json
     *                         /dictionary.json
     *                         /speech.json
     *        /states/
     *               /input.xml
     *               /dialog.xml
     *        /configuration.json
     * ```
     * (NOTE the `config/states/` sub-directory is handled/configured via the the [[states]] option)
     */
    settings?: SettingsOptions | boolean;
    /**
     * Specify additional (mmir) runtime configuration values,
     * e.g. in addition to `config/configuration.json`.
     *
     * In case of conflicts, these settings will override settings in
     * `config/configuration.json`,
     */
    configuration?: RuntimeConfiguration;

    // //TODO support plugin-integration via options? would need to create/update configuration.json and settings/speech/<lang>
    // includePlugins?: Array<PluginOptions>;

    // //TODO? support "modularizing" impl files?
    // controllers?: ControllerOptions | boolean;
    // helpers?: HelperOptions | boolean;
    // models?: ModelOptions | boolean;
}

export type ModuleId = string;//TODO explicitly specify MMIR module IDs

/**
 * maps module IDs to file paths:
 * if the path is not absolute, it will be resolved against the mmir-lib path, if it starts with "mmirf/",
 * otherwise against the rootPath.
 */
export type ModulePaths = {[moduleId: string]: string};

/**
 * specifies a package that contains modules ()
 * if the path is not absolute, it will be resolved against the mmir-lib path, if it starts with "mmirf/",
 * otherwise against the rootPath.
 */
export type ModulePackage = {name: string, location: string};

/**
 * @example
 * ```
 * var grammarOptions = {
 * 	path: './grammars',
 * 	engine: 'pegjs',
 * 	asyncCompile: false,
 * 	grammars: {
 * 		ja: {ignore: true},
 * 		de: {exclude: true},
 * 		en: {engine: 'jscc', asyncCompile: true},
 *
 * 		//specifying JSON grammar files directly
 * 		testing: {engine: 'jscc', file: path.resolve('./grammar-test/en/grammar.json')},
 * 		testing2: {id: '!id warning!', engine: 'jison', file: path.resolve('./grammar-test/de/grammar.json_large-example')}
 * 	}
 * };
 * ```
 */
export interface GrammarOptions extends GrammarOption {
    /** file path for searching (recursively) JSON grammars within languages-subdirectory:
     * `path/.../<grammar ID>/grammar.json`
     */
    path?: string;
    /** options for handling found or specified JSON grammars */
    grammars?: {[grammarId: string]: GrammarEntry};
}

export type ResourceType = 'grammar' | 'view' | 'state';

export interface BuildOptions {
    /**
     * directory to which the compiled resources like grammars (and checksum files) will be stored
     *
     * by default, the relative paths are resolved against the app's root directory;
     * if the target directory is missing it will be newly created.
     *
     * @default [[BuildAppConfig.targetDir]] + [[ResourceType]]
     */
    targetDir?: string;
    /**
     * if TRUE the targets will be newly created and written to the targetDir,
     * even if the existence or up-to-date check returns `true`
     */
    force?: boolean;
}

export interface BuildAppConfig extends AppConfig {
    /**
     * directory to which the compiled resources (and checksum files) will be stored:
     * for each resource type (e.g. grammar, view) a subdirectory will be created into
     * which the resources will be stored.
     *
     * By default, the relative paths are resolved against the app's root directory;
     * if the target directory is missing it will be newly created.
     *
     * @default "www"
     * @see [[ResourceType]]
     */
    targetDir?: string;

    /**
     * if `directories.json` should include the view template files (`*.ehtml`)
     * e.g. for up-to-date test & runtime-compilation of view templates
     *
     * @default true
     */
    includeViewTemplates?: boolean;
    /**
     * if `directories.json` should include the SCXML files (`*.xml`)
     * e.g. for up-to-date test & runtime-compilation of state models
     *
     * @default true
     */
    includeStateModelXmls?: boolean;

    /**
     * directory to which the generated `directories.json` file should be written:
     * `directories.json` contains the listing of available mmir resources.
     *
     * NOTE if this file is not in the expected location, initialization of
     *      `mmir` may fail during runtime, i.e. use this option with care!
     *
     * @default targetDir + "/gen"
     */
    directoriesTargetDir?: string;

    grammars?: GrammarBuildOptions | boolean;
    states?: StateBuildOptions | boolean;

    views?: ViewBuildOptions | boolean;

    /** NOTE settings files may be written to the (settings) targetDir if
     * (1) the [[SettingsBuildOptions.include]] option is set to 'file'
     * (2) if the file already exists in the targetDir it is overwritten if the [[SettingsBuildOptions.force]] option is enabled
     *
     * The `include` and `force` option can be set either in the SettingsBuildOptions, or in the specific SettingsBuildEntry/ies.
     */
    settings?: SettingsBuildOptions | boolean;
    /**
     * `mmir` runtime configuration:
     * instead of, or modifying/overwriting configuration settings in `configuration.json`
     *
     * NOTE only takes effect, if settings options `inlcude` (or in its sub-option) is set 'file'
     * (and possibly force, to enable overwriting existing files), so that settings files will be written
     */
    configuration?: RuntimeConfiguration;
}

export interface GrammarBuildOptions extends GrammarOptions, BuildOptions {
    /** @override */
    grammars?: {[grammarId: string]: GrammarBuildEntry};
}
export interface GrammarBuildEntry extends GrammarEntry, BuildOptions {
    fileType?: 'json' | 'js';
}

export interface ViewBuildOptions extends ViewOptions, BuildOptions {}
export interface ViewBuildEntry extends ViewEntry, BuildOptions {}

export interface ImplementationBuildEntry extends ImplementationEntry {
    id?: string;
}

export interface SettingsBuildOptions extends SettingsOptions, BuildOptions {
    /** @override */
    configuration?: boolean | SettingsBuildEntry;
    /** @override */
    dictionary?: boolean | {[id: string]: SettingsBuildEntry};
    /** @override */
    grammar?: boolean | {[id: string]: SettingsBuildEntry};
    /** @override */
    speech?: boolean | {[id: string]: SettingsBuildEntry};
}
export interface SettingsBuildEntry extends SettingsEntryOptions, BuildOptions {
    value?: any;
}
export interface SettingsBuildEntryMultiple extends SettingsEntryOptionsMultiple, BuildOptions {
    value?: any;
}

export interface StateBuildOptions extends StateOptions, BuildOptions {
    /**
     * the module type of the generated/compiled state machine
     * @default "amd"
     */
    moduleType?: "amd" | "commonjs";

    models?: StateModelsBuildOption;

    /**
     * if default models for 'input' and 'dialog' are created, specifies their
     * mode
     * (defaults will be created, if no definition for the models is specified
     *  or can be found the the resources path(s))
     */
    defaultType?: StateModelMode | 'minimal';
}
export interface StateModelBuildEntry extends StateModelEntry, BuildOptions {

    /**
     * The ID for state model
     *
     * NOTE: should not be set manually:
     *      ID will be derived from entry key of models property of the containing StateOptions
     */
    id?: string;

    /**
     * the module type of the generated/compiled state machine
     * @default "amd"
     */
    moduleType?: "amd" | "commonjs";
}

export interface StateModelsBuildOption extends StateModelsOption {
    dialog?: StateModelBuildEntry;
    input?: StateModelBuildEntry;
    [id: string]: StateModelBuildEntry;
}

export interface GrammarOption {
    /** the Grammar engine that will be used to compile the executable grammar.
     * @default "jscc"
     */
    engine?: GrammarEngineType;
    /**
     * if `true`, and thread-webworker is available, grammar will be compiled paralelized / in a separate thread
     * @default true
     */
    asyncCompile?: boolean;
    /**
     * if `true`, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
     * from the corresponding JSON grammar
     */
    exclude?: boolean;
    /**
     * if `true`, the grammar will not be loaded (and registered) when the the app is initialized, i.e. needs to be
     *   "manually" loaded/initialized by app implementation and/or other mechanisms.
     * If omitted or `false`, the grammar will be loaded on start-up of the app,
     *   and then will be available e.g. via `mmir.semantic.interprest(<input phrase string>, <grammar-id>)`
     */
    ignore?: boolean;
    /**
     * grammar-execution (during runtime) will be asynchronous in a WebWorker/thread
     *
     * NOTE: invocations must always provide a callback, for async-exec grammars
     * @example
     * mmir.semantic.interpret('this is my test phrase', function(result){
     * 	// do something with grammar execution result
     * })
     */
    async?: boolean;
    /**
     * set or disable strict-mode for generated JavaScript code
     * @default true
     */
    strict?: boolean;
    /**
     * An "initialization phrase" for the grammar, in case of async-exection:
     * this phrase will be immediately interpreted, after grammar has been loaded for async-execution in the WebWorkers
     * (for large grammars, this may reduce delays for subsequent calls, by fully initializing the grammar)
     *
     * NOTE will have no effect, if option [[async]] is not `true`
     */
    initPhrase?: string;
}

export interface GrammarEntry extends GrammarOption {
    /**
     * the grammar ID
     *
     * WARNING will be automatically set -- if it is manully set, it may get overwritten!
     */
    id?: string;
    /**
     * for specifying the JSON grammar directly (e.g. instead or in addition of parsing `path` for grammar files):
     * the (absolute) path to the JSON grammar (from which the executable grammar will be created)
     */
    file?: string;
}

/**
 * @example
 * ```
 *		var settingOptions = {
 *		 	path: path.resolve('./config'),
 *		 	configuration: false,
 *		 	grammar: {
 *		 		ja: {exclude: true}
 *		 	},
 *		 	speech: {
 *		 		de: {exclude: true},
 *		 		en: {include: 'file'}
 *		 	},
 *		 	dictionary: {
 *		 		ja: {include: 'file'}
 *		 	}
 *		 };
 * ```
 */
export interface SettingsOptions {
    /** file path for searching settings:
     * ```bash
     * path/.../<language ID>/grammar.[json | js]
     *                       /dictionary.[json | js]
     *                       /speech.[json | js]
     * configuration.[json | js]
     * ```
     */
    path?: string;

    /**
     * pattern for excluding settings:
     * if pattern matches SettingsEntryOptions.type, the settings will be excluded
     */
    excludeTypePattern?: RegExp | Array<SettingsType>;

    /**can be used to include the resource as separate file, instead of bundeling via webpack
     * @default "inline" if webpack build, otherwise "file"
     */
    include?: 'inline' | 'file';

    /** options for the configuration.json (or .js) entry; if FALSE, the resource will be ignored */
    configuration?: boolean | SettingsEntryOptionsMultiple;
    /** options-map for the dictionary.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored */
    dictionary?: boolean | {[id: string]: SettingsEntryOptions};
    /** options-map for the grammar.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored */
    grammar?: boolean | {[id: string]: SettingsEntryOptions};
    /** options-map for the speech.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored */
    speech?: boolean | {[id: string]: SettingsEntryOptions};
}

export interface SettingsEntryOptions extends SettingsEntryOptionsBase {
    /**  for explicitly specifying the settings-resource directly (e.g. instead or in addition of parsing `path` for settings resource files) */
    file?: string;
}

export interface SettingsEntryOptionsMultiple extends SettingsEntryOptionsBase {
    /**  for explicitly specifying the settings-resource directly (e.g. instead or in addition of parsing `path` for settings resource files) */
    file?: string | string[];
}

export interface SettingsEntryOptionsBase {
    /** if `true`, the corresponding resource will be excluded (when parsing `path`) */
    exclude?: boolean;

    /**can be used to include the resource as separate file, instead of bundeling via webpack
     * @default "inline"
     */
    include?: 'inline' | 'file';

    /** the settings-type _(should not be set manually)_ */
    type?: SettingsType;
    /** the ID for the settings-resources _(should not be set manually)_ */
    id?: string;
    /** the settings-file-type _(should not be set manually)_:\
     * derived from the file-extension, either "json" or "js".
     *
     * If .js file, it MUST be a CommonJS module that exports the settings object as its only/default export, i.e.\
     * ```javascript
     * module.exports = settingsObject;
     * ```
     * any dynamic code is evaluated at compile-time, i.e. the exported settings-object must not contain dynamic content
     */
    fileType?: 'js' | 'json';
}

export type SettingsType = 'configuration' | 'dictionary' | 'grammar' | 'speech' | 'speech-all';

/**
 * @example
 * ```
 * var stateOptions = {
 * 	path: 'www/config/states',
 * 	ignoreErrors: true,
 * 	models: {
 * 		input: {
 * 			mode: 'simple',
 * 			file: './alt_config/states_minimal/input.xml',
 * 			strict: false
 * 		},
 * 		dialog: {
 * 			ignoreErrors: false,
 * 			mode: 'extended'
 * 		}
 * 	}
 * };
 * ```
 */
export interface StateOptions extends StateModelOption {

    /** file path for searching (recursively) for SCXML files (state-models):
     * ```bash
     * path/.../dialog.xml -> type "dialog"
     *         /input.xml  -> type "input"
     * ```
     *
     * NOTE: for backwards compatibility, the following file names are also accepted
     *       and mapped to their corresponding type
     * ```bash
     *         "dialogDescriptionSCXML.xml" -> "dialog"
     *         "inputDescriptionSCXML.xml" -> "input"
     * ```
     *
     * Or custom state models (SCXML definitions) with file extension `.xml`.
     *
     */
    path?: string;
    /**
     * optionally specify options for found resource, or specifying resources/locations directly
     *
     * If `input` or `dialog` are missing (e.g. no resources matching them could be found),
     * default "minimal" state-models will be used for `inputManager` and `dialogManager`.
     *
     * NOTE: for custom state-models whichs' files are determined by parsing [[StateOptions.path]],
     *       the `id` will be the file name (case sensitive, without extension).
     */
    models?: StateModelsOption;
}

export interface StateModelsOption {
    /** default state model for dialog states */
    dialog?: StateModelEntry;
    /** default state model for input states */
    input?: StateModelEntry;
    [id: string]: StateModelEntry;
}

export interface StateModelOption {

    /**
     * the module ID for state interpreter:
     * if the interpreter is registered, it can be `require`'d using the `moduleId`, e.g.
     * ```
     * var stateManager = mmir.require(<moduleId>);
     * ```
     *
     * (the `moduleId` will be automatically set for `inputManager` and `dialogManager`)
     *
     */
    moduleId?: string;

    /** if `true`, the corresponding resource will be excluded (when parsing `path`) */
    exclude?: boolean;

    /**
     * run SCXML model in "simple" or "extended" mode
     * @default "extended"
     */
    mode?: StateModelMode;

    /** if `true`, runtime errors will be ignored.
     *  if `false` (or omitted) the compilation will fail with an error message
     *  when encountering SCXML runtime errors.
     *
     * NOTE: if ignored, the runtime errors will be triggered when the state-machine
     *       enters the corresponing state during runtime!
     *
     * @default false
     */
    ignoreErrors?: boolean;
    /**
     * set or disable strict-mode for generated JavaScript code
     * @default true
     */
    strict?: boolean;
}

export type StateModelMode = "extended" | "simple";

export interface StateModelEntry extends StateModelOption {
    /**  for explicitly specifying the state-machine directly (e.g. instead or in addition of parsing `path`) */
    file?: string;
}

/** runtime configuration: same as config/configuration.json */
export interface RuntimeConfiguration {

    /**
     * The language (code) that will be used by `mmir`, e.g.
     * for speech synthesis (TTS) or recognition (ASR).
     *
     * Can be changed during runime with [[LanguageManager.setLanguage]]
     *
     * @default "en"
     */
    language?: string;

    /** grammar-compiler/-engine for compiling new grammars */
    grammarCompiler?: GrammarEngineType;
    /** if selected language only has JSON grammar, prevents automatic compilation */
    usePrecompiledGrammarsOnly?: boolean;
    /** if JSON grammar is compiled during runtime, use async (i.e. web worker) compilation */
    grammarAsyncCompileMode?: boolean;
    /** when compiling JSON grammar: disable setting JavaScript strict mode for compiled grammar */
    grammarDisableStrictCompileMode?: boolean;
    /**
     * list of grammars (IDs) which should not be automatically loaded on startup, even if compiled/JSON grammar is available for the language
     *
     * If `true`, no file compiled grammars will be loaded on start-up (i.e. all IDs will be ignored for start-up)
     */
    ignoreGrammarFiles?: Array<string> | true;
    /**
     * list of (compiled) grammars (IDs) which should be initialized for asynchronous execution, i.e. should be exectuted in WebWorker/thread
     *
     * If `true`, all (compiled) grammar will be initialized for asynchronous execution.
     *
     * If list, an additional "initialization-phrase" may be specified by using `{id: string, phrase: string}`:
     * a phrase that should be immediately interpreted, after grammar has been loaded in the WebWorkers
     * (for large grammars, this may reduce delays for subsequent calls, by fully initializing the grammar)
     */
    grammarAsyncExecMode?: Array<string | AsyncGramarExecEntry> | true;

    /**
     * detect if compiled state-models (i.e. JS-compiled SCXML files) are present & should be used
     * instead of loading & compiling SCXML files at runtime.
     *
     * NOTE this is ignored in `webpack` build (since state-models will always be pre-compiled in `webpack` builds).
     *
     * @default  true
     */
    detectCompiledStateModels?: boolean;

    /**
     * name of the default layout definition when rendering mmir view templates: if `null`, no default layout will be used.
     *
     * @default "Default"
     */
    defaultLayoutName?: 'Default' | string | null;
    /**
     * if `false`, (mmir) view templates will be (re-)compiled upon app startup
     *
     * NOTE will be ignored in `webpack` build
     */
    usePrecompiledViews?: boolean;

    /** configuration for media plugins, e.g. for speech recognition (ASR) and synthesis (TTS) */
    mediaManager?: MediaManagerPluginsConfig;

    /**
     * dot-separated namespace for accessing the controller implementation's constructors
     * (within global namespace, e.g. `"app.ctrl" -> [window | self | global].app.ctrl`)
     * @deprecated use module format (AMD / UMD / CommonJS (only in webpack-build) / ...) instead
     */
    controllerContext?: string;
    /**
     * dot-separated namespace for accessing the model implementation's constructors
     * (within global namespace, e.g. `"app.ctrl" -> [window | self | global].app.ctrl`)
     * @deprecated use module format (AMD / UMD / CommonJS (only in webpack-build) / ...) instead
     */
    modelContext?: string;

    /**
     * custom/additional configuration/settings:
     *
     * E.g. mmir-plugins may support additional settings (see corresponding documentation of the plugin),
     * or app-specific settings my be specified and used.
     */
    [configField: string]: any;
}


// export type MediaPluginEnvType = 'browser' | 'cordova' | 'android' | 'ios';
export type MediaManagerPluginsConfig = {
    plugins?: {
        browser?: Array<mmir.MediaManagerPluginEntry>;
        cordova?: Array<mmir.MediaManagerPluginEntry>;
        android?: Array<mmir.MediaManagerPluginEntry>;
        ios?: Array<mmir.MediaManagerPluginEntry>;
        [env: string]: Array<mmir.MediaManagerPluginEntry>
    };
};

export type AsyncGramarExecEntry = {id: string, phrase: string};

/** module configuration: analogous to config-entry in requirejs configuration */
export type ModuleConfigOptions = {[moduleId: string]: ModuleConfig};

/** module configuration: analogous to config-entry in requirejs config-entries */
export type ModuleConfig = {[configName: string]: any} & {logLevel?: mmir.LogLevelNum | mmir.LogLevel};

/** options for handling found resources when parsing the resourcesPath */
export interface ResourcesOptions {
    /** for automatically converting old-style implementations that are no CommonJS or AMD modules:
     * if `true`, explicitly exports the implementation resource (i.e. as module.exports)
     * @see ImplementationEntry
     */
    addModuleExport?: boolean;
    /** excludes the specified resources types when parsing the `resourcesPath` */
    exclude?: Array<ResourceTypeName>;

    /** exclude mmir resource directory `config` from parsing for settings */
    config?: false;
    /** exclude mmir resource directory `controllers` from parsing for settings */
    controllers?: false;
    /** exclude mmir resource directory `helpers` from parsing for settings */
    helpers?: false;
    /** exclude mmir resource directory `models` from parsing for settings */
    models?: false;
    /** exclude mmir resource directory `views` from parsing for settings */
    views?: false;
}

/** a resource type; corresponds to field names in AppConfig */
export type ResourceTypeName = string;

export interface ViewOptions {
    /** file path for searching view files:
     * ```bash
     * path/views/<controller ID>/*.ehtml
     * path/layouts/<controller ID>.ehtml
     * ```
     */
    path?: string;
    /**
     * set or disable strict-mode for generated JavaScript code
     * @default true
     */
    strict?: boolean;
}

export interface ViewEntry {
    id: string;
    ctrlName: string;
    viewName: string;
    file: string;
    viewImpl: 'mmirf/layout' | 'mmirf/partial' | 'mmirf/view';
    isLayout: boolean;
    isPartial: boolean;
    strict: boolean;
}

/**
 * @example
 * ```
 * var ctrlOptions = {
 * 	path: './implementations_all/controllers',
 * 	controllers: {
 * 		application: {
 * 			addModuleExport: true
 * 		},
 * 		calendar: {
 * 			file: path.resolve('./implementations/controllers/calendar.js')
 * 		},
 * 		application2: false,
 * 		application3: {exclude: true},
 * 	}
 * };
 * ```
 */
export interface ControllerOptions extends ImplementationOption {
    /** file path for (recursively) searching controller implementation files:
     * `path/<controller ID>.js`
     */
    path?: string;
    controllers?: boolean | {[id: string]: ImplementationEntry | boolean};
}

/**
 * @example
 * ```
 * var helperOptions = {
 * 	path: './implementations_all/helpers',
 * 	addModuleExport: true,
 * 	helpers: {
 * 		calendarHelper: {exclude: false}
 * 	}
 * };
 * ```
 */
export interface HelperOptions extends ImplementationOption {
    /** file path for (recursively) searching helper implementation files:
     * `path/.../<controller ID>Helper.js`
     */
    path?: string;
    helpers?: boolean | {[id: string]: ImplementationEntry | boolean};
}

/**
 * @example
 * ```
 * var modelOptions = {
 * 	path: './implementations_all/models',
 * 	models: {
 * 		user: {addModuleExport: 'mmir.User'},
 * 		calendarModel: {addModuleExport: 'mmir.CalendarModel'}
 * 	}
 * };
 * ```
 */
export interface ModelOptions extends ImplementationOption {
    /** file path for searching (data) model implementation files:
     * `path/<model ID>.js`
     */
    path?: string;
    models?: boolean | {[id: string]: ImplementationEntry | boolean};
}

export type AnyImplementationOptions = ModelOptions | HelperOptions | ControllerOptions;

export interface ImplementationOption {

    /** if `true`, the corresponding implementation will be excluded (when parsing `path`) */
    exclude?: boolean;

    /** for automatically converting old-style implementations that are no CommonJS or AMD modules:
     * if true, explicitly exports the implementation resource, i.e. adds something like
     * <pre>
     * module.exports.<resource name> = <resource constructor>;
     * </pre>
     * to the implementation source/module.
     *
     * If string, the specified string will be used for the export.
     */
    addModuleExport?: boolean | string;
}

export interface ImplementationEntry extends ImplementationOption {

    /**  for explicitly specifying the implementation-file directly (e.g. instead or in addition of parsing `path`) */
    file?: string;

    /** the implementation's name (usually the ID with capitalized first letter) */
    name?: string;

    /** the implementation's type (should not be explicitly specified) */
    type?: ImplementationType;
}

export type ImplementationType = "controller" | "helper" | "model";

export interface VirtualImplementationEntry {
    /** module identifier (for use in `require(<moduleName>)`) */
    moduleName: string;
    /** (javascript) module code */
    contents: string;
}

/**
 * @example
 * ```
 * var includePlugins = [
 *	{id: 'mmir-plugin-asr-nuance-xhr', config: {
 *    // ctx: 'nuance',//OPTIONAL install into sub-context "nuance"
 *      appKey: "9...",
 *      appId: "NMDPTRIAL....",
 *	}},
 *  {id: 'mmir-plugin-asr-google-xhr',
 *    mode: 'wasm',
 *    config: {
 *      appKey: 'A....',
 *      results: 5
 *  }},
 *  {id: 'mmir-plugin-tts-nuance-xhr', config: {
 *    appKey: "9....",
 *    appId: "NMDPTRIAL_...",
 *    voice: {fr: 'Samantha'},
 *    language: {ja: 'jpn-JPN'}
 *  }},
 *  {id: 'mmir-plugin-tts-speakjs', config: {
 *    env: 'browser',
 *    ctx: 'local' //OPTIONAL install into sub-context "local"
 *  }},
 *  {id: 'mmir-plugin-speech-android', config: {
 *    // ctx: 'android',//OPTIONAL install into sub-context "android"
 *    voice: {de: 'male'},
 *    language: {en: 'eng-IND'}
 *  }},
 * ];
 * ```
 */
export interface PluginOptions {
    /**
     * the (package) ID of the plugin
     * NOTE: the plugin needs to be installed, i.e. "npm install ..."
     */
    id: string;
    /** mode for including the plugin: if the plugin does not support the specified mode, will automatically use "default" mode */
    mode?: PluginModeOption;
    /**
     * configuration for the plugin: specific fields/values depending on the plugin
     * NOTE some plugins require credentials, e.g. "appId" and "appKey"
     */
    config?: PluginConfig | TTSPluginSpeechConfig;
    /**
     * if supported by plugin:
     * custom build options.
     *
     * NOTE if the plugin does not support custom build configuration, this
     *      will be ignored.
     */
    build?: Array<PluginExportConfigInfo | PluginExportConfigInfoMultiple>;
}

export type PluginModeOption = 'wasm' | 'min' | 'default';

export type PluginConfig = MediaManagerPluginEntry & {[config: string]: any};

export type PluginExportInfo = {
    id: string;
    paths: {[moduleId: string]: string};
    workers: string[];
    modules: string[];
    files: string[];
    dependencies: string[];
    modes?: {[pluginModeOption: string]: PluginExportModeEntry};
    /** the (relative) module / file in the package that contains the build config */
    buildConfig?: string;
    /**
     * HELPER returns all entries for field <code>type</code>, (recursively) including the
     *        corresponding field from dependencies
     * @param       {"paths" | "workers" | "modules" | "dependencies" | "files"} type the field for which to gather entries
     * @param       {"min" | String} [mode] OPTIONAL if the type should be modified according to a mode
     * @param       {Boolean} [isResolve] OPTIONAL for type "paths" will make the paths absolute w.r.t. the corresponding module/dependency
     *                                             (NOTE the absolute path may not be normalized, i.e. contain mixed path separators);
     * @return      {Object|Array} the "collected" entries for the requested type
     */
    getAll(type: PluginExportType, mode?: PluginModeOption | string, isResolve?: boolean): string[] | {[moduleId: string]: string} | {[pluginModeOption: string]: PluginExportModeEntry};
    /**
     * HELPER returns list of (mmir) build configurations (to be merged into the main mmir build configuration)
     *
     * @param       {String} [pluginName] OPTIONAL if specified and multiple plugin-definitions are specified, only the build-configs for the specified plugin are include (note: filter does not apply recursively to dependencies)
     * @param       {Object} [buildConfigsMap] OPTIONAL a set or "duplicate map" for already included buildConfigs: {[buildConfig: BuildConfig]: Boolean}
     * @return      {Array<BuildConfig>} a list of (mmir) build configurations; may be empty
     */
    getBuildConfig(buildConfigsMap?: Set<any> | {[buildConfig: string]: boolean} | Array<any>): PluginExportBuildConfig[];
    getBuildConfig(pluginName?: string): PluginExportBuildConfig[];
    getBuildConfig(pluginName?: string, buildConfigsMap?: Set<any> | {[buildConfig: string]: boolean} | Array<any>): PluginExportBuildConfig[];

};

export type PluginExportType = 'paths' | 'workers' | 'modules' | 'dependencies' | 'files';
export type PluginExportModeEntry = {[modulePathOverrideId: string]: string} & {files?: string[]};

export type SpeechConfigField = 'language' | 'voice';

export interface PluginExportConfigInfoMultiple {
  pluginName: string [];
  plugins: {[pluginId: string]: PluginExportConfigInfo};
}

export interface PluginExportConfigInfo {
  pluginName: string;
  config?: string[];
  /** may (or may not) contain a default value for entry of field config */
  defaultValues?: {[configField: string]: any};
  speechConfig?: Array<SpeechConfigField>;
  /** may (or may not) contain a default value for entry of field speechConfig */
  defaultSpeechValues?: {[speechConfigField: string]: any};
  /** optional configuration for the AppConfig / BuildAppConfig / WebpackAppConfig */
  buildConfigs?: (PluginExportBuildConfig | PluginExportBuildConfigCreator)[];
}

/** configuration fields of AppConfig / BuildAppConfig / WebpackAppConfig  that a plugin can use to specify additional build configurations */
export type PluginExportBuildConfig = {[appBuildConfigField: string]: any};

/** creator-function for configuration fields of AppConfig / BuildAppConfig / WebpackAppConfig  that a plugin can use to specify additional build configurations */
export type PluginExportBuildConfigCreator = (pluginConfig: PluginConfig & TTSPluginSpeechConfig, runtimeConfig: RuntimeConfiguration, pluginBuildConfigs: PluginExportBuildConfig[]) => PluginExportBuildConfig | (PluginExportBuildConfig | PluginExportBuildConfigCreator)[];

/**
 * Additional configuration for speech output (TTS: Text To Speech) for mmir plugins:
 * extend configuration specified in (language specific) `speech.json`.
 *
 * NOTE for applying a value to all speech configurations (i.e. for language codes):
 * use a simple string
 *  <pre>
 *  {voice: 'female'}
 *  </pre>
 * or, if combined with specific settings, use "__apply-to-all-configs__" as language code
 *  <pre>
 *  {voice: {
 *  	en: 'Hedda',
 *  	'__apply-to-all-configs__': 'male'
 *  }}
 *  </pre>
 *  which would set "Hedda" as voice for "en", and voice "male" for all other language codes
 *
 * @see [[SimpleSpeechConfig]]
 */
export interface TTSPluginSpeechConfig {
    /** local with 2-letter language- and country-code, separated with "-", e.g. "de-DE" or "en-US" */
    language?: string | {[languageCode: string]: string};
    /** local with 3-letter language- and country-code, separated with "-", e.g. "deu-DEU" or "eng-USA" */
    long?: string | {[languageCode: string]: string};
    /** voice name or feature (may not be supported by selected TTS plugin) */
    voice?: 'male' | 'female' | string | {[languageCode: string]: 'male' | 'female' | string};
}

export interface ResourceConfig {
    paths: ModulePaths;
    packages?: ModulePackage[];

    // paths for web worker entry points (i.e. new Worker(<path>)):
    workers: string[];
    //paths for "raw" files that will be included as-is (i.e. copied)
    fileResources: string[];
    //path for text resources
    textResources: string[];
    //path mappings for copied files etc (i.e. will be included/copied to the specified relative file path/name)
    resourcesPaths: {[moduleIdAndSubPath: string]: string};
}

export interface DirectoriesInfo {
    "/controllers": string[];
    "/views": string[];
    "/models": string[];
    "/config": string[];
    "/config/languages": string[];
    "/config/states": string[];
    "/helpers": string[];
    "/gen": string[];

    "/gen/grammar"?: string[];
    "/gen/view"?: string[];

    [resourceId: string]: string[];
}

export interface ViewCompilerOptions {
    mapping: ViewBuildEntry[];
    config: ViewBuildOptions;
}

export interface StateCompilerOptions {
    mapping: StateModelBuildEntry[];
    config: StateBuildOptions;
}

export interface ImplementationCompilerOptions {
    mapping: ImplementationBuildEntry[];
    config: ImplementationOption;
}

export interface GrammarCompilerOptions {
    mapping: GrammarBuildEntry[];
    config: GrammarBuildOptions;
}


// export type CompilerCallback = (error: null | string | Error | any, code: string, map: any, meta: any) => void;
export interface CompilerCallback {
    (error: null | string | Error | any, code: string, map: any, meta: any): void;
    (error: string | Error | any, code?: string, map?: any, meta?: any): void;
}

export type BuildConfig = {
    grammars: GrammarBuildEntry[];
    grammarOptions: GrammarBuildOptions;
    views: ViewBuildEntry[];
    viewOptions: ViewBuildOptions;
    states: StateModelBuildEntry[];
    stateOptions: StateBuildOptions;
    implList: ImplementationBuildEntry[];
    ctrlOptions: ControllerOptions;
    helperOptions: HelperOptions;
    modelOptions: ModelOptions;
    settings: SettingsBuildEntry[];
    settingsOptions: SettingsBuildOptions;
    directories: DirectoriesInfo;
    directoriesTargetDir?: string;
}
