**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / ControllerOptions

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

* [addModuleExport](mmir_tooling.controlleroptions.md#addmoduleexport)
* [controllers](mmir_tooling.controlleroptions.md#controllers)
* [exclude](mmir_tooling.controlleroptions.md#exclude)
* [path](mmir_tooling.controlleroptions.md#path)

## Properties

### addModuleExport

• `Optional` **addModuleExport**: boolean \| string

*Inherited from [ImplementationBuildEntry](mmir_tooling.implementationbuildentry.md).[addModuleExport](mmir_tooling.implementationbuildentry.md#addmoduleexport)*

for automatically converting old-style implementations that are no CommonJS or AMD modules:
if true, explicitly exports the implementation resource, i.e. adds something like
<pre>
module.exports.<resource name> = <resource constructor>;
</pre>
to the implementation source/module.

If string, the specified string will be used for the export.

___

### controllers

• `Optional` **controllers**: boolean \| { [id:string]: [ImplementationEntry](mmir_tooling.implementationentry.md) \| boolean;  }

___

### exclude

• `Optional` **exclude**: boolean

*Inherited from [ImplementationBuildEntry](mmir_tooling.implementationbuildentry.md).[exclude](mmir_tooling.implementationbuildentry.md#exclude)*

if `true`, the corresponding implementation will be excluded (when parsing `path`)

___

### path

• `Optional` **path**: string

file path for (recursively) searching controller implementation files:
`path/<controller ID>.js`
