> **[mmir-tooling 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [AppConfig](mmir_tooling.appconfig.md) /

# Interface: AppConfig

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

* **AppConfig**

  * [BuildAppConfig](mmir_tooling.buildappconfig.md)

## Index

### Properties

* [grammars](mmir_tooling.appconfig.md#optional-grammars)
* [resourcesPath](mmir_tooling.appconfig.md#optional-resourcespath)
* [resourcesPathOptions](mmir_tooling.appconfig.md#optional-resourcespathoptions)
* [rootPath](mmir_tooling.appconfig.md#optional-rootpath)
* [states](mmir_tooling.appconfig.md#optional-states)
* [views](mmir_tooling.appconfig.md#optional-views)

## Properties

### `Optional` grammars

• **grammars**? : *[GrammarOptions](mmir_tooling.grammaroptions.md) | boolean*

Specify how (JSON) grammars should be parsed/included, and/or
specify additional grammars that should be included.

Compiled grammars will be available via the [SemanticInterpreter](mmir_lib.semanticinterpreter.md).

If `false`, grammars will be excluded/ignored.

___

### `Optional` resourcesPath

• **resourcesPath**? : *string*

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

### `Optional` resourcesPathOptions

• **resourcesPathOptions**? : *[ResourcesOptions](mmir_tooling.resourcesoptions.md)*

___

### `Optional` rootPath

• **rootPath**? : *string*

used for resolving non-absolute paths: the absolute path to the app's root/sources directory (if omitted the current working directory is used for resolving non-absolute paths)

___

### `Optional` states

• **states**? : *[StateOptions](mmir_tooling.stateoptions.md) | boolean*

Specify how (SCXML) state-machines/-models should be parsed/included, and/or
specify additional state-models that should be included.

If `false`, state-models will be excluded/ignored.

By default, if no state-models are include, "minimal" state-models
for the [InputManager](mmir_lib.inputmanager.md) and the [DialogManager](mmir_lib.dialogmanager.md) will be included,
see [mmir-tooling/defaultValues](https://github.com/mmig/mmir-tooling/tree/master/defaultValues).

___

### `Optional` views

• **views**? : *[ViewOptions](mmir_tooling.viewoptions.md) | boolean*

Specify how (mmir) views should be parsed/included, and/or
specify additional views that should be included.

If `false`, views will be excluded/ignored.