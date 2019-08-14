> **[mmir-tooling 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [StateBuildOptions](mmir_tooling.statebuildoptions.md) /

# Interface: StateBuildOptions

## Hierarchy

* [StateOptions](mmir_tooling.stateoptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  * **StateBuildOptions**

## Index

### Properties

* [force](mmir_tooling.statebuildoptions.md#optional-force)
* [ignoreErrors](mmir_tooling.statebuildoptions.md#optional-ignoreerrors)
* [models](mmir_tooling.statebuildoptions.md#optional-models)
* [moduleType](mmir_tooling.statebuildoptions.md#optional-moduletype)
* [path](mmir_tooling.statebuildoptions.md#optional-path)
* [targetDir](mmir_tooling.statebuildoptions.md#optional-targetdir)

## Properties

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the grammar(s) will be newly created and written to the targetDir,
even if the up-to-date check returns `true`

___

### `Optional` ignoreErrors

• **ignoreErrors**? : *boolean*

*Inherited from [StateOptions](mmir_tooling.stateoptions.md).[ignoreErrors](mmir_tooling.stateoptions.md#optional-ignoreerrors)*

if `true`, runtime errors will be ignored.
 if `false` (or omitted) the compilation will fail with an error message
 when encountering SCXML runtime errors.

NOTE: if ignored, the runtime errors will be triggered when the state-machine
      enters the corresponing state during runtime!

**`default`** false

___

### `Optional` models

• **models**? : *object*

*Inherited from [StateOptions](mmir_tooling.stateoptions.md).[models](mmir_tooling.stateoptions.md#optional-models)*

optionally specify options for found resource, or specifying resources/locations directly

If `input` or `dialog` are missing (e.g. no resources matching them could be found),
default "minimal" state-models will be used for `inputManager` and `dialogManager`.

NOTE: for custom state-models whichs' files are determined by parsing [StateOptions.path](mmir_tooling.stateoptions.md#optional-path),
      the `id` will be the file name (case sensitive, without extension).

#### Type declaration:

* \[ **id**: *string*\]: [StateModelEntry](mmir_tooling.statemodelentry.md)

* **dialog**? : *[StateModelEntry](mmir_tooling.statemodelentry.md)*

* **input**? : *[StateModelEntry](mmir_tooling.statemodelentry.md)*

___

### `Optional` moduleType

• **moduleType**? : *"amd" | "commonjs"*

the module type of the generated/compiled state machine

**`default`** "amd"

___

### `Optional` path

• **path**? : *string*

*Inherited from [StateOptions](mmir_tooling.stateoptions.md).[path](mmir_tooling.stateoptions.md#optional-path)*

file path for searching (recursively) for SCXML files (state-models):
```bash
path/.../dialog.xml -> type "dialog"
        /input.xml  -> type "input"
```

NOTE: for backwards compatibility, the following file names are also accepted
      and mapped to their corresponding type
```bash
        "dialogDescriptionSCXML.xml" -> "dialog"
        "inputDescriptionSCXML.xml" -> "input"
```

Or custom state models (SCXML definitions) with file extension `.xml`.

___

### `Optional` targetDir

• **targetDir**? : *string*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#optional-targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#optional-targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)