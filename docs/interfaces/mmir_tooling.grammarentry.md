**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / GrammarEntry

# Interface: GrammarEntry

## Hierarchy

* [GrammarOption](mmir_tooling.grammaroption.md)

  ↳ **GrammarEntry**

  ↳↳ [GrammarBuildEntry](mmir_tooling.grammarbuildentry.md)

## Index

### Properties

* [async](mmir_tooling.grammarentry.md#async)
* [asyncCompile](mmir_tooling.grammarentry.md#asynccompile)
* [engine](mmir_tooling.grammarentry.md#engine)
* [exclude](mmir_tooling.grammarentry.md#exclude)
* [file](mmir_tooling.grammarentry.md#file)
* [id](mmir_tooling.grammarentry.md#id)
* [ignore](mmir_tooling.grammarentry.md#ignore)
* [initPhrase](mmir_tooling.grammarentry.md#initphrase)
* [strict](mmir_tooling.grammarentry.md#strict)

## Properties

### async

• `Optional` **async**: boolean

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[async](mmir_tooling.grammaroptions.md#async)*

grammar-execution (during runtime) will be asynchronous in a WebWorker/thread

NOTE: invocations must always provide a callback, for async-exec grammars

**`example`** 
mmir.semantic.interpret('this is my test phrase', function(result){
	// do something with grammar execution result
})

___

### asyncCompile

• `Optional` **asyncCompile**: boolean

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[asyncCompile](mmir_tooling.grammaroptions.md#asynccompile)*

if `true`, and thread-webworker is available, grammar will be compiled paralelized / in a separate thread

**`default`** true

___

### engine

• `Optional` **engine**: [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype)

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[engine](mmir_tooling.grammaroptions.md#engine)*

the Grammar engine that will be used to compile the executable grammar.

**`default`** "jscc"

___

### exclude

• `Optional` **exclude**: boolean

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[exclude](mmir_tooling.grammaroptions.md#exclude)*

if `true`, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
from the corresponding JSON grammar

___

### file

• `Optional` **file**: string

for specifying the JSON grammar directly (e.g. instead or in addition of parsing `path` for grammar files):
the (absolute) path to the JSON grammar (from which the executable grammar will be created)

___

### id

• `Optional` **id**: string

the grammar ID

WARNING will be automatically set -- if it is manully set, it may get overwritten!

___

### ignore

• `Optional` **ignore**: boolean

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[ignore](mmir_tooling.grammaroptions.md#ignore)*

if `true`, the grammar will not be loaded (and registered) when the the app is initialized, i.e. needs to be
  "manually" loaded/initialized by app implementation and/or other mechanisms.
If omitted or `false`, the grammar will be loaded on start-up of the app,
  and then will be available e.g. via `mmir.semantic.interprest(<input phrase string>, <grammar-id>)`

___

### initPhrase

• `Optional` **initPhrase**: string

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[initPhrase](mmir_tooling.grammaroptions.md#initphrase)*

An "initialization phrase" for the grammar, in case of async-exection:
this phrase will be immediately interpreted, after grammar has been loaded for async-execution in the WebWorkers
(for large grammars, this may reduce delays for subsequent calls, by fully initializing the grammar)

NOTE will have no effect, if option [async](mmir_tooling.grammarentry.md#async) is not `true`

___

### strict

• `Optional` **strict**: boolean

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[strict](mmir_tooling.grammaroptions.md#strict)*

set or disable strict-mode for generated JavaScript code

**`default`** true
