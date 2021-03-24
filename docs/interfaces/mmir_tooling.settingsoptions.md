**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / SettingsOptions

# Interface: SettingsOptions

**`example`** 
```
		var settingOptions = {
		 	path: path.resolve('./config'),
		 	configuration: false,
		 	grammar: {
		 		ja: {exclude: true}
		 	},
		 	speech: {
		 		de: {exclude: true},
		 		en: {include: 'file'}
		 	},
		 	dictionary: {
		 		ja: {include: 'file'}
		 	}
		 };
```

## Hierarchy

* **SettingsOptions**

  ↳ [SettingsBuildOptions](mmir_tooling.settingsbuildoptions.md)

## Index

### Properties

* [configuration](mmir_tooling.settingsoptions.md#configuration)
* [dictionary](mmir_tooling.settingsoptions.md#dictionary)
* [excludeTypePattern](mmir_tooling.settingsoptions.md#excludetypepattern)
* [grammar](mmir_tooling.settingsoptions.md#grammar)
* [include](mmir_tooling.settingsoptions.md#include)
* [path](mmir_tooling.settingsoptions.md#path)
* [speech](mmir_tooling.settingsoptions.md#speech)

## Properties

### configuration

• `Optional` **configuration**: boolean \| [SettingsEntryOptionsMultiple](mmir_tooling.settingsentryoptionsmultiple.md)

options for the configuration.json (or .js) entry; if FALSE, the resource will be ignored

___

### dictionary

• `Optional` **dictionary**: boolean \| { [id:string]: [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md);  }

options-map for the dictionary.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored

___

### excludeTypePattern

• `Optional` **excludeTypePattern**: RegExp \| Array<[SettingsType](../modules/mmir_tooling.md#settingstype)\>

pattern for excluding settings:
if pattern matches SettingsEntryOptions.type, the settings will be excluded

___

### grammar

• `Optional` **grammar**: boolean \| { [id:string]: [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md);  }

options-map for the grammar.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored

___

### include

• `Optional` **include**: \"inline\" \| \"file\"

can be used to include the resource as separate file, instead of bundeling via webpack

**`default`** "inline" if webpack build, otherwise "file"

___

### path

• `Optional` **path**: string

file path for searching settings:
```bash
path/.../<language ID>/grammar.[json | js]
                      /dictionary.[json | js]
                      /speech.[json | js]
configuration.[json | js]
```

___

### speech

• `Optional` **speech**: boolean \| { [id:string]: [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md);  }

options-map for the speech.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored
