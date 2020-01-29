[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [StateBuildOptions](mmir_tooling.statebuildoptions.md)

# Interface: StateBuildOptions

## Hierarchy

  ↳ [StateOptions](mmir_tooling.stateoptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **StateBuildOptions**

## Index

### Properties

* [exclude](mmir_tooling.statebuildoptions.md#optional-exclude)
* [force](mmir_tooling.statebuildoptions.md#optional-force)
* [ignoreErrors](mmir_tooling.statebuildoptions.md#optional-ignoreerrors)
* [mode](mmir_tooling.statebuildoptions.md#optional-mode)
* [models](mmir_tooling.statebuildoptions.md#optional-models)
* [moduleId](mmir_tooling.statebuildoptions.md#optional-moduleid)
* [moduleType](mmir_tooling.statebuildoptions.md#optional-moduletype)
* [path](mmir_tooling.statebuildoptions.md#optional-path)
* [targetDir](mmir_tooling.statebuildoptions.md#optional-targetdir)

## Properties

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[exclude](mmir_tooling.statebuildoptions.md#optional-exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### `Optional` ignoreErrors

• **ignoreErrors**? : *boolean*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[ignoreErrors](mmir_tooling.statebuildoptions.md#optional-ignoreerrors)*

if `true`, runtime errors will be ignored.
 if `false` (or omitted) the compilation will fail with an error message
 when encountering SCXML runtime errors.

NOTE: if ignored, the runtime errors will be triggered when the state-machine
      enters the corresponing state during runtime!

**`default`** false

___

### `Optional` mode

• **mode**? : *"extended" | "simple"*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[mode](mmir_tooling.statebuildoptions.md#optional-mode)*

run SCXML model in "simple" or "extended" mode

**`default`** "extended"

___

### `Optional` models

• **models**? : *object*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[models](mmir_tooling.statebuildoptions.md#optional-models)*

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

### `Optional` moduleId

• **moduleId**? : *string*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[moduleId](mmir_tooling.statebuildoptions.md#optional-moduleid)*

the module ID for state interpreter:
if the interpreter is registered, it can be `require`'d using the `moduleId`, e.g.
```
var stateManager = mmir.require(<moduleId>);
```

(the `moduleId` will be automatically set for `inputManager` and `dialogManager`)

___

### `Optional` moduleType

• **moduleType**? : *"amd" | "commonjs"*

the module type of the generated/compiled state machine

**`default`** "amd"

___

### `Optional` path

• **path**? : *string*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[path](mmir_tooling.statebuildoptions.md#optional-path)*

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
