**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / SettingsEntryOptionsMultiple

# Interface: SettingsEntryOptionsMultiple

## Hierarchy

* [SettingsEntryOptionsBase](mmir_tooling.settingsentryoptionsbase.md)

  ↳ **SettingsEntryOptionsMultiple**

  ↳↳ [SettingsBuildEntryMultiple](mmir_tooling.settingsbuildentrymultiple.md)

## Index

### Properties

* [exclude](mmir_tooling.settingsentryoptionsmultiple.md#exclude)
* [file](mmir_tooling.settingsentryoptionsmultiple.md#file)
* [fileType](mmir_tooling.settingsentryoptionsmultiple.md#filetype)
* [id](mmir_tooling.settingsentryoptionsmultiple.md#id)
* [include](mmir_tooling.settingsentryoptionsmultiple.md#include)
* [type](mmir_tooling.settingsentryoptionsmultiple.md#type)

## Properties

### exclude

• `Optional` **exclude**: boolean

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[exclude](mmir_tooling.settingsbuildentry.md#exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### file

• `Optional` **file**: string \| string[]

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

### type

• `Optional` **type**: [SettingsType](../modules/mmir_tooling.md#settingstype)

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[type](mmir_tooling.settingsbuildentry.md#type)*

the settings-type _(should not be set manually)_
