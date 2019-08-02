> **[mmir-tooling 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [ViewBuildEntry](mmir_tooling.viewbuildentry.md) /

# Interface: ViewBuildEntry

## Hierarchy

* [ImplementationOptions](mmir_tooling.implementationoptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  * **ViewBuildEntry**

## Index

### Properties

* [addModuleExport](mmir_tooling.viewbuildentry.md#optional-addmoduleexport)
* [exclude](mmir_tooling.viewbuildentry.md#optional-exclude)
* [file](mmir_tooling.viewbuildentry.md#optional-file)
* [force](mmir_tooling.viewbuildentry.md#optional-force)
* [name](mmir_tooling.viewbuildentry.md#name)
* [targetDir](mmir_tooling.viewbuildentry.md#optional-targetdir)
* [type](mmir_tooling.viewbuildentry.md#optional-type)

## Properties

### `Optional` addModuleExport

• **addModuleExport**? : *boolean | string*

*Inherited from [ImplementationOptions](mmir_tooling.implementationoptions.md).[addModuleExport](mmir_tooling.implementationoptions.md#optional-addmoduleexport)*

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

*Inherited from [ImplementationOptions](mmir_tooling.implementationoptions.md).[exclude](mmir_tooling.implementationoptions.md#optional-exclude)*

if `true`, the corresponding implementation will be excluded (when parsing `path`)

___

### `Optional` file

• **file**? : *string*

*Inherited from [ImplementationOptions](mmir_tooling.implementationoptions.md).[file](mmir_tooling.implementationoptions.md#optional-file)*

for explicitly specifying the implementation-file directly (e.g. instead or in addition of parsing `path`)

___

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the grammar(s) will be newly created and written to the targetDir,
even if the up-to-date check returns `true`

___

###  name

• **name**: *string*

*Inherited from [ImplementationOptions](mmir_tooling.implementationoptions.md).[name](mmir_tooling.implementationoptions.md#name)*

the implementation's name (usually the ID with capitalized first letter)

___

### `Optional` targetDir

• **targetDir**? : *string*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#optional-targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#optional-targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)

___

### `Optional` type

• **type**? : *"controller" | "helper" | "model"*

*Inherited from [ImplementationOptions](mmir_tooling.implementationoptions.md).[type](mmir_tooling.implementationoptions.md#optional-type)*

the implementation's type (should not be explicitly specified)