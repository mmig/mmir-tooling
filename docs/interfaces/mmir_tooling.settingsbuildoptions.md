[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md)

# Interface: SettingsBuildOptions

## Hierarchy

* [SettingsOptions](mmir_tooling.settingsoptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **SettingsBuildOptions**

## Index

### Properties

* [configuration](mmir_tooling.settingsbuildoptions.md#optional-configuration)
* [dictionary](mmir_tooling.settingsbuildoptions.md#optional-dictionary)
* [excludeTypePattern](mmir_tooling.settingsbuildoptions.md#optional-excludetypepattern)
* [force](mmir_tooling.settingsbuildoptions.md#optional-force)
* [grammar](mmir_tooling.settingsbuildoptions.md#optional-grammar)
* [path](mmir_tooling.settingsbuildoptions.md#optional-path)
* [speech](mmir_tooling.settingsbuildoptions.md#optional-speech)
* [targetDir](mmir_tooling.settingsbuildoptions.md#optional-targetdir)

## Properties

### `Optional` configuration

• **configuration**? : *boolean | [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md)*

*Overrides [SettingsOptions](mmir_tooling.settingsoptions.md).[configuration](mmir_tooling.settingsoptions.md#optional-configuration)*

**`override`** 

___

### `Optional` dictionary

• **dictionary**? : *boolean | object*

*Overrides [SettingsOptions](mmir_tooling.settingsoptions.md).[dictionary](mmir_tooling.settingsoptions.md#optional-dictionary)*

**`override`** 

___

### `Optional` excludeTypePattern

• **excludeTypePattern**? : *RegExp | Array‹[SettingsType](../modules/mmir_tooling.md#settingstype)›*

*Inherited from [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md).[excludeTypePattern](mmir_tooling.settingsbuildoptions.md#optional-excludetypepattern)*

pattern for excluding settings:
if pattern matches SettingsEntryOptions.type, the settings will be excluded

___

### `Optional` force

• **force**? : *boolean*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#optional-force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### `Optional` grammar

• **grammar**? : *boolean | object*

*Overrides [SettingsOptions](mmir_tooling.settingsoptions.md).[grammar](mmir_tooling.settingsoptions.md#optional-grammar)*

**`override`** 

___

### `Optional` path

• **path**? : *string*

*Inherited from [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md).[path](mmir_tooling.settingsbuildoptions.md#optional-path)*

file path for searching settings:
```bash
path/.../<language ID>/grammar.[json | js]
                      /dictionary.[json | js]
                      /speech.[json | js]
configuration.[json | js]
```

___

### `Optional` speech

• **speech**? : *boolean | object*

*Overrides [SettingsOptions](mmir_tooling.settingsoptions.md).[speech](mmir_tooling.settingsoptions.md#optional-speech)*

**`override`** 

___

### `Optional` targetDir

• **targetDir**? : *string*

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#optional-targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#optional-targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)
