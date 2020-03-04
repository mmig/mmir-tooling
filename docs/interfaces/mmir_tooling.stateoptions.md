[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [StateOptions](mmir_tooling.stateoptions.md)

# Interface: StateOptions

**`example`** 
```
var stateOptions = {
	path: 'www/config/states',
	ignoreErrors: true,
	models: {
		input: {
			mode: 'simple',
			file: './alt_config/states_minimal/input.xml'
		},
		dialog: {
			ignoreErrors: false,
			mode: 'extended'
		}
	}
};
```

## Hierarchy

* [StateModelOption](mmir_tooling.statemodeloption.md)

  ↳ **StateOptions**

  ↳ [StateBuildOptions](mmir_tooling.statebuildoptions.md)

## Index

### Properties

* [exclude](mmir_tooling.stateoptions.md#optional-exclude)
* [ignoreErrors](mmir_tooling.stateoptions.md#optional-ignoreerrors)
* [mode](mmir_tooling.stateoptions.md#optional-mode)
* [models](mmir_tooling.stateoptions.md#optional-models)
* [moduleId](mmir_tooling.stateoptions.md#optional-moduleid)
* [path](mmir_tooling.stateoptions.md#optional-path)

## Properties

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[exclude](mmir_tooling.statebuildoptions.md#optional-exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

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

### `Optional` path

• **path**? : *string*

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
