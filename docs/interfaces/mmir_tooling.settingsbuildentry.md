[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md)

# Interface: SettingsBuildEntry

## Hierarchy

* [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **SettingsBuildEntry**

## Index

### Properties

* [exclude](mmir_tooling.settingsbuildentry.md#optional-exclude)
* [file](mmir_tooling.settingsbuildentry.md#optional-file)
* [fileType](mmir_tooling.settingsbuildentry.md#optional-filetype)
* [force](mmir_tooling.settingsbuildentry.md#optional-force)
* [id](mmir_tooling.settingsbuildentry.md#optional-id)
* [include](mmir_tooling.settingsbuildentry.md#optional-include)
* [targetDir](mmir_tooling.settingsbuildentry.md#optional-targetdir)
* [type](mmir_tooling.settingsbuildentry.md#optional-type)

## Properties

### `Optional` exclude

• **exclude**? : *boolean*

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[exclude](mmir_tooling.settingsbuildentry.md#optional-exclude)*

if `true`, the corresponding resource will be excluded (when parsing `path`)

___

### `Optional` file

• **file**? : *string*

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[file](mmir_tooling.settingsbuildentry.md#optional-file)*

for explicitly specifying the settings-resource directly (e.g. instead or in addition of parsing `path` for settings resource files)

___

### `Optional` fileType

• **fileType**? : *"js" | "json"*

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[fileType](mmir_tooling.settingsbuildentry.md#optional-filetype)*

the settings-file-type _(should not be set manually)_:\
derived from the file-extension, either "json" or "js".

If .js file, it MUST be a CommonJS module that exports the settings object as its only/default export, i.e.\
```javascript
module.exports = settingsObject;
```
any dynamic code is evaluated at compile-time, i.e. the exported settings-object must not contain dynamic content

___

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### `Optional` id

• **id**? : *string*

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[id](mmir_tooling.settingsbuildentry.md#optional-id)*

the ID for the settings-resources _(should not be set manually)_

___

### `Optional` include

• **include**? : *"inline" | "file"*

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[include](mmir_tooling.settingsbuildentry.md#optional-include)*

can be used to include the resource as separate file, instead of bundeling via webpack

**`default`** "inline"

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

• **type**? : *[SettingsType](../modules/mmir_tooling.md#settingstype)*

*Inherited from [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md).[type](mmir_tooling.settingsbuildentry.md#optional-type)*

the settings-type _(should not be set manually)_
