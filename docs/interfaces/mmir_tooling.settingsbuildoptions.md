**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / SettingsBuildOptions

# Interface: SettingsBuildOptions

## Hierarchy

* [SettingsOptions](mmir_tooling.settingsoptions.md)

* [BuildOptions](mmir_tooling.buildoptions.md)

  ↳ **SettingsBuildOptions**

## Index

### Properties

* [configuration](mmir_tooling.settingsbuildoptions.md#configuration)
* [dictionary](mmir_tooling.settingsbuildoptions.md#dictionary)
* [excludeTypePattern](mmir_tooling.settingsbuildoptions.md#excludetypepattern)
* [force](mmir_tooling.settingsbuildoptions.md#force)
* [grammar](mmir_tooling.settingsbuildoptions.md#grammar)
* [include](mmir_tooling.settingsbuildoptions.md#include)
* [path](mmir_tooling.settingsbuildoptions.md#path)
* [speech](mmir_tooling.settingsbuildoptions.md#speech)
* [targetDir](mmir_tooling.settingsbuildoptions.md#targetdir)

## Properties

### configuration

• `Optional` **configuration**: boolean \| [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md)

*Overrides [SettingsOptions](mmir_tooling.settingsoptions.md).[configuration](mmir_tooling.settingsoptions.md#configuration)*

**`override`** 

___

### dictionary

• `Optional` **dictionary**: boolean \| { [id:string]: [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md);  }

*Overrides [SettingsOptions](mmir_tooling.settingsoptions.md).[dictionary](mmir_tooling.settingsoptions.md#dictionary)*

**`override`** 

___

### excludeTypePattern

• `Optional` **excludeTypePattern**: RegExp \| Array<[SettingsType](../modules/mmir_tooling.md#settingstype)\>

*Inherited from [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md).[excludeTypePattern](mmir_tooling.settingsbuildoptions.md#excludetypepattern)*

pattern for excluding settings:
if pattern matches SettingsEntryOptions.type, the settings will be excluded

___

### force

• `Optional` **force**: boolean

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[force](mmir_tooling.buildoptions.md#force)*

if TRUE the targets will be newly created and written to the targetDir,
even if the existence or up-to-date check returns `true`

___

### grammar

• `Optional` **grammar**: boolean \| { [id:string]: [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md);  }

*Overrides [SettingsOptions](mmir_tooling.settingsoptions.md).[grammar](mmir_tooling.settingsoptions.md#grammar)*

**`override`** 

___

### include

• `Optional` **include**: \"inline\" \| \"file\"

*Inherited from [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md).[include](mmir_tooling.settingsbuildoptions.md#include)*

can be used to include the resource as separate file, instead of bundeling via webpack

**`default`** "inline" if webpack build, otherwise "file"

___

### path

• `Optional` **path**: string

*Inherited from [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md).[path](mmir_tooling.settingsbuildoptions.md#path)*

file path for searching settings:
```bash
path/.../<language ID>/grammar.[json | js]
                      /dictionary.[json | js]
                      /speech.[json | js]
configuration.[json | js]
```

___

### speech

• `Optional` **speech**: boolean \| { [id:string]: [SettingsBuildEntry](mmir_tooling.settingsbuildentry.md);  }

*Overrides [SettingsOptions](mmir_tooling.settingsoptions.md).[speech](mmir_tooling.settingsoptions.md#speech)*

**`override`** 

___

### targetDir

• `Optional` **targetDir**: string

*Inherited from [BuildOptions](mmir_tooling.buildoptions.md).[targetDir](mmir_tooling.buildoptions.md#targetdir)*

directory to which the compiled resources like grammars (and checksum files) will be stored

by default, the relative paths are resolved against the app's root directory;
if the target directory is missing it will be newly created.

**`default`** [BuildAppConfig.targetDir](mmir_tooling.buildappconfig.md#targetdir) + [ResourceType](../modules/mmir_tooling.md#resourcetype)
