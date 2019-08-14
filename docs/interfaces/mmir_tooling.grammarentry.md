> **[mmir-tooling 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [GrammarEntry](mmir_tooling.grammarentry.md) /

# Interface: GrammarEntry

## Hierarchy

* **GrammarEntry**

  * [GrammarBuildEntry](mmir_tooling.grammarbuildentry.md)

## Index

### Properties

* [asyncCompile](mmir_tooling.grammarentry.md#optional-asynccompile)
* [engine](mmir_tooling.grammarentry.md#optional-engine)
* [exclude](mmir_tooling.grammarentry.md#optional-exclude)
* [file](mmir_tooling.grammarentry.md#optional-file)
* [ignore](mmir_tooling.grammarentry.md#optional-ignore)

## Properties

### `Optional` asyncCompile

• **asyncCompile**? : *boolean*

if `true`, and thread-webworker is available, grammar will be compiled paralelized / in a separate thread

**`default`** true

___

### `Optional` engine

• **engine**? : *"jscc" | "jison" | "pegjs"*

the Grammar engine that will be used to compile the executable grammar.

**`default`** "jscc"

___

### `Optional` exclude

• **exclude**? : *boolean*

if `true`, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
from the corresponding JSON grammar

___

### `Optional` file

• **file**? : *string*

for specifying the JSON grammar directly (e.g. instead or in addition of parsing `path` for grammar files):
the (absolute) path to the JSON grammar (from which the executable grammar will be created)

___

### `Optional` ignore

• **ignore**? : *boolean*

if `true`, the grammar will not be loaded (and registered) when the the app is initialized, i.e. needs to be
  "manually" loaded/initialized by app implementation and/or other mechanisms.
If omitted or `false`, the grammar will be loaded on start-up of the app,
  and then will be available e.g. via `mmir.semantic.interprest(<input phrase string>, <grammar-id>)`