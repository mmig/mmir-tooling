> **[mmir-tooling 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [GrammarBuildOptions](mmir_tooling.grammarbuildoptions.md) /

# Interface: GrammarBuildOptions

## Hierarchy

* [GrammarOptions](mmir_tooling.grammaroptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  * **GrammarBuildOptions**

## Index

### Properties

* [force](mmir_tooling.grammarbuildoptions.md#optional-force)
* [grammars](mmir_tooling.grammarbuildoptions.md#optional-grammars)
* [path](mmir_tooling.grammarbuildoptions.md#optional-path)
* [targetDir](mmir_tooling.grammarbuildoptions.md#optional-targetdir)

## Properties

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the grammar(s) will be newly created and written to the targetDir,
even if the up-to-date check returns `true`

___

### `Optional` grammars

• **grammars**? : *object*

*Inherited from [GrammarOptions](mmir_tooling.grammaroptions.md).[grammars](mmir_tooling.grammaroptions.md#optional-grammars)*

options for handling found or specified JSON grammars

#### Type declaration:

* \[ **grammarId**: *string*\]: [GrammarEntry](mmir_tooling.grammarentry.md)

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