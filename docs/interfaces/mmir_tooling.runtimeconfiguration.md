**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / RuntimeConfiguration

# Interface: RuntimeConfiguration

runtime configuration: same as config/configuration.json

## Hierarchy

* **RuntimeConfiguration**

## Indexable

▪ [configField: string]: any

custom/additional configuration/settings:

E.g. mmir-plugins may support additional settings (see corresponding documentation of the plugin),
or app-specific settings my be specified and used.

## Index

### Properties

* [controllerContext](mmir_tooling.runtimeconfiguration.md#controllercontext)
* [defaultLayoutName](mmir_tooling.runtimeconfiguration.md#defaultlayoutname)
* [detectCompiledStateModels](mmir_tooling.runtimeconfiguration.md#detectcompiledstatemodels)
* [grammarAsyncCompileMode](mmir_tooling.runtimeconfiguration.md#grammarasynccompilemode)
* [grammarAsyncExecMode](mmir_tooling.runtimeconfiguration.md#grammarasyncexecmode)
* [grammarCompiler](mmir_tooling.runtimeconfiguration.md#grammarcompiler)
* [grammarDisableStrictCompileMode](mmir_tooling.runtimeconfiguration.md#grammardisablestrictcompilemode)
* [ignoreGrammarFiles](mmir_tooling.runtimeconfiguration.md#ignoregrammarfiles)
* [language](mmir_tooling.runtimeconfiguration.md#language)
* [mediaManager](mmir_tooling.runtimeconfiguration.md#mediamanager)
* [modelContext](mmir_tooling.runtimeconfiguration.md#modelcontext)
* [usePrecompiledGrammarsOnly](mmir_tooling.runtimeconfiguration.md#useprecompiledgrammarsonly)
* [usePrecompiledViews](mmir_tooling.runtimeconfiguration.md#useprecompiledviews)

## Properties

### controllerContext

• `Optional` **controllerContext**: string

dot-separated namespace for accessing the controller implementation's constructors
(within global namespace, e.g. `"app.ctrl" -> [window | self | global].app.ctrl`)

**`deprecated`** use module format (AMD / UMD / CommonJS (only in webpack-build) / ...) instead

___

### defaultLayoutName

• `Optional` **defaultLayoutName**: \"Default\" \| string \| null

name of the default layout definition when rendering mmir view templates: if `null`, no default layout will be used.

**`default`** "Default"

___

### detectCompiledStateModels

• `Optional` **detectCompiledStateModels**: boolean

detect if compiled state-models (i.e. JS-compiled SCXML files) are present & should be used
instead of loading & compiling SCXML files at runtime.

NOTE this is ignored in `webpack` build (since state-models will always be pre-compiled in `webpack` builds).

**`default`** true

___

### grammarAsyncCompileMode

• `Optional` **grammarAsyncCompileMode**: boolean

if JSON grammar is compiled during runtime, use async (i.e. web worker) compilation

___

### grammarAsyncExecMode

• `Optional` **grammarAsyncExecMode**: Array<string \| [AsyncGramarExecEntry](../modules/mmir_tooling.md#asyncgramarexecentry)\> \| true

list of (compiled) grammars (IDs) which should be initialized for asynchronous execution, i.e. should be exectuted in WebWorker/thread

If `true`, all (compiled) grammar will be initialized for asynchronous execution.

If list, an additional "initialization-phrase" may be specified by using `{id: string, phrase: string}`:
a phrase that should be immediately interpreted, after grammar has been loaded in the WebWorkers
(for large grammars, this may reduce delays for subsequent calls, by fully initializing the grammar)

___

### grammarCompiler

• `Optional` **grammarCompiler**: [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype)

grammar-compiler/-engine for compiling new grammars

___

### grammarDisableStrictCompileMode

• `Optional` **grammarDisableStrictCompileMode**: boolean

when compiling JSON grammar: disable setting JavaScript strict mode for compiled grammar

___

### ignoreGrammarFiles

• `Optional` **ignoreGrammarFiles**: Array<string\> \| true

list of grammars (IDs) which should not be automatically loaded on startup, even if compiled/JSON grammar is available for the language

If `true`, no file compiled grammars will be loaded on start-up (i.e. all IDs will be ignored for start-up)

___

### language

• `Optional` **language**: string

The language (code) that will be used by `mmir`, e.g.
for speech synthesis (TTS) or recognition (ASR).

Can be changed during runime with [LanguageManager.setLanguage](mmir_lib.languagemanager.md#setlanguage)

**`default`** "en"

___

### mediaManager

• `Optional` **mediaManager**: [MediaManagerPluginsConfig](../modules/mmir_tooling.md#mediamanagerpluginsconfig)

configuration for media plugins, e.g. for speech recognition (ASR) and synthesis (TTS)

___

### modelContext

• `Optional` **modelContext**: string

dot-separated namespace for accessing the model implementation's constructors
(within global namespace, e.g. `"app.ctrl" -> [window | self | global].app.ctrl`)

**`deprecated`** use module format (AMD / UMD / CommonJS (only in webpack-build) / ...) instead

___

### usePrecompiledGrammarsOnly

• `Optional` **usePrecompiledGrammarsOnly**: boolean

if selected language only has JSON grammar, prevents automatic compilation

___

### usePrecompiledViews

• `Optional` **usePrecompiledViews**: boolean

if `false`, (mmir) view templates will be (re-)compiled upon app startup

NOTE will be ignored in `webpack` build
