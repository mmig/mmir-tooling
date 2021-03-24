**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / ModelOptions

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

* [addModuleExport](mmir_tooling.modeloptions.md#addmoduleexport)
* [exclude](mmir_tooling.modeloptions.md#exclude)
* [models](mmir_tooling.modeloptions.md#models)
* [path](mmir_tooling.modeloptions.md#path)

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

### exclude

• `Optional` **exclude**: boolean

*Inherited from [ImplementationBuildEntry](mmir_tooling.implementationbuildentry.md).[exclude](mmir_tooling.implementationbuildentry.md#exclude)*

if `true`, the corresponding implementation will be excluded (when parsing `path`)

___

### models

• `Optional` **models**: boolean \| { [id:string]: [ImplementationEntry](mmir_tooling.implementationentry.md) \| boolean;  }

___

### path

• `Optional` **path**: string

file path for searching (data) model implementation files:
`path/<model ID>.js`
