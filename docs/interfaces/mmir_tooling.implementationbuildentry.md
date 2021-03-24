**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / ImplementationBuildEntry

# Interface: ImplementationBuildEntry

## Hierarchy

* [ImplementationEntry](mmir_tooling.implementationentry.md)

  ↳ **ImplementationBuildEntry**

## Index

### Properties

* [addModuleExport](mmir_tooling.implementationbuildentry.md#addmoduleexport)
* [exclude](mmir_tooling.implementationbuildentry.md#exclude)
* [file](mmir_tooling.implementationbuildentry.md#file)
* [id](mmir_tooling.implementationbuildentry.md#id)
* [name](mmir_tooling.implementationbuildentry.md#name)
* [type](mmir_tooling.implementationbuildentry.md#type)

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

### file

• `Optional` **file**: string

*Inherited from [ImplementationBuildEntry](mmir_tooling.implementationbuildentry.md).[file](mmir_tooling.implementationbuildentry.md#file)*

for explicitly specifying the implementation-file directly (e.g. instead or in addition of parsing `path`)

___

### id

• `Optional` **id**: string

___

### name

• `Optional` **name**: string

*Inherited from [ImplementationBuildEntry](mmir_tooling.implementationbuildentry.md).[name](mmir_tooling.implementationbuildentry.md#name)*

the implementation's name (usually the ID with capitalized first letter)

___

### type

• `Optional` **type**: [ImplementationType](../modules/mmir_tooling.md#implementationtype)

*Inherited from [ImplementationBuildEntry](mmir_tooling.implementationbuildentry.md).[type](mmir_tooling.implementationbuildentry.md#type)*

the implementation's type (should not be explicitly specified)
