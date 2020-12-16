**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / HelperOptions

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

* [addModuleExport](mmir_tooling.helperoptions.md#addmoduleexport)
* [exclude](mmir_tooling.helperoptions.md#exclude)
* [helpers](mmir_tooling.helperoptions.md#helpers)
* [path](mmir_tooling.helperoptions.md#path)

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

### helpers

• `Optional` **helpers**: boolean \| { [id:string]: [ImplementationEntry](mmir_tooling.implementationentry.md) \| boolean;  }

___

### path

• `Optional` **path**: string

file path for (recursively) searching helper implementation files:
`path/.../<controller ID>Helper.js`
