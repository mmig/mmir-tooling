**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / StateOptions

# Interface: StateOptions

**`example`** 
```
var stateOptions = {
	path: 'www/config/states',
	ignoreErrors: true,
	models: {
		input: {
			mode: 'simple',
			file: './alt_config/states_minimal/input.xml',
			strict: false
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

  ↳↳ [StateBuildOptions](mmir_tooling.statebuildoptions.md)

## Index

### Properties

* [exclude](mmir_tooling.stateoptions.md#exclude)
* [ignoreErrors](mmir_tooling.stateoptions.md#ignoreerrors)
* [mode](mmir_tooling.stateoptions.md#mode)
* [models](mmir_tooling.stateoptions.md#models)
* [moduleId](mmir_tooling.stateoptions.md#moduleid)
* [path](mmir_tooling.stateoptions.md#path)
* [strict](mmir_tooling.stateoptions.md#strict)

## Properties

### exclude

• `Optional` **exclude**: boolean

*Inherited from [StateBuildOptions](mmir_tooling.statebuildoptions.md).[exclude](mmir_tooling.statebuildoptions.md#exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

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

• `Optional` **models**: [StateModelsOption](mmir_tooling.statemodelsoption.md)

optionally specify options for found resource, or specifying resources/locations directly

If `input` or `dialog` are missing (e.g. no resources matching them could be found),
default "minimal" state-models will be used for `inputManager` and `dialogManager`.

NOTE: for custom state-models whichs' files are determined by parsing [StateOptions.path](mmir_tooling.stateoptions.md#path),
      the `id` will be the file name (case sensitive, without extension).

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

### path

• `Optional` **path**: string

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
