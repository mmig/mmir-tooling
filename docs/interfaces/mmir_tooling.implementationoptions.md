> **[mmir-tooling 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [ImplementationOptions](mmir_tooling.implementationoptions.md) /

# Interface: ImplementationOptions

## Hierarchy

* **ImplementationOptions**

  * [ViewBuildEntry](mmir_tooling.viewbuildentry.md)

## Index

### Properties

* [addModuleExport](mmir_tooling.implementationoptions.md#optional-addmoduleexport)
* [exclude](mmir_tooling.implementationoptions.md#optional-exclude)
* [file](mmir_tooling.implementationoptions.md#optional-file)
* [name](mmir_tooling.implementationoptions.md#name)
* [type](mmir_tooling.implementationoptions.md#optional-type)

## Properties

### `Optional` addModuleExport

• **addModuleExport**? : *boolean | string*

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