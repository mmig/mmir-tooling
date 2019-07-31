/// <reference types="mmir-lib" />

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
 */
export function apply(buildConfig: BuildAppConfig): void;

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

	// //TODO? support updating/creating settings/configuration?
	// settings?: SettingsOptions;
	// configuration?: RuntimeConfiguration;

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
export interface GrammarOptions {
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
	 * if TRUE the grammar(s) will be newly created and written to the targetDir,
	 * even if the up-to-date check returns `true`
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
	 * if directories.json should include the view template fiels (`*.ehtml`)
	 * e.g. for up-to-date test & runtime-comilation of view templates
	 *
	 * @default true
	 */
	includeViewTemplates?: boolean;
	includeStateModelXmls?: boolean;


	grammars?: GrammarBuildOptions | boolean;
	states?: StateBuildOptions | boolean;

	views?: ViewBuildOptions | boolean;
}

export interface GrammarBuildOptions extends GrammarOptions, BuildOptions {}
export interface GrammarBuildEntry extends GrammarEntry, BuildOptions {}

export interface ViewBuildOptions extends ViewOptions, BuildOptions {}
export interface ViewBuildEntry extends ImplementationOptions, BuildOptions {}

export interface StateBuildOptions extends StateOptions, BuildOptions {
	/**
	 * the module type of the generated/compiled state machine
	 * @default "amd"
	 */
	moduleType?: "amd" | "commonjs";
}
export interface StateModelBuildEntry extends StateModelEntry, BuildOptions {}

export interface GrammarEntry {
	/** the Grammar engine that will be used to compile the executable grammar.
	  * @default "jscc"
	  */
	engine?: "jscc" | "jison" | "pegjs";
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
	 * path/.../<language ID>/grammar.json
	 *                       /dictionary.json
	 *                       /speech.json
	 * configuration.json
	 * ```
	 */
	path?: string;

	/** options for the configuration.json entry; if FALSE, the resource will be ignored */
	configuration?: boolean | SettingsEntryOptions;
	/** options-map for the dictionary.json entries where id is (usually) the language code; if `false`, these resources will be ignored */
	dictionary?: boolean | {[id: string]: SettingsEntryOptions};
	/** options-map for the grammar.json entries where id is (usually) the language code; if `false`, these resources will be ignored */
	grammar?: boolean | {[id: string]: SettingsEntryOptions};
	/** options-map for the speech.json entries where id is (usually) the language code; if `false`, these resources will be ignored */
	speech?: boolean | {[id: string]: SettingsEntryOptions};
}

export interface SettingsEntryOptions {
	/** if `true`, the corresponding resource will be excluded (when parsing `path`) */
	exclude?: boolean;

	/**can be used to include the resource as separate file, instead of bundeling via webpack
	 * @default "inline"
	 */
	include?: 'inline' | 'file';

	/**  for explicitly specifying the settings-resource directly (e.g. instead or in addition of parsing `path` for settings resource files) */
	file?: string;

	/** the settings-type (should not be set manually) */
	type?: SettingsType;
	/** the ID for the settings-resources (should not be set manually) */
	id?: string;
}

export type SettingsType = 'configuration' | 'dictionary' | 'grammar' | 'speech';

/**
 * @example
 * ```
 * var stateOptions = {
 * 	path: 'www/config/states',
 * 	// ignoreErrors: true,
 * 	models: {
 * 		input: {
 * 			mode: 'simple',
 * 			file: './alt_config/states_minimal/input.xml'
 * 		},
 * 		dialog: {
 * 			ignoreErrors: true,
 * 			mode: 'extended'
 * 		}
 * 	}
 * };
 * ```
 */
export interface StateOptions {

	/** file path for searching (recursively) for SCXML files (state-engines):
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
	 */
	path?: string;
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
	 * optionally specify options for found resource, or specifying resources/locations directly
	 *
	 * If `input` or `dialog` are missing (e.g. no resources matching them could be found),
	 * default "minimal" state-models will be used for `inputManager` and `dialogManager`.
	 */
	models?: {dialog?: StateModelEntry, input?: StateModelEntry, [id: string]: StateModelEntry};
}

export interface StateModelEntry {

	//DISABLED should not be used -> ID will be derived from entry key of models property
	// /** the ID for state model */
	// id?: string;

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
	moduleId?: string,

	/** if `true`, the corresponding resource will be excluded (when parsing `path`) */
	exclude?: boolean;

	/**
	 * run SCXML model in "simple" or "extended" mode
	 * @default "extended"
	 */
	mode?: "extended" | "simple";

	/** if TRUE, runtime errors will be ignored.
	 *  if FALSE (or omitted) the compilation will fail with an error message
	 *  when encountering SCXML runtime errors.
	 *
	 * NOTE: if ignored, the runtime errors will be triggered when the state-machine
	 *       enters the corresponing state during runtime!
	 *
	 * @default false
	 */
	ignoreErrors?: boolean;

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
	grammarCompiler?: "jscc" | "jison" | "pegjs";
	/** if selected language only has JSON grammar, prevents automatic compilation */
	usePrecompiledGrammarsOnly?: boolean;
	/** if JSON grammar is compiled during runtime, use async (i.e. web worker) compilation */
	grammarAsyncCompileMode?: boolean;
	/** list of grammars (IDs) which should not be automatically loaded on startup, even if compiled/JSON grammar is available for the language */
	ignoreGrammarFiles?: Array<string>;

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
	mediaManager?: {plugins: {[env: string]: Array<mmir.MediaManagerPluginEntry>}};

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

/** module configuration: analogous to config-entry in requirejs configuration */
export type ModuleConfigOptions = {[moduleId: string]: ModuleConfig};

/** module configuration: analogous to config-entry in requirejs config-entries */
export type ModuleConfig = {[configName: string]: any} & {logLevel?: mmir.LogLevelNum | mmir.LogLevel};

/** options for handling found resources when parsing the resourcesPath */
export interface ResourcesOptions {
	/** for automatically converting old-style implementations that are no CommonJS or AMD modules:
	 * if `true`, explicitly exports the implementation resource (i.e. as module.exports)
	 * @see ImplementationOptions
	 */
	addModuleExport?: boolean;
	/** excludes the specified resources types when parsing the `resourcesPath` */
	exclude?: Array<ResourceTypeName>;
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
export interface ControllerOptions {
	/** file path for (recursively) searching controller implementation files:
	 * `path/<controller ID>.js`
	 */
	path?: string;
	controllers?: boolean | {[id: string]: ImplementationOptions};
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
export interface HelperOptions {
	/** file path for (recursively) searching helper implementation files:
	 * `path/.../<controller ID>Helper.js`
	 */
	path?: string;
	helpers?: boolean | {[id: string]: ImplementationOptions};
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
export interface ModelOptions {
	/** file path for searching (data) model implementation files:
	 * `path/<model ID>.js`
	 */
	path?: string;
	models?: boolean | {[id: string]: ImplementationOptions};
}

export interface ImplementationOptions {

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

	/**  for explicitly specifying the implementation-file directly (e.g. instead or in addition of parsing `path`) */
	file?: string;

	/** the implementation's name (usually the ID with capitalized first letter) */
	name: string;

	/** the implementation's type (should not be explicitly specified) */
	type?: "controller" | "helper" | "model";
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
	mode?: 'wasm' | 'min' | 'default';
	/**
	 * configuration for the plugin: specific fields/values depending on the plugin
	 * NOTE some plugins require credentials, e.g. "appId" and "appKey"
	 */
	config?: {[language: string]: mmir.SimpleSpeechConfig} | PluginConfig;
}

export type PluginConfig = {[config: string]: any};
