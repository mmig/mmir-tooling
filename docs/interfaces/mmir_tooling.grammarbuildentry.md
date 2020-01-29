[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [GrammarBuildEntry](mmir_tooling.grammarbuildentry.md)

# Interface: GrammarBuildEntry

## Hierarchy

  ↳ [GrammarEntry](mmir_tooling.grammarentry.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **GrammarBuildEntry**

## Index

### Properties

* [async](mmir_tooling.grammarbuildentry.md#optional-async)
* [asyncCompile](mmir_tooling.grammarbuildentry.md#optional-asynccompile)
* [engine](mmir_tooling.grammarbuildentry.md#optional-engine)
* [exclude](mmir_tooling.grammarbuildentry.md#optional-exclude)
* [file](mmir_tooling.grammarbuildentry.md#optional-file)
* [force](mmir_tooling.grammarbuildentry.md#optional-force)
* [id](mmir_tooling.grammarbuildentry.md#optional-id)
* [ignore](mmir_tooling.grammarbuildentry.md#optional-ignore)
* [initPhrase](mmir_tooling.grammarbuildentry.md#optional-initphrase)
* [targetDir](mmir_tooling.grammarbuildentry.md#optional-targetdir)

## Properties

### `Optional` async

• **async**? : *boolean*

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[async](mmir_tooling.grammaroptions.md#optional-async)*

grammar-execution (during runtime) will be asynchronous in a WebWorker/thread

NOTE: invocations must always provide a callback, for async-exec grammars

**`example`** 
mmir.semantic.interpret('this is my test phrase', function(result){
	// do something with grammar execution result
})

___

### `Optional` asyncCompile

• **asyncCompile**? : *boolean*

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[asyncCompile](mmir_tooling.grammaroptions.md#optional-asynccompile)*

if `true`, and thread-webworker is available, grammar will be compiled paralelized / in a separate thread

**`default`** true

___

### `Optional` engine

• **engine**? : *"jscc" | "jison" | "pegjs"*

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[engine](mmir_tooling.grammaroptions.md#optional-engine)*

the Grammar engine that will be used to compile the executable grammar.

**`default`** "jscc"

___

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[exclude](mmir_tooling.grammaroptions.md#optional-exclude)*

if `true`, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
from the corresponding JSON grammar

___

### `Optional` file

• **file**? : *string*

*Inherited from [GrammarBuildEntry](mmir_tooling.grammarbuildentry.md).[file](mmir_tooling.grammarbuildentry.md#optional-file)*

for specifying the JSON grammar directly (e.g. instead or in addition of parsing `path` for grammar files):
the (absolute) path to the JSON grammar (from which the executable grammar will be created)

___

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### `Optional` id

• **id**? : *string*

*Inherited from [GrammarBuildEntry](mmir_tooling.grammarbuildentry.md).[id](mmir_tooling.grammarbuildentry.md#optional-id)*

the grammar ID

WARNING will be automatically set -- if it is manully set, it may get overwritten!

___

### `Optional` ignore

• **ignore**? : *boolean*

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[ignore](mmir_tooling.grammaroptions.md#optional-ignore)*

if `true`, the grammar will not be loaded (and registered) when the the app is initialized, i.e. needs to be
  "manually" loaded/initialized by app implementation and/or other mechanisms.
If omitted or `false`, the grammar will be loaded on start-up of the app,
  and then will be available e.g. via `mmir.semantic.interprest(<input phrase string>, <grammar-id>)`

___

### `Optional` initPhrase

• **initPhrase**? : *string*

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[initPhrase](mmir_tooling.grammaroptions.md#optional-initphrase)*

An "initialization phrase" for the grammar, in case of async-exection:
this phrase will be immediately interpreted, after grammar has been loaded for async-execution in the WebWorkers
(for large grammars, this may reduce delays for subsequent calls, by fully initializing the grammar)

NOTE will have no effect, if option [async](mmir_tooling.grammarbuildentry.md#optional-async) is not `true`

___

### `Optional` targetDir

• **targetDir**? : *string*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#optional-targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#optional-targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)
