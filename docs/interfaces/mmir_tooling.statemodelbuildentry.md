**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / StateModelBuildEntry

# Interface: StateModelBuildEntry

## Hierarchy

* [StateModelEntry](mmir_tooling.statemodelentry.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **StateModelBuildEntry**

## Index

### Properties

* [exclude](mmir_tooling.statemodelbuildentry.md#exclude)
* [file](mmir_tooling.statemodelbuildentry.md#file)
* [force](mmir_tooling.statemodelbuildentry.md#force)
* [id](mmir_tooling.statemodelbuildentry.md#id)
* [ignoreErrors](mmir_tooling.statemodelbuildentry.md#ignoreerrors)
* [mode](mmir_tooling.statemodelbuildentry.md#mode)
* [moduleId](mmir_tooling.statemodelbuildentry.md#moduleid)
* [moduleType](mmir_tooling.statemodelbuildentry.md#moduletype)
* [strict](mmir_tooling.statemodelbuildentry.md#strict)
* [targetDir](mmir_tooling.statemodelbuildentry.md#targetdir)

## Properties

### exclude

• `Optional` **exclude**: boolean

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[exclude](mmir_tooling.statebuildoptions.md#exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### file

• `Optional` **file**: string

*Inherited from [StateModelBuildEntry](mmir_tooling.statemodelbuildentry.md).[file](mmir_tooling.statemodelbuildentry.md#file)*

for explicitly specifying the state-machine directly (e.g. instead or in addition of parsing `path`)

___

### force

• `Optional` **force**: boolean

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### id

• `Optional` **id**: string

The ID for state model

NOTE: should not be set manually:
     ID will be derived from entry key of models property of the containing StateOptions

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
