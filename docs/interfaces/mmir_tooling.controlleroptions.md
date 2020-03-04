[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [ControllerOptions](mmir_tooling.controlleroptions.md)

# Interface: ControllerOptions

**`example`** 
```
var ctrlOptions = {
	path: './implementations_all/controllers',
	controllers: {
		application: {
			addModuleExport: true
		},
		calendar: {
			file: path.resolve('./implementations/controllers/calendar.js')
		},
		application2: false,
		application3: {exclude: true},
	}
};
```

## Hierarchy

* [ImplementationOption](mmir_tooling.implementationoption.md)

  ↳ **ControllerOptions**

## Index

### Properties

* [addModuleExport](mmir_tooling.controlleroptions.md#optional-addmoduleexport)
* [controllers](mmir_tooling.controlleroptions.md#optional-controllers)
* [exclude](mmir_tooling.controlleroptions.md#optional-exclude)
* [path](mmir_tooling.controlleroptions.md#optional-path)

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

### `Optional` controllers

• **controllers**? : *boolean | object*

___

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [ControllerOptions](mmir_tooling.controlleroptions.md).[exclude](mmir_tooling.controlleroptions.md#optional-exclude)*

if `true`, the corresponding implementation will be excluded (when parsing `path`)

___

### `Optional` path

• **path**? : *string*

file path for (recursively) searching controller implementation files:
`path/<controller ID>.js`
