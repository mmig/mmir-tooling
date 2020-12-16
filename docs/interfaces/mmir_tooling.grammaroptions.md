**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / GrammarOptions

# Interface: GrammarOptions

**`example`** 
```
var grammarOptions = {
	path: './grammars',
	engine: 'pegjs',
	asyncCompile: false,
	grammars: {
		ja: {ignore: true},
		de: {exclude: true},
		en: {engine: 'jscc', asyncCompile: true},

		//specifying JSON grammar files directly
		testing: {engine: 'jscc', file: path.resolve('./grammar-test/en/grammar.json')},
		testing2: {id: '!id warning!', engine: 'jison', file: path.resolve('./grammar-test/de/grammar.json_large-example')}
	}
};
```

## Hierarchy

* [GrammarOption](mmir_tooling.grammaroption.md)

  ↳ **GrammarOptions**

  ↳↳ [GrammarBuildOptions](mmir_tooling.grammarbuildoptions.md)

## Index

### Properties

* [async](mmir_tooling.grammaroptions.md#async)
* [asyncCompile](mmir_tooling.grammaroptions.md#asynccompile)
* [engine](mmir_tooling.grammaroptions.md#engine)
* [exclude](mmir_tooling.grammaroptions.md#exclude)
* [grammars](mmir_tooling.grammaroptions.md#grammars)
* [ignore](mmir_tooling.grammaroptions.md#ignore)
* [initPhrase](mmir_tooling.grammaroptions.md#initphrase)
* [path](mmir_tooling.grammaroptions.md#path)
* [strict](mmir_tooling.grammaroptions.md#strict)

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

### grammars

• `Optional` **grammars**: { [grammarId:string]: [GrammarEntry](mmir_tooling.grammarentry.md);  }

options for handling found or specified JSON grammars

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

NOTE will have no effect, if option [async](mmir_tooling.grammaroptions.md#async) is not `true`

___

### path

• `Optional` **path**: string

file path for searching (recursively) JSON grammars within languages-subdirectory:
`path/.../<grammar ID>/grammar.json`

___

### strict

• `Optional` **strict**: boolean

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[strict](mmir_tooling.grammaroptions.md#strict)*

set or disable strict-mode for generated JavaScript code

**`default`** true
