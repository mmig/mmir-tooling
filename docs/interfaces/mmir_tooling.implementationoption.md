[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [ImplementationOption](mmir_tooling.implementationoption.md)

# Interface: ImplementationOption

## Hierarchy

* **ImplementationOption**

  ↳ [ControllerOptions](mmir_tooling.controlleroptions.md)

  ↳ [HelperOptions](mmir_tooling.helperoptions.md)

  ↳ [ModelOptions](mmir_tooling.modeloptions.md)

  ↳ [ImplementationEntry](mmir_tooling.implementationentry.md)

## Index

### Properties

* [addModuleExport](mmir_tooling.implementationoption.md#optional-addmoduleexport)
* [exclude](mmir_tooling.implementationoption.md#optional-exclude)

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