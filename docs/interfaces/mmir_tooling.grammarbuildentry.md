> **[mmir-tooling 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [GrammarBuildEntry](mmir_tooling.grammarbuildentry.md) /

# Interface: GrammarBuildEntry

## Hierarchy

* [GrammarEntry](mmir_tooling.grammarentry.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  * **GrammarBuildEntry**

## Index

### Properties

* [asyncCompile](mmir_tooling.grammarbuildentry.md#optional-asynccompile)
* [engine](mmir_tooling.grammarbuildentry.md#optional-engine)
* [exclude](mmir_tooling.grammarbuildentry.md#optional-exclude)
* [file](mmir_tooling.grammarbuildentry.md#optional-file)
* [force](mmir_tooling.grammarbuildentry.md#optional-force)
* [ignore](mmir_tooling.grammarbuildentry.md#optional-ignore)
* [targetDir](mmir_tooling.grammarbuildentry.md#optional-targetdir)

## Properties

### `Optional` asyncCompile

• **asyncCompile**? : *boolean*

*Inherited from [GrammarEntry](mmir_tooling.grammarentry.md).[asyncCompile](mmir_tooling.grammarentry.md#optional-asynccompile)*

if `true`, and thread-webworker is available, grammar will be compiled paralelized / in a separate thread

**`default`** true

___

### `Optional` engine

• **engine**? : *"jscc" | "jison" | "pegjs"*

*Inherited from [GrammarEntry](mmir_tooling.grammarentry.md).[engine](mmir_tooling.grammarentry.md#optional-engine)*

the Grammar engine that will be used to compile the executable grammar.

**`default`** "jscc"

___

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [GrammarEntry](mmir_tooling.grammarentry.md).[exclude](mmir_tooling.grammarentry.md#optional-exclude)*

if `true`, the corresponding grammar will be completely excluded, i.e. no executable grammar will be compiled
from the corresponding JSON grammar

___

### `Optional` file

• **file**? : *string*

*Inherited from [GrammarEntry](mmir_tooling.grammarentry.md).[file](mmir_tooling.grammarentry.md#optional-file)*

for specifying the JSON grammar directly (e.g. instead or in addition of parsing `path` for grammar files):
the (absolute) path to the JSON grammar (from which the executable grammar will be created)

___

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the grammar(s) will be newly created and written to the targetDir,
even if the up-to-date check returns `true`

___

### `Optional` ignore

• **ignore**? : *boolean*

*Inherited from [GrammarEntry](mmir_tooling.grammarentry.md).[ignore](mmir_tooling.grammarentry.md#optional-ignore)*

if `true`, the grammar will not be loaded (and registered) when the the app is initialized, i.e. needs to be
  "manually" loaded/initialized by app implementation and/or other mechanisms.
If omitted or `false`, the grammar will be loaded on start-up of the app,
  and then will be available e.g. via `mmir.semantic.interprest(<input phrase string>, <grammar-id>)`

___

### `Optional` targetDir

• **targetDir**? : *string*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#optional-targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#optional-targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)