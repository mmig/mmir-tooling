[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [ImplementationEntry](mmir_tooling.implementationentry.md)

# Interface: ImplementationEntry

## Hierarchy

* [ImplementationOption](mmir_tooling.implementationoption.md)

  ↳ **ImplementationEntry**

## Index

### Properties

* [addModuleExport](mmir_tooling.implementationentry.md#optional-addmoduleexport)
* [exclude](mmir_tooling.implementationentry.md#optional-exclude)
* [file](mmir_tooling.implementationentry.md#optional-file)
* [name](mmir_tooling.implementationentry.md#name)
* [type](mmir_tooling.implementationentry.md#optional-type)

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

### `Optional` file

• **file**? : *string*

for explicitly specifying the implementation-file directly (e.g. instead or in addition of parsing `path`)

___

###  name

• **name**: *string*

the implementation's name (usually the ID with capitalized first letter)

___

### `Optional` type

• **type**? : *"controller" | "helper" | "model"*

the implementation's type (should not be explicitly specified)
