> **[mmir-tooling 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [StateModelBuildEntry](mmir_tooling.statemodelbuildentry.md) /

# Interface: StateModelBuildEntry

## Hierarchy

* [StateModelEntry](mmir_tooling.statemodelentry.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  * **StateModelBuildEntry**

## Index

### Properties

* [exclude](mmir_tooling.statemodelbuildentry.md#optional-exclude)
* [file](mmir_tooling.statemodelbuildentry.md#optional-file)
* [force](mmir_tooling.statemodelbuildentry.md#optional-force)
* [ignoreErrors](mmir_tooling.statemodelbuildentry.md#optional-ignoreerrors)
* [mode](mmir_tooling.statemodelbuildentry.md#optional-mode)
* [moduleId](mmir_tooling.statemodelbuildentry.md#optional-moduleid)
* [targetDir](mmir_tooling.statemodelbuildentry.md#optional-targetdir)

## Properties

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [StateModelEntry](mmir_tooling.statemodelentry.md).[exclude](mmir_tooling.statemodelentry.md#optional-exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### `Optional` file

• **file**? : *string*

*Inherited from [StateModelEntry](mmir_tooling.statemodelentry.md).[file](mmir_tooling.statemodelentry.md#optional-file)*

for explicitly specifying the state-machine directly (e.g. instead or in addition of parsing `path`)

___

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the grammar(s) will be newly created and written to the targetDir,
even if the up-to-date check returns `true`

___

### `Optional` ignoreErrors

• **ignoreErrors**? : *boolean*

*Inherited from [StateModelEntry](mmir_tooling.statemodelentry.md).[ignoreErrors](mmir_tooling.statemodelentry.md#optional-ignoreerrors)*

if TRUE, runtime errors will be ignored.
 if FALSE (or omitted) the compilation will fail with an error message
 when encountering SCXML runtime errors.

NOTE: if ignored, the runtime errors will be triggered when the state-machine
      enters the corresponing state during runtime!

**`default`** false

___

### `Optional` mode

• **mode**? : *"extended" | "simple"*

*Inherited from [StateModelEntry](mmir_tooling.statemodelentry.md).[mode](mmir_tooling.statemodelentry.md#optional-mode)*

run SCXML model in "simple" or "extended" mode

**`default`** "extended"

___

### `Optional` moduleId

• **moduleId**? : *string*

*Inherited from [StateModelEntry](mmir_tooling.statemodelentry.md).[moduleId](mmir_tooling.statemodelentry.md#optional-moduleid)*

the module ID for state interpreter:
if the interpreter is registered, it can be `require`'d using the `moduleId`, e.g.
```
var stateManager = mmir.require(<moduleId>);
```

(the `moduleId` will be automatically set for `inputManager` and `dialogManager`)

___

### `Optional` targetDir

• **targetDir**? : *string*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#optional-targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#optional-targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)