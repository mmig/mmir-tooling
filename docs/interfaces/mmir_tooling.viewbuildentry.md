**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / ViewBuildEntry

# Interface: ViewBuildEntry

## Hierarchy

* [ViewEntry](mmir_tooling.viewentry.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **ViewBuildEntry**

## Index

### Properties

* [ctrlName](mmir_tooling.viewbuildentry.md#ctrlname)
* [file](mmir_tooling.viewbuildentry.md#file)
* [force](mmir_tooling.viewbuildentry.md#force)
* [id](mmir_tooling.viewbuildentry.md#id)
* [isLayout](mmir_tooling.viewbuildentry.md#islayout)
* [isPartial](mmir_tooling.viewbuildentry.md#ispartial)
* [strict](mmir_tooling.viewbuildentry.md#strict)
* [targetDir](mmir_tooling.viewbuildentry.md#targetdir)
* [viewImpl](mmir_tooling.viewbuildentry.md#viewimpl)
* [viewName](mmir_tooling.viewbuildentry.md#viewname)

## Properties

### ctrlName

•  **ctrlName**: string

*Inherited from [ViewBuildEntry](mmir_tooling.viewbuildentry.md).[ctrlName](mmir_tooling.viewbuildentry.md#ctrlname)*

___

### file

•  **file**: string

*Inherited from [ViewBuildEntry](mmir_tooling.viewbuildentry.md).[file](mmir_tooling.viewbuildentry.md#file)*

___

### force

• `Optional` **force**: boolean

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### id

•  **id**: string

*Inherited from [ViewBuildEntry](mmir_tooling.viewbuildentry.md).[id](mmir_tooling.viewbuildentry.md#id)*

___

### isLayout

•  **isLayout**: boolean

*Inherited from [ViewBuildEntry](mmir_tooling.viewbuildentry.md).[isLayout](mmir_tooling.viewbuildentry.md#islayout)*

___

### isPartial

•  **isPartial**: boolean

*Inherited from [ViewBuildEntry](mmir_tooling.viewbuildentry.md).[isPartial](mmir_tooling.viewbuildentry.md#ispartial)*

___

### strict

•  **strict**: boolean

*Inherited from [ViewBuildEntry](mmir_tooling.viewbuildentry.md).[strict](mmir_tooling.viewbuildentry.md#strict)*

___

### targetDir

• `Optional` **targetDir**: string

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)

___

### viewImpl

•  **viewImpl**: \"mmirf/layout\" \| \"mmirf/partial\" \| \"mmirf/view\"

*Inherited from [ViewBuildEntry](mmir_tooling.viewbuildentry.md).[viewImpl](mmir_tooling.viewbuildentry.md#viewimpl)*

___

### viewName

•  **viewName**: string

*Inherited from [ViewBuildEntry](mmir_tooling.viewbuildentry.md).[viewName](mmir_tooling.viewbuildentry.md#viewname)*
