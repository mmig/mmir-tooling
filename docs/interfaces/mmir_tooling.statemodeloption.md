**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / StateModelOption

# Interface: StateModelOption

## Hierarchy

* **StateModelOption**

  ↳ [StateOptions](mmir_tooling.stateoptions.md)

  ↳ [StateModelEntry](mmir_tooling.statemodelentry.md)

## Index

### Properties

* [exclude](mmir_tooling.statemodeloption.md#exclude)
* [ignoreErrors](mmir_tooling.statemodeloption.md#ignoreerrors)
* [mode](mmir_tooling.statemodeloption.md#mode)
* [moduleId](mmir_tooling.statemodeloption.md#moduleid)
* [strict](mmir_tooling.statemodeloption.md#strict)

## Properties

### exclude

• `Optional` **exclude**: boolean

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### ignoreErrors

• `Optional` **ignoreErrors**: boolean

if `true`, runtime errors will be ignored.
 if `false` (or omitted) the compilation will fail with an error message
 when encountering SCXML runtime errors.

NOTE: if ignored, the runtime errors will be triggered when the state-machine
      enters the corresponing state during runtime!

**`default`** false

___

### mode

• `Optional` **mode**: [StateModelMode](../modules/mmir_tooling.md#statemodelmode)

run SCXML model in "simple" or "extended" mode

**`default`** "extended"

___

### moduleId

• `Optional` **moduleId**: string

the module ID for state interpreter:
if the interpreter is registered, it can be `require`'d using the `moduleId`, e.g.
```
var stateManager = mmir.require(<moduleId>);
```

(the `moduleId` will be automatically set for `inputManager` and `dialogManager`)

___

### strict

• `Optional` **strict**: boolean

set or disable strict-mode for generated JavaScript code

**`default`** true
