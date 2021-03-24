**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / ImplementationOption

# Interface: ImplementationOption

## Hierarchy

* **ImplementationOption**

  ↳ [ControllerOptions](mmir_tooling.controlleroptions.md)

  ↳ [HelperOptions](mmir_tooling.helperoptions.md)

  ↳ [ModelOptions](mmir_tooling.modeloptions.md)

  ↳ [ImplementationEntry](mmir_tooling.implementationentry.md)

## Index

### Properties

* [addModuleExport](mmir_tooling.implementationoption.md#addmoduleexport)
* [exclude](mmir_tooling.implementationoption.md#exclude)

## Properties

### addModuleExport

• `Optional` **addModuleExport**: boolean \| string

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

if `true`, the corresponding implementation will be excluded (when parsing `path`)
