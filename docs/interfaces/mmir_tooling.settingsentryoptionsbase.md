**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / SettingsEntryOptionsBase

# Interface: SettingsEntryOptionsBase

## Hierarchy

* **SettingsEntryOptionsBase**

  ↳ [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md)

  ↳ [SettingsEntryOptionsMultiple](mmir_tooling.settingsentryoptionsmultiple.md)

## Index

### Properties

* [exclude](mmir_tooling.settingsentryoptionsbase.md#exclude)
* [fileType](mmir_tooling.settingsentryoptionsbase.md#filetype)
* [id](mmir_tooling.settingsentryoptionsbase.md#id)
* [include](mmir_tooling.settingsentryoptionsbase.md#include)
* [type](mmir_tooling.settingsentryoptionsbase.md#type)

## Properties

### exclude

• `Optional` **exclude**: boolean

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### fileType

• `Optional` **fileType**: \"js\" \| \"json\"

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

the ID for the settings-resources _(should not be set manually)_

___

### include

• `Optional` **include**: \"inline\" \| \"file\"

can be used to include the resource as separate file, instead of bundeling via webpack

**`default`** "inline"

___

### type

• `Optional` **type**: [SettingsType](../modules/mmir_tooling.md#settingstype)

the settings-type _(should not be set manually)_
