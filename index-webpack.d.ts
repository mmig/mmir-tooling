
/* ********************************************* */
/* ** NOTE do not change directly:            ** */
/* **      original source file is located at ** */
/* **      /assets/index-webpack.d.ts         ** */
/* ********************************************* */

/**
 * @packageDocumentation
 * @module mmir-webpack
 */

import { AppConfig , ModulePaths, ModulePackage, ModuleId, ModuleConfigOptions, PluginOptions, ControllerOptions, HelperOptions, ModelOptions } from './index.d';

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
export interface WebpackAppConfig extends AppConfig {

    /** specifying additional (or replacing) module paths */
    paths?: ModulePaths;

    /**
     * specifying additional module-packages, i.e. base-directories that contain module files
     *
     * for more details, see requirejs documentation about configuration for packages
     */
    packages?: ModulePackage[];

    /**
     * disable logging in mmir runtime:
     * suppresses all logging-output by replacing mmirf/logger with an empty logger implementation
     */
    disableLogging?: boolean;

    /**
     * include a (optional) module, e.g. will be available via
     * <code>mmir.require()</code>.
     *
     * The prefix "mmirf/" can be omitted.
     *
     * @example
     * ```
     * includeModules: ['jsccGen', 'mmirf/jisonGen'],
     * ```
     */
    includeModules?: Array<ModuleId>;
    /**
     * include module AND do load it BEFORE initializing the mmir library;
     * the module will also be available via <code>mmir.require()</code>.
     *
     * The prefix "mmirf/" can be omitted.
     *
     * @example
     * loadBeforeInit: ['mmirf/polyfill'],
     */
    loadBeforeInit?: Array<ModuleId>;
    /**
     * include module AND do load it AFTER initializing the mmir library;
     * the module will also be available via <code>mmir.require()</code>.
     *
     * The prefix "mmirf/" can be omitted.
     *
     * @example
     * ```
     * loadAfterInit: ['mmirf/grammar/testing'],
     * ```
     */
    loadAfterInit?: Array<ModuleId>;

    /**
     * Configuration for mmir modules (analogous to requirejs' module config entries)
     */
    config?: ModuleConfigOptions;

    /**
     * If `jquery` is included:
     * `mmir` will automatically use `jquery` utililities instead of alternative
     * implementations.
     *
     * NOTE: the `jquery` library must be loaded/included separately; this will
     *       only configure `mmir` to use `jquery`, but not include the library itself.
     */
    jquery?: boolean;

    /**
     * Specify and configure mmir-plugins that should be included.
     */
    includePlugins?: Array<PluginOptions>;

    /**
     * Specify how (mmir) controller implementations should be parsed/included,
     * and/or specify additional controllers that should be included.
     *
     * If `false`, (mmir) controllers will be excluded/ignored.
     */
    controllers?: ControllerOptions | boolean;
    /**
     * Specify how (mmir) helper implementations (for mmir controllers)
     * should be parsed/included, and/or specify additional helpers that
     * should be included.
     *
     * If `false`, helpers will be excluded/ignored.
     */
    helpers?: HelperOptions | boolean;
    /**
     * Specify how (mmir) data model implementations should be parsed/included,
     * and/or specify additional data models that should be included.
     *
     * If `false`, data models will be excluded/ignored.
     */
    models?: ModelOptions | boolean;

    /** configuration for webpack plugins (for internal use) */
    webpackPlugins?: any[];

    /**
     * configuration for supressing webpack warnings
     *
     * NOTE: supported since webpack v5 (will be ignored otherwise)
     *
     * see webpack documentation for further details:
     * Configuration -> Other Options -> ignoreWarnings
     */
    webpackIgnoreWarnings?: (RegExp | ((webpackError: any, compilation: any) => boolean) | {module?: RegExp, file?: RegExp, message?: RegExp})[];

    /**
     * (for internal use: will be filled/set by compiler)
     *
     * dictionary for mmir runtime settings:
     *  * `"mmirf/settings/configuration"`: the (normalized/merged) `RuntimeConfiguration` for the mmir app (~ `configuration.json`)
     *  * `"mmirf/settings/directories"`: the directories/files/URI information for loading/accessing speech-configuration, controllers, views etc. (~ `directories.json`)
     *  * `"mmirf/settings/speech/{lang}"`: the speech (input/output) configuration for language code `lang` (~ `lang/speech.json`)
     *  * `"mmirf/settings/dictionary/{lang}"`: the dictionary (internat. labels) for language code `lang` (~ `lang/dictionary.json`)
     *  * `"mmirf/settings/grammar/{lang}"`: the JSON definition for the grammar of language code `lang` (~ `lang/grammar.json`)
     *
     */
    runtimeSettings?: {[settingsId: string]: any};


    /**
     * HACK:
     * `webpack` version 4 does include a default rule for loading WASM files
     * that will cause errors due to the fact, that it will try to load mmir-integrated WASM files again.
     *
     * Enabling this option will overwrite the `webpackConfig.module.defaultRules` option omitting the
     * default rule for WASM files.
     *
     * If you do not need the default rules, this can be enabled as a quick-fix for dealing with
     * errors due to loading WASM files.
     */
    fixWebpack4DefaultRulesForWASM?: boolean;
}
