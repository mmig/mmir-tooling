/// <reference types="mmir-lib" />
import 'mmir-lib';

export const config: ConfigApply;

export interface ConfigApply {
	disableLogging: (enabled: boolean) => void;
	apply: (webpackInstance: any, webpackConfig: any, mmirAppConfig: AppConfig) => void
}

export interface AppConfig {

	/** used for resolving non-absolute paths: the absolute path to the app's root/sources directory (if omitted the current working directory is used for resolving paths) */
	rootPath?: string;
	/** specifying additional (or replacing) module paths */
	paths?: ModulePaths;

	/** specify the path to the MMIR resources directory with the default structure:
	 *  <pre>
	 *  config
	 *        /languages
	 *                  /<lang>
	 *                         /grammar.json
	 *                         /dictionary.json
	 *                         /speech.json
	 *        /statedef
	 *                 /inputDescriptionSCXML.xml
	 *                 /dialogDescriptionSCXML.xml
	 *
	 *        /configuration.json
	 *  controllers/*
	 *  helpers/*
	 *  models/*
	 *  views/*
	 *  </pre>
	 *
	 * The path will be used to collect all available resources and create the correspondig
	 * options for including them.
	 */
	resourcesPath?: string;
	resourcesPathOptions?: ResourcesOptions;

	includeModules?: Array<ModuleId>;
	config?: ModuleConfigOptions;

	jquery?: boolean;

	grammars?: GrammarOptions;
	stateMachines?: StateMachineOptions;

	settings?: SettingsOptions;
	configuration?: RuntimeConfiguration;

	includePlugins?: Array<PluginOptions>;

	views?: ViewOptions;
	controllers?: ControllerOptions;
	helpers?: HelperOptions;
	models?: ModelOptions;
}

export type ModuleId = string;//TODO explicitly specify MMIR module IDs

/**
 * maps module IDs to file paths:
 * if the path is not absolute, it will be resolved against the mmir-lib path, if it starts with "mmirf/",
 * otherwise against the rootPath.
 */
export type ModulePaths = {[moduleId: string]: string};

export interface GrammarOptions {
	/** file path for searching (recursively) JSON grammars within languages-subdirectory:
	 * path/.../<grammar ID>/grammar.json
	 */
	path?: string;
	/** options for handling found or specified JSON grammars */
	grammars?: {[grammarId: string]: GrammarEntry};
}

export interface GrammarEntry {
	/** the Grammar engine that will be used to compile the executable grammar.
	  * @default "jscc"
	  */
	engine?: "jscc" | "jison" | "pegjs";
	/**
	 * if <code>true</code>, and the execution environment supports Workers, then the grammar will be loaded
	 * in a Worker on app start-up, i.e. execution will be asynchronously in a worker-thread
	 * @default false
	 */
	async?: boolean;
	/**
	 * if <code>true</code>, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
	 * from the corresponding JSON grammar
	 */
	exclude?: boolean;
	/**
	 * if <code>true</code>, the grammar will not be loaded (and registered) when the the app is initialized, i.e. needs to be
	 *   "manually" loaded/initialized by app implementation and/or other mechanisms.
	 * If omitted or <code>false</code>, the grammar will be loaded on start-up of the app,
	 *   and then will be available e.g. via <code>mmir.semantic.interprest(<input phrase string>, <grammar-id>)</code>.
	 */
	ignore?: boolean;
	/**
	 * for specifying the JSON grammar directly (e.g. instead or in addition of parsing <code>path</code> for grammar files):
	 * the (absolute) path to the JSON grammar (from which the executable grammar will be created)
	 */
	file?: string;
}

export interface SettingsOptions {
	/** file path for searching settings:
	 * <pre>
	 * path/.../<language ID>/grammar.json
	 *                       /dictionary.json
	 *                       /speech.json
	 * configuration.json
	 * </pre>
	 */
	path?: string;

	/** options for the configuration.json entry; if FALSE, the resource will be ignored */
	configuration?: boolean | SettingsEntryOptions;
	/** options-map for the dictionary.json entries where id is (usually) the language code; if FALSE, these resources will be ignored */
	dictionary?: boolean | {[id: string]: SettingsEntryOptions};
	/** options-map for the grammar.json entries where id is (usually) the language code; if FALSE, these resources will be ignored */
	grammar?: boolean | {[id: string]: SettingsEntryOptions};
	/** options-map for the speech.json entries where id is (usually) the language code; if FALSE, these resources will be ignored */
	speech?: boolean | {[id: string]: SettingsEntryOptions};
}

export interface SettingsEntryOptions {
	/** if <code>true</code>, the corresponding resource will be excluded (when parsing <code>path</code>) */
	exclude?: boolean;

	/**can be used to include the resource as separate file, instead of bundeling via webpack
	 * @default "inline"
	 */
	include?: 'inline' | 'file';

	/**  for explicitly specifying the settings-resource directly (e.g. instead or in addition of parsing <code>path</code> for settings resource files) */
	file?: string;

	/** the settings-type (should not be set manually) */
	type?: SettingsType;
	/** the ID for the settings-resources (should not be set manually) */
	id?: string;
}

export type SettingsType = 'configuration' | 'dictionary' | 'grammar' | 'speech';

export interface StateMachineOptions {

	/** file path for searching (recursively) for SCXML files (state-engines):
	 * <pre>
	 * path/.../dialogDescriptionSCXMLxml -> type "dialog"
	 *         /inputDescriptionSCXMLxml  -> type "input"
	 * </pre>
	 */
	path?: string;
	/** optionally specify options for found resource, or specifying resources/locations directly */
	models?: {dialog?: StateMachineEntry, input?: StateMachineEntry};
}

export interface StateMachineEntry {

	/** if <code>true</code>, the corresponding resource will be excluded (when parsing <code>path</code>) */
	exclude?: boolean;

	/**
	 * run SCXML model in "simple" or "extended" mode
	 * @default "extended"
	 */
	mode?: "extended" | "simple";

	/**  for explicitly specifying the state-machine directly (e.g. instead or in addition of parsing <code>path</code>) */
	file?: string;
}

/** runtime configuration: same as config/configuration.json */
export interface RuntimeConfiguration {
	language?: string;

	/** grammar-compiler/-engine for compiling new grammars */
	grammarCompiler?: "jscc" | "jison" | "pegjs";
	/** if selected language only has JSON grammar, prevents automatic compilation */
	usePrecompiledGrammarsOnly?: boolean;
	/** list of grammars (IDs) which should not be automatically loaded on startup, even if compiled/JSON grammar is available for the language */
	ignoreGrammarFiles?: Array<string>;

	/** name of the default layout when rendering mmir view templates: if null, no default layout will be used */
	defaultLayoutName?: 'Default' | string | null;
	/** if false, view templates will be (re-)compiled upon app startup */
	usePrecompiledViews?: boolean;

	mediaManager?: {plugins: {[env: string]: Array<mmir.MediaManagerPluginEntry>}};

	[configField: string]: any;
}

/** module configuration: analogous to config-entry in requirejs configuration */
export type ModuleConfigOptions = {[moduleId: string]: ModuleConfig};

/** module configuration: analogous to config-entry in requirejs config-entries */
export type ModuleConfig = {[configName: string]: any} & {logLevel?: mmir.LogLevelNum | mmir.LogLevel};

/** options for handling found resources when parsing the resourcesPath */
export interface ResourcesOptions {
	/** if true, explicitly exports implementation resources (controllers, helpers etc.); ensures that the resource is included in webpack build.
	 *
	 *  This may be necessary, if the resources are not explicitly <pre>require()</pre>'d anywhere
	 *  (e.g. loaded by dynamically constructing the resource-name/-ID)
	 */
	addModuleExport?: boolean;
	/** excludes the specified resources types when parsing the resourcesPath */
	exclude?: Array<ResourceTypeName>;
}

/** a resource type; corresponds to field names in AppConfig */
export type ResourceTypeName = string;

export interface ViewOptions {
	/** file path for searching view files:
	 * path/views/<controller ID>/*.ehtml
	 * path/layouts/<controller ID>.ehtml
	 */
	path?: string;
}

export interface ControllerOptions {
	/** file path for (recursively) searching controller implementation files:
	 * path/<controller ID>.js
	 */
	path?: string;
	controllers?: {[id: string]: ImplementationOptions};
}

export interface HelperOptions {
	/** file path for (recursively) searching helper implementation files:
	 * path/.../<controller ID>Helper.js
	 */
	path?: string;
	helpers?: {[id: string]: ImplementationOptions};
}

export interface ModelOptions {
	/** file path for searching (data) model implementation files:
	 * path/<model ID>.js
	 */
	path?: string;
	models?: {[id: string]: ImplementationOptions};
}

export interface ImplementationOptions {

	/** if <code>true</code>, the corresponding implementation will be excluded (when parsing <code>path</code>) */
	exclude?: boolean;

	/** if true, explicitly exports implementation resources (controllers, helpers etc.); ensures that the resource is included in webpack build.
	 *
	 *  This may be necessary, if the resources are not explicitly <pre>require()</pre>'d anywhere
	 *  (e.g. loaded by dynamically constructing the resource-name/-ID)
	 */
	addModuleExport?: boolean;

	/**  for explicitly specifying the implementation-file directly (e.g. instead or in addition of parsing <code>path</code>) */
	file?: string;

	/** the implementation's name (usually the ID with capitalized first letter) */
	name: string;

	/** the implementation's type (should not be explicitly specified) */
	type?: "controller" | "helper" | "model";
}

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
