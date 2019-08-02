> **[mmir-tooling 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [RuntimeConfiguration](mmir_tooling.runtimeconfiguration.md) /

# Interface: RuntimeConfiguration

runtime configuration: same as config/configuration.json

## Hierarchy

* **RuntimeConfiguration**

## Indexable

● \[▪ **configField**: *string*\]: any

custom/additional configuration/settings:

E.g. mmir-plugins may support additional settings (see corresponding documentation of the plugin),
or app-specific settings my be specified and used.

## Index

### Properties

* [controllerContext](mmir_tooling.runtimeconfiguration.md#optional-controllercontext)
* [defaultLayoutName](mmir_tooling.runtimeconfiguration.md#optional-defaultlayoutname)
* [detectCompiledStateModels](mmir_tooling.runtimeconfiguration.md#optional-detectcompiledstatemodels)
* [grammarAsyncCompileMode](mmir_tooling.runtimeconfiguration.md#optional-grammarasynccompilemode)
* [grammarCompiler](mmir_tooling.runtimeconfiguration.md#optional-grammarcompiler)
* [ignoreGrammarFiles](mmir_tooling.runtimeconfiguration.md#optional-ignoregrammarfiles)
* [language](mmir_tooling.runtimeconfiguration.md#optional-language)
* [mediaManager](mmir_tooling.runtimeconfiguration.md#optional-mediamanager)
* [modelContext](mmir_tooling.runtimeconfiguration.md#optional-modelcontext)
* [usePrecompiledGrammarsOnly](mmir_tooling.runtimeconfiguration.md#optional-useprecompiledgrammarsonly)
* [usePrecompiledViews](mmir_tooling.runtimeconfiguration.md#optional-useprecompiledviews)

## Properties

### `Optional` controllerContext

• **controllerContext**? : *string*

dot-separated namespace for accessing the controller implementation's constructors
(within global namespace, e.g. `"app.ctrl" -> [window | self | global].app.ctrl`)

**`deprecated`** use module format (AMD / UMD / CommonJS (only in webpack-build) / ...) instead

___

### `Optional` defaultLayoutName

• **defaultLayoutName**? : *"Default" | string | null*

name of the default layout definition when rendering mmir view templates: if `null`, no default layout will be used.

**`default`** "Default"

___

### `Optional` detectCompiledStateModels

• **detectCompiledStateModels**? : *boolean*

detect if compiled state-models (i.e. JS-compiled SCXML files) are present & should be used
instead of loading & compiling SCXML files at runtime.

NOTE this is ignored in `webpack` build (since state-models will always be pre-compiled in `webpack` builds).

**`default`** true

___

### `Optional` grammarAsyncCompileMode

• **grammarAsyncCompileMode**? : *boolean*

if JSON grammar is compiled during runtime, use async (i.e. web worker) compilation

___

### `Optional` grammarCompiler

• **grammarCompiler**? : *"jscc" | "jison" | "pegjs"*

grammar-compiler/-engine for compiling new grammars

___

### `Optional` ignoreGrammarFiles

• **ignoreGrammarFiles**? : *`Array<string>`*

list of grammars (IDs) which should not be automatically loaded on startup, even if compiled/JSON grammar is available for the language

___

### `Optional` language

• **language**? : *string*

The language (code) that will be used by `mmir`, e.g.
for speech synthesis (TTS) or recognition (ASR).

Can be changed during runime with [LanguageManager.setLanguage](mmir_lib.languagemanager.md#setlanguage)

**`default`** "en"

___

### `Optional` mediaManager

• **mediaManager**? : *object*

configuration for media plugins, e.g. for speech recognition (ASR) and synthesis (TTS)

#### Type declaration:

* **plugins**(): *object*

___

### `Optional` modelContext

• **modelContext**? : *string*

dot-separated namespace for accessing the model implementation's constructors
(within global namespace, e.g. `"app.ctrl" -> [window | self | global].app.ctrl`)

**`deprecated`** use module format (AMD / UMD / CommonJS (only in webpack-build) / ...) instead

___

### `Optional` usePrecompiledGrammarsOnly

• **usePrecompiledGrammarsOnly**? : *boolean*

if selected language only has JSON grammar, prevents automatic compilation

___

### `Optional` usePrecompiledViews

• **usePrecompiledViews**? : *boolean*

if `false`, (mmir) view templates will be (re-)compiled upon app startup

NOTE will be ignored in `webpack` build