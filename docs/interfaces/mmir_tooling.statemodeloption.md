[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [StateModelOption](mmir_tooling.statemodeloption.md)

# Interface: StateModelOption

## Hierarchy

* **StateModelOption**

  ↳ [StateOptions](mmir_tooling.stateoptions.md)

  ↳ [StateModelEntry](mmir_tooling.statemodelentry.md)

## Index

### Properties

* [exclude](mmir_tooling.statemodeloption.md#optional-exclude)
* [ignoreErrors](mmir_tooling.statemodeloption.md#optional-ignoreerrors)
* [mode](mmir_tooling.statemodeloption.md#optional-mode)
* [moduleId](mmir_tooling.statemodeloption.md#optional-moduleid)

## Properties

### `Optional` exclude

• **exclude**? : *boolean*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### `Optional` ignoreErrors

• **ignoreErrors**? : *boolean*

if `true`, runtime errors will be ignored.
 if `false` (or omitted) the compilation will fail with an error message
 when encountering SCXML runtime errors.

NOTE: if ignored, the runtime errors will be triggered when the state-machine
      enters the corresponing state during runtime!

**`default`** false

___

### `Optional` mode

• **mode**? : *"extended" | "simple"*

run SCXML model in "simple" or "extended" mode

**`default`** "extended"

___

### `Optional` moduleId

• **moduleId**? : *string*

the module ID for state interpreter:
if the interpreter is registered, it can be `require`'d using the `moduleId`, e.g.
```
var stateManager = mmir.require(<moduleId>);
```

(the `moduleId` will be automatically set for `inputManager` and `dialogManager`)
