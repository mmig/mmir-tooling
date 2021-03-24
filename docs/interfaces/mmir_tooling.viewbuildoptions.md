**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / ViewBuildOptions

# Interface: ViewBuildOptions

## Hierarchy

* [ViewOptions](mmir_tooling.viewoptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **ViewBuildOptions**

## Index

### Properties

* [force](mmir_tooling.viewbuildoptions.md#force)
* [path](mmir_tooling.viewbuildoptions.md#path)
* [strict](mmir_tooling.viewbuildoptions.md#strict)
* [targetDir](mmir_tooling.viewbuildoptions.md#targetdir)

## Properties

### force

• `Optional` **force**: boolean

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### path

• `Optional` **path**: string

*Inherited from [ViewBuildOptions](mmir_tooling.viewbuildoptions.md).[path](mmir_tooling.viewbuildoptions.md#path)*

file path for searching view files:
```bash
path/views/<controller ID>/*.ehtml
path/layouts/<controller ID>.ehtml
```

___

### strict

• `Optional` **strict**: boolean

*Inherited from [ViewBuildOptions](mmir_tooling.viewbuildoptions.md).[strict](mmir_tooling.viewbuildoptions.md#strict)*

set or disable strict-mode for generated JavaScript code

**`default`** true

___

### targetDir

• `Optional` **targetDir**: string

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)
