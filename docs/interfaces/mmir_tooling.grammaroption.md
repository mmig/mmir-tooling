**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / GrammarOption

# Interface: GrammarOption

## Hierarchy

* **GrammarOption**

  ↳ [GrammarOptions](mmir_tooling.grammaroptions.md)

  ↳ [GrammarEntry](mmir_tooling.grammarentry.md)

## Index

### Properties

* [async](mmir_tooling.grammaroption.md#async)
* [asyncCompile](mmir_tooling.grammaroption.md#asynccompile)
* [engine](mmir_tooling.grammaroption.md#engine)
* [exclude](mmir_tooling.grammaroption.md#exclude)
* [ignore](mmir_tooling.grammaroption.md#ignore)
* [initPhrase](mmir_tooling.grammaroption.md#initphrase)
* [strict](mmir_tooling.grammaroption.md#strict)

## Properties

### async

• `Optional` **async**: boolean

grammar-execution (during runtime) will be asynchronous in a WebWorker/thread

NOTE: invocations must always provide a callback, for async-exec grammars

**`example`** 
mmir.semantic.interpret('this is my test phrase', function(result){
	// do something with grammar execution result
})

___

### asyncCompile

• `Optional` **asyncCompile**: boolean

if `true`, and thread-webworker is available, grammar will be compiled paralelized / in a separate thread

**`default`** true

___

### engine

• `Optional` **engine**: [GrammarEngineType](../modules/mmir_lib.md#grammarenginetype)

the Grammar engine that will be used to compile the executable grammar.

**`default`** "jscc"

___

### exclude

• `Optional` **exclude**: boolean

if `true`, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
from the corresponding JSON grammar

___

### ignore

• `Optional` **ignore**: boolean

if `true`, the grammar will not be loaded (and registered) when the the app is initialized, i.e. needs to be
  "manually" loaded/initialized by app implementation and/or other mechanisms.
If omitted or `false`, the grammar will be loaded on start-up of the app,
  and then will be available e.g. via `mmir.semantic.interprest(<input phrase string>, <grammar-id>)`

___

### initPhrase

• `Optional` **initPhrase**: string

An "initialization phrase" for the grammar, in case of async-exection:
this phrase will be immediately interpreted, after grammar has been loaded for async-execution in the WebWorkers
(for large grammars, this may reduce delays for subsequent calls, by fully initializing the grammar)

NOTE will have no effect, if option [async](mmir_tooling.grammaroption.md#async) is not `true`

___

### strict

• `Optional` **strict**: boolean

set or disable strict-mode for generated JavaScript code

**`default`** true
