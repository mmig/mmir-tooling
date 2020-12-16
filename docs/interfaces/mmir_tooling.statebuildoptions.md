**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / StateBuildOptions

# Interface: StateBuildOptions

## Hierarchy

* [StateOptions](mmir_tooling.stateoptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **StateBuildOptions**

## Index

### Properties

* [defaultType](mmir_tooling.statebuildoptions.md#defaulttype)
* [exclude](mmir_tooling.statebuildoptions.md#exclude)
* [force](mmir_tooling.statebuildoptions.md#force)
* [ignoreErrors](mmir_tooling.statebuildoptions.md#ignoreerrors)
* [mode](mmir_tooling.statebuildoptions.md#mode)
* [models](mmir_tooling.statebuildoptions.md#models)
* [moduleId](mmir_tooling.statebuildoptions.md#moduleid)
* [moduleType](mmir_tooling.statebuildoptions.md#moduletype)
* [path](mmir_tooling.statebuildoptions.md#path)
* [strict](mmir_tooling.statebuildoptions.md#strict)
* [targetDir](mmir_tooling.statebuildoptions.md#targetdir)

## Properties

### defaultType

• `Optional` **defaultType**: [StateModelMode](../modules/mmir_tooling.md#statemodelmode) \| \"minimal\"

if default models for 'input' and 'dialog' are created, specifies their
mode
(defaults will be created, if no definition for the models is specified
 or can be found the the resources path(s))

___

### exclude

• `Optional` **exclude**: boolean

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[exclude](mmir_tooling.statebuildoptions.md#exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### force

• `Optional` **force**: boolean

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### ignoreErrors

• `Optional` **ignoreErrors**: boolean

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[ignoreErrors](mmir_tooling.statebuildoptions.md#ignoreerrors)*

if `true`, runtime errors will be ignored.
 if `false` (or omitted) the compilation will fail with an error message
 when encountering SCXML runtime errors.

NOTE: if ignored, the runtime errors will be triggered when the state-machine
      enters the corresponing state during runtime!

**`default`** false

___

### mode

• `Optional` **mode**: [StateModelMode](../modules/mmir_tooling.md#statemodelmode)

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[mode](mmir_tooling.statebuildoptions.md#mode)*

run SCXML model in "simple" or "extended" mode

**`default`** "extended"

___

### models

• `Optional` **models**: [StateModelsBuildOption](mmir_tooling.statemodelsbuildoption.md)

*Overrides [StateOptions](mmir_tooling.stateoptions.md).[models](mmir_tooling.stateoptions.md#models)*

___

### moduleId

• `Optional` **moduleId**: string

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[moduleId](mmir_tooling.statebuildoptions.md#moduleid)*

the module ID for state interpreter:
if the interpreter is registered, it can be `require`'d using the `moduleId`, e.g.
```
var stateManager = mmir.require(<moduleId>);
```

(the `moduleId` will be automatically set for `inputManager` and `dialogManager`)

___

### moduleType

• `Optional` **moduleType**: \"amd\" \| \"commonjs\"

the module type of the generated/compiled state machine

**`default`** "amd"

___

### path

• `Optional` **path**: string

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[path](mmir_tooling.statebuildoptions.md#path)*

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

### strict

• `Optional` **strict**: boolean

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[strict](mmir_tooling.statebuildoptions.md#strict)*

set or disable strict-mode for generated JavaScript code

**`default`** true

___

### targetDir

• `Optional` **targetDir**: string

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)
