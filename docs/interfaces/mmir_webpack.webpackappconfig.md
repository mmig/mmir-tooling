**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-webpack](../modules/mmir_webpack.md) / WebpackAppConfig

# Interface: WebpackAppConfig

**`example`** 
```
var appConfig = {
	//path to directory that contains classic mmir directory structure
	resourcesPath: 'src/mmir',
	resourcesPathOptions: {
		//for included models, controllers, helpers: convert old-style
		// implementations by adding an export statement
		addModuleExport: true,
		//exlude model implementations, and do not include JSON grammar resources
		exclude: ['models', 'settings/grammar']
	},
	//utilize jQuery in mmir instead of (less backwards compatible)
	// alternative implementations (npm package jquery needs to be installed!)
	jquery: true,
	//specify language for runtime configuration (== configuration.json)
	configuration: {language: 'en'},
	//do include controller implementation found within resourcesPath
	// (NOTE: this is the default behavior)
	controllers: true,
	//do NOT include helper implemenations found within resourcesPath
	helpers: false,
	//...
}
```

## Hierarchy

* [AppConfig](mmir_tooling.appconfig.md)

  ↳ **WebpackAppConfig**

## Index

### Properties

* [config](mmir_webpack.webpackappconfig.md#config)
* [configuration](mmir_webpack.webpackappconfig.md#configuration)
* [controllers](mmir_webpack.webpackappconfig.md#controllers)
* [disableLogging](mmir_webpack.webpackappconfig.md#disablelogging)
* [fixWebpack4DefaultRulesForWASM](mmir_webpack.webpackappconfig.md#fixwebpack4defaultrulesforwasm)
* [grammars](mmir_webpack.webpackappconfig.md#grammars)
* [helpers](mmir_webpack.webpackappconfig.md#helpers)
* [includeModules](mmir_webpack.webpackappconfig.md#includemodules)
* [includePlugins](mmir_webpack.webpackappconfig.md#includeplugins)
* [jquery](mmir_webpack.webpackappconfig.md#jquery)
* [loadAfterInit](mmir_webpack.webpackappconfig.md#loadafterinit)
* [loadBeforeInit](mmir_webpack.webpackappconfig.md#loadbeforeinit)
* [models](mmir_webpack.webpackappconfig.md#models)
* [paths](mmir_webpack.webpackappconfig.md#paths)
* [resourcesPath](mmir_webpack.webpackappconfig.md#resourcespath)
* [resourcesPathOptions](mmir_webpack.webpackappconfig.md#resourcespathoptions)
* [rootPath](mmir_webpack.webpackappconfig.md#rootpath)
* [runtimeSettings](mmir_webpack.webpackappconfig.md#runtimesettings)
* [settings](mmir_webpack.webpackappconfig.md#settings)
* [states](mmir_webpack.webpackappconfig.md#states)
* [views](mmir_webpack.webpackappconfig.md#views)
* [webpackPlugins](mmir_webpack.webpackappconfig.md#webpackplugins)

## Properties

### config

• `Optional` **config**: [ModuleConfigOptions](../modules/mmir_tooling.md#moduleconfigoptions)

Configuration for mmir modules (analogous to requirejs' module config entries)

___

### configuration

• `Optional` **configuration**: [RuntimeConfiguration](mmir_tooling.runtimeconfiguration.md)

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[configuration](mmir_webpack.webpackappconfig.md#configuration)*

Specify additional (mmir) runtime configuration values,
e.g. in addition to `config/configuration.json`.

In case of conflicts, these settings will override settings in
`config/configuration.json`,

___

### controllers

• `Optional` **controllers**: [ControllerOptions](mmir_tooling.controlleroptions.md) \| boolean

Specify how (mmir) controller implementations should be parsed/included,
and/or specify additional controllers that should be included.

If `false`, (mmir) controllers will be excluded/ignored.

___

### disableLogging

• `Optional` **disableLogging**: boolean

disable logging in mmir runtime:
suppresses all logging-output by replacing mmirf/logger with an empty logger implementation

___

### fixWebpack4DefaultRulesForWASM

• `Optional` **fixWebpack4DefaultRulesForWASM**: boolean

HACK:
`webpack` version 4 does include a default rule for loading WASM files
that will cause errors due to the fact, that it will try to load mmir-integrated WASM files again.

Enabling this option will overwrite the `webpackConfig.module.defaultRules` option omitting the
default rule for WASM files.

If you do not need the default rules, this can be enabled as a quick-fix for dealing with
errors due to loading WASM files.

___

### grammars

• `Optional` **grammars**: [GrammarOptions](mmir_tooling.grammaroptions.md) \| boolean

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[grammars](mmir_webpack.webpackappconfig.md#grammars)*

Specify how (JSON) grammars should be parsed/included, and/or
specify additional grammars that should be included.

Compiled grammars will be available via the [SemanticInterpreter](mmir_lib.semanticinterpreter.md).

If `false`, grammars will be excluded/ignored.

___

### helpers

• `Optional` **helpers**: [HelperOptions](mmir_tooling.helperoptions.md) \| boolean

Specify how (mmir) helper implementations (for mmir controllers)
should be parsed/included, and/or specify additional helpers that
should be included.

If `false`, helpers will be excluded/ignored.

___

### includeModules

• `Optional` **includeModules**: Array<[ModuleId](../modules/mmir_tooling.md#moduleid)\>

include a (optional) module, e.g. will be available via
<code>mmir.require()</code>.

The prefix "mmirf/" can be omitted.

**`example`** 
```
includeModules: ['jsccGen', 'mmirf/jisonGen'],
```

___

### includePlugins

• `Optional` **includePlugins**: Array<[PluginOptions](mmir_tooling.pluginoptions.md)\>

Specify and configure mmir-plugins that should be included.

___

### jquery

• `Optional` **jquery**: boolean

If `jquery` is included:
`mmir` will automatically use `jquery` utililities instead of alternative
implementations.

NOTE: the `jquery` library must be loaded/included separately; this will
      only configure `mmir` to use `jquery`, but not include the library itself.

___

### loadAfterInit

• `Optional` **loadAfterInit**: Array<[ModuleId](../modules/mmir_tooling.md#moduleid)\>

include module AND do load it AFTER initializing the mmir library;
the module will also be available via <code>mmir.require()</code>.

The prefix "mmirf/" can be omitted.

**`example`** 
```
loadAfterInit: ['mmirf/grammar/testing'],
```

___

### loadBeforeInit

• `Optional` **loadBeforeInit**: Array<[ModuleId](../modules/mmir_tooling.md#moduleid)\>

include module AND do load it BEFORE initializing the mmir library;
the module will also be available via <code>mmir.require()</code>.

The prefix "mmirf/" can be omitted.

**`example`** 
loadBeforeInit: ['mmirf/polyfill'],

___

### models

• `Optional` **models**: [ModelOptions](mmir_tooling.modeloptions.md) \| boolean

Specify how (mmir) data model implementations should be parsed/included,
and/or specify additional data models that should be included.

If `false`, data models will be excluded/ignored.

___

### paths

• `Optional` **paths**: [ModulePaths](../modules/mmir_tooling.md#modulepaths)

specifying additional (or replacing) module paths

___

### resourcesPath

• `Optional` **resourcesPath**: string

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[resourcesPath](mmir_webpack.webpackappconfig.md#resourcespath)*

specify the path to the MMIR resources directory with the default structure:
 ```bash
 config/
       /languages/
                 /<lang>/
                        /grammar.json
                        /dictionary.json
                        /speech.json
       /states/
              /input.xml
              /dialog.xml
       /configuration.json
 controllers/*
 helpers/*
 models/*
 views/*
 ```

The path will be used to collect all available resources and create the correspondig
options for including them.

**`default`** "www"

___

### resourcesPathOptions

• `Optional` **resourcesPathOptions**: [ResourcesOptions](mmir_tooling.resourcesoptions.md)

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[resourcesPathOptions](mmir_webpack.webpackappconfig.md#resourcespathoptions)*

___

### rootPath

• `Optional` **rootPath**: string

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[rootPath](mmir_webpack.webpackappconfig.md#rootpath)*

used for resolving non-absolute paths: the absolute path to the app's root/sources directory (if omitted the current working directory is used for resolving non-absolute paths)

___

### runtimeSettings

• `Optional` **runtimeSettings**: { [settingsId:string]: any;  }

(for internal use: will be filled/set by compiler)

dictionary for mmir runtime settings:
 * `"mmirf/settings/configuration"`: the (normalized/merged) `RuntimeConfiguration` for the mmir app (~ `configuration.json`)
 * `"mmirf/settings/directories"`: the directories/files/URI information for loading/accessing speech-configuration, controllers, views etc. (~ `directories.json`)
 * `"mmirf/settings/speech/{lang}"`: the speech (input/output) configuration for language code `lang` (~ `lang/speech.json`)
 * `"mmirf/settings/dictionary/{lang}"`: the dictionary (internat. labels) for language code `lang` (~ `lang/dictionary.json`)
 * `"mmirf/settings/grammar/{lang}"`: the JSON definition for the grammar of language code `lang` (~ `lang/grammar.json`)

___

### settings

• `Optional` **settings**: [SettingsOptions](mmir_tooling.settingsoptions.md) \| boolean

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[settings](mmir_webpack.webpackappconfig.md#settings)*

Specify how (mmir) configuration and settings should be parsed/included,
and/or specify additional settings that should be included.

The `mmir` configuration/settings are the resources that are by default
located in the mmir `config/` directory
(with exception of the `states` sub-directory; for those instead use [WebpackAppConfig.states](mmir_webpack.webpackappconfig.md#states)):
 ```bash
 config/
       /languages/
                 /<lang>/
                        /grammar.json
                        /dictionary.json
                        /speech.json
       /states/
              /input.xml
              /dialog.xml
       /configuration.json
```
(NOTE the `config/states/` sub-directory is handled/configured via the the [states](mmir_webpack.webpackappconfig.md#states) option)

___

### states

• `Optional` **states**: [StateOptions](mmir_tooling.stateoptions.md) \| boolean

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[states](mmir_webpack.webpackappconfig.md#states)*

Specify how (SCXML) state-machines/-models should be parsed/included, and/or
specify additional state-models that should be included.

If `false`, state-models will be excluded/ignored.

By default, if no state-models are include, "minimal" state-models
for the [InputManager](mmir_lib.inputmanager.md) and the [DialogManager](mmir_lib.dialogmanager.md) will be included,
see [mmir-tooling/defaultValues](https://github.com/mmig/mmir-tooling/tree/master/defaultValues).

___

### views

• `Optional` **views**: [ViewOptions](mmir_tooling.viewoptions.md) \| boolean

*Inherited from [WebpackAppConfig](mmir_webpack.webpackappconfig.md).[views](mmir_webpack.webpackappconfig.md#views)*

Specify how (mmir) views should be parsed/included, and/or
specify additional views that should be included.

If `false`, views will be excluded/ignored.

___

### webpackPlugins

• `Optional` **webpackPlugins**: any[]

configuration for webpack plugins (for internal use)
