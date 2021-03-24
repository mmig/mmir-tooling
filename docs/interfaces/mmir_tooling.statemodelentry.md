**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / StateModelEntry

# Interface: StateModelEntry

## Hierarchy

* [StateModelOption](mmir_tooling.statemodeloption.md)

  ↳ **StateModelEntry**

  ↳↳ [StateModelBuildEntry](mmir_tooling.statemodelbuildentry.md)

## Index

### Properties

* [exclude](mmir_tooling.statemodelentry.md#exclude)
* [file](mmir_tooling.statemodelentry.md#file)
* [ignoreErrors](mmir_tooling.statemodelentry.md#ignoreerrors)
* [mode](mmir_tooling.statemodelentry.md#mode)
* [moduleId](mmir_tooling.statemodelentry.md#moduleid)
* [strict](mmir_tooling.statemodelentry.md#strict)

## Properties

### exclude

• `Optional` **exclude**: boolean

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[exclude](mmir_tooling.statebuildoptions.md#exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### file

• `Optional` **file**: string

for explicitly specifying the state-machine directly (e.g. instead or in addition of parsing `path`)

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

### strict

• `Optional` **strict**: boolean

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[strict](mmir_tooling.statebuildoptions.md#strict)*

set or disable strict-mode for generated JavaScript code

**`default`** true
