[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [StateModelEntry](mmir_tooling.statemodelentry.md)

# Interface: StateModelEntry

## Hierarchy

* [StateModelOption](mmir_tooling.statemodeloption.md)

  ↳ **StateModelEntry**

  ↳ [StateModelBuildEntry](mmir_tooling.statemodelbuildentry.md)

## Index

### Properties

* [exclude](mmir_tooling.statemodelentry.md#optional-exclude)
* [file](mmir_tooling.statemodelentry.md#optional-file)
* [ignoreErrors](mmir_tooling.statemodelentry.md#optional-ignoreerrors)
* [mode](mmir_tooling.statemodelentry.md#optional-mode)
* [moduleId](mmir_tooling.statemodelentry.md#optional-moduleid)

## Properties

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[exclude](mmir_tooling.statebuildoptions.md#optional-exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### `Optional` file

• **file**? : *string*

for explicitly specifying the state-machine directly (e.g. instead or in addition of parsing `path`)

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

### `Optional` moduleId

• **moduleId**? : *string*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[moduleId](mmir_tooling.statebuildoptions.md#optional-moduleid)*

the module ID for state interpreter:
if the interpreter is registered, it can be `require`'d using the `moduleId`, e.g.
```
var stateManager = mmir.require(<moduleId>);
```

(the `moduleId` will be automatically set for `inputManager` and `dialogManager`)
