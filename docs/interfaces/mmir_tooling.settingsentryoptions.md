> **[mmir-tooling 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md) /

# Interface: SettingsEntryOptions

## Hierarchy

* **SettingsEntryOptions**

## Index

### Properties

* [exclude](mmir_tooling.settingsentryoptions.md#optional-exclude)
* [file](mmir_tooling.settingsentryoptions.md#optional-file)
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

### `Optional` id

• **id**? : *string*

the ID for the settings-resources (should not be set manually)

___

### `Optional` include

• **include**? : *"inline" | "file"*

can be used to include the resource as separate file, instead of bundeling via webpack

**`default`** "inline"

___

### `Optional` type

• **type**? : *[SettingsType](../modules/mmir_tooling.md#settingstype)*

the settings-type (should not be set manually)