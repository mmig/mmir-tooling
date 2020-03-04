[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [HelperOptions](mmir_tooling.helperoptions.md)

# Interface: HelperOptions

**`example`** 
```
var helperOptions = {
	path: './implementations_all/helpers',
	addModuleExport: true,
	helpers: {
		calendarHelper: {exclude: false}
	}
};
```

## Hierarchy

* [ImplementationOption](mmir_tooling.implementationoption.md)

  ↳ **HelperOptions**

## Index

### Properties

* [addModuleExport](mmir_tooling.helperoptions.md#optional-addmoduleexport)
* [exclude](mmir_tooling.helperoptions.md#optional-exclude)
* [helpers](mmir_tooling.helperoptions.md#optional-helpers)
* [path](mmir_tooling.helperoptions.md#optional-path)

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

### `Optional` helpers

• **helpers**? : *boolean | object*

___

### `Optional` path

• **path**? : *string*

file path for (recursively) searching helper implementation files:
`path/.../<controller ID>Helper.js`
