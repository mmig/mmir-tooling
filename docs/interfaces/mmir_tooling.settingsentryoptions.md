[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md)

# Interface: SettingsEntryOptions

## Hierarchy

* **SettingsEntryOptions**

  ↳ [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md)

## Index

### Properties

* [exclude](mmir_tooling.settingsentryoptions.md#optional-exclude)
* [file](mmir_tooling.settingsentryoptions.md#optional-file)
* [fileType](mmir_tooling.settingsentryoptions.md#optional-filetype)
* [id](mmir_tooling.settingsentryoptions.md#optional-id)
* [include](mmir_tooling.settingsentryoptions.md#optional-include)
* [type](mmir_tooling.settingsentryoptions.md#optional-type)

## Properties

### `Optional` exclude

• **exclude**? : *boolean*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### `Optional` file

• **file**? : *string*

for explicitly specifying the settings-resource directly (e.g. instead or in addition of parsing `path` for settings resource files)

___

### `Optional` fileType

• **fileType**? : *"js" | "json"*

the settings-file-type _(should not be set manually)_:\
derived from the file-extension, either "json" or "js".

If .js file, it MUST be a CommonJS module that exports the settings object as its only/default export, i.e.\
```javascript
module.exports = settingsObject;
```
any dynamic code is evaluated at compile-time, i.e. the exported settings-object must not contain dynamic content

___

### `Optional` id

• **id**? : *string*

the ID for the settings-resources _(should not be set manually)_

___

### `Optional` include

• **include**? : *"inline" | "file"*

can be used to include the resource as separate file, instead of bundeling via webpack

**`default`** "inline"

___

### `Optional` type

• **type**? : *[SettingsType](../modules/mmir_tooling.md#settingstype)*

the settings-type _(should not be set manually)_
