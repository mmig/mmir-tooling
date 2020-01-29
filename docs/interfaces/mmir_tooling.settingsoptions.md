[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [SettingsOptions](mmir_tooling.settingsoptions.md)

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

* [configuration](mmir_tooling.settingsoptions.md#optional-configuration)
* [dictionary](mmir_tooling.settingsoptions.md#optional-dictionary)
* [excludeTypePattern](mmir_tooling.settingsoptions.md#optional-excludetypepattern)
* [grammar](mmir_tooling.settingsoptions.md#optional-grammar)
* [path](mmir_tooling.settingsoptions.md#optional-path)
* [speech](mmir_tooling.settingsoptions.md#optional-speech)

## Properties

### `Optional` configuration

• **configuration**? : *boolean | [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md)*

options for the configuration.json (or .js) entry; if FALSE, the resource will be ignored

___

### `Optional` dictionary

• **dictionary**? : *boolean | object*

options-map for the dictionary.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored

___

### `Optional` excludeTypePattern

• **excludeTypePattern**? : *RegExp | Array‹[SettingsType](../modules/mmir_tooling.md#settingstype)›*

pattern for excluding settings:
if pattern matches SettingsEntryOptions.type, the settings will be excluded

___

### `Optional` grammar

• **grammar**? : *boolean | object*

options-map for the grammar.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored

___

### `Optional` path

• **path**? : *string*

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

options-map for the speech.json (or .js) entries where id is (usually) the language code; if `false`, these resources will be ignored
