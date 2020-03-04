[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [ModelOptions](mmir_tooling.modeloptions.md)

# Interface: ModelOptions

**`example`** 
```
var modelOptions = {
	path: './implementations_all/models',
	models: {
		user: {addModuleExport: 'mmir.User'},
		calendarModel: {addModuleExport: 'mmir.CalendarModel'}
	}
};
```

## Hierarchy

* [ImplementationOption](mmir_tooling.implementationoption.md)

  ↳ **ModelOptions**

## Index

### Properties

* [addModuleExport](mmir_tooling.modeloptions.md#optional-addmoduleexport)
* [exclude](mmir_tooling.modeloptions.md#optional-exclude)
* [models](mmir_tooling.modeloptions.md#optional-models)
* [path](mmir_tooling.modeloptions.md#optional-path)

## Properties

### `Optional` addModuleExport

• **addModuleExport**? : *boolean | string*

*Inherited from [ControllerOptions](mmir_tooling.controlleroptions.md).[addModuleExport](mmir_tooling.controlleroptions.md#optional-addmoduleexport)*

for automatically converting old-style implementations that are no CommonJS or AMD modules:
if true, explicitly exports the implementation resource, i.e. adds something like
<pre>
module.exports.<resource name> = <resource constructor>;
</pre>
to the implementation source/module.

If string, the specified string will be used for the export.

___

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [ControllerOptions](mmir_tooling.controlleroptions.md).[exclude](mmir_tooling.controlleroptions.md#optional-exclude)*

if `true`, the corresponding implementation will be excluded (when parsing `path`)

___

### `Optional` models

• **models**? : *boolean | object*

___

### `Optional` path

• **path**? : *string*

file path for searching (data) model implementation files:
`path/<model ID>.js`
