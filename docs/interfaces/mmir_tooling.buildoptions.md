[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [BuildOptions](mmir_tooling.buildoptions.md)

# Interface: BuildOptions

## Hierarchy

* **BuildOptions**

  ↳ [GrammarBuildOptions](mmir_tooling.grammarbuildoptions.md)

  ↳ [GrammarBuildEntry](mmir_tooling.grammarbuildentry.md)

  ↳ [ViewBuildOptions](mmir_tooling.viewbuildoptions.md)

  ↳ [ViewBuildEntry](mmir_tooling.viewbuildentry.md)

  ↳ [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md)

  ↳ [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md)

  ↳ [StateBuildOptions](mmir_tooling.statebuildoptions.md)

  ↳ [StateModelBuildEntry](mmir_tooling.statemodelbuildentry.md)

## Index

### Properties

* [force](mmir_tooling.buildoptions.md#optional-force)
* [targetDir](mmir_tooling.buildoptions.md#optional-targetdir)

## Properties

### `Optional` force

• **force**? : *boolean*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### `Optional` targetDir

• **targetDir**? : *string*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#optional-targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)
