**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / SettingsBuildEntryMultiple

# Interface: SettingsBuildEntryMultiple

## Hierarchy

* [SettingsEntryOptionsMultiple](mmir_tooling.settingsentryoptionsmultiple.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **SettingsBuildEntryMultiple**

## Index

### Properties

* [exclude](mmir_tooling.settingsbuildentrymultiple.md#exclude)
* [file](mmir_tooling.settingsbuildentrymultiple.md#file)
* [fileType](mmir_tooling.settingsbuildentrymultiple.md#filetype)
* [force](mmir_tooling.settingsbuildentrymultiple.md#force)
* [id](mmir_tooling.settingsbuildentrymultiple.md#id)
* [include](mmir_tooling.settingsbuildentrymultiple.md#include)
* [targetDir](mmir_tooling.settingsbuildentrymultiple.md#targetdir)
* [type](mmir_tooling.settingsbuildentrymultiple.md#type)
* [value](mmir_tooling.settingsbuildentrymultiple.md#value)

## Properties

### exclude

• `Optional` **exclude**: boolean

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[exclude](mmir_tooling.settingsbuildentry.md#exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### file

• `Optional` **file**: string \| string[]

*Inherited from [SettingsBuildEntryMultiple](mmir_tooling.settingsbuildentrymultiple.md).[file](mmir_tooling.settingsbuildentrymultiple.md#file)*

for explicitly specifying the settings-resource directly (e.g. instead or in addition of parsing `path` for settings resource files)

___

### fileType

• `Optional` **fileType**: \"js\" \| \"json\"

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[fileType](mmir_tooling.settingsbuildentry.md#filetype)*

the settings-file-type _(should not be set manually)_:\
derived from the file-extension, either "json" or "js".

If .js file, it MUST be a CommonJS module that exports the settings object as its only/default export, i.e.\
```javascript
module.exports = settingsObject;
```
any dynamic code is evaluated at compile-time, i.e. the exported settings-object must not contain dynamic content

___

### force

• `Optional` **force**: boolean

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### id

• `Optional` **id**: string

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[id](mmir_tooling.settingsbuildentry.md#id)*

the ID for the settings-resources _(should not be set manually)_

___

### include

• `Optional` **include**: \"inline\" \| \"file\"

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[include](mmir_tooling.settingsbuildentry.md#include)*

can be used to include the resource as separate file, instead of bundeling via webpack

**`default`** "inline"

___

### targetDir

• `Optional` **targetDir**: string

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)

___

### type

• `Optional` **type**: [SettingsType](../modules/mmir_tooling.md#settingstype)

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[type](mmir_tooling.settingsbuildentry.md#type)*

the settings-type _(should not be set manually)_

___

### value

• `Optional` **value**: any
