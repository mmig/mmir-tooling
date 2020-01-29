[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [GrammarBuildOptions](mmir_tooling.grammarbuildoptions.md)

# Interface: GrammarBuildOptions

## Hierarchy

  ↳ [GrammarOptions](mmir_tooling.grammaroptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **GrammarBuildOptions**

## Index

### Properties

* [async](mmir_tooling.grammarbuildoptions.md#optional-async)
* [asyncCompile](mmir_tooling.grammarbuildoptions.md#optional-asynccompile)
* [engine](mmir_tooling.grammarbuildoptions.md#optional-engine)
* [exclude](mmir_tooling.grammarbuildoptions.md#optional-exclude)
* [force](mmir_tooling.grammarbuildoptions.md#optional-force)
* [grammars](mmir_tooling.grammarbuildoptions.md#optional-grammars)
* [ignore](mmir_tooling.grammarbuildoptions.md#optional-ignore)
* [initPhrase](mmir_tooling.grammarbuildoptions.md#optional-initphrase)
* [path](mmir_tooling.grammarbuildoptions.md#optional-path)
* [targetDir](mmir_tooling.grammarbuildoptions.md#optional-targetdir)

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

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### `Optional` grammars

• **grammars**? : *object*

*Overrides [GrammarOptions](mmir_tooling.grammaroptions.md).[grammars](mmir_tooling.grammaroptions.md#optional-grammars)*

**`override`** 

#### Type declaration:

* \[ **grammarId**: *string*\]: [GrammarBuildEntry](mmir_tooling.grammarbuildentry.md)

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

NOTE will have no effect, if option [async](mmir_tooling.grammarbuildoptions.md#optional-async) is not `true`

___

### `Optional` path

• **path**? : *string*

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[path](mmir_tooling.grammaroptions.md#optional-path)*

file path for searching (recursively) JSON grammars within languages-subdirectory:
`path/.../<grammar ID>/grammar.json`

___

### `Optional` targetDir

• **targetDir**? : *string*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#optional-targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#optional-targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)
