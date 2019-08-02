> **[mmir-tooling 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [SettingsOptions](mmir_tooling.settingsoptions.md) /

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

## Index

### Properties

* [configuration](mmir_tooling.settingsoptions.md#optional-configuration)
* [dictionary](mmir_tooling.settingsoptions.md#optional-dictionary)
* [grammar](mmir_tooling.settingsoptions.md#optional-grammar)
* [path](mmir_tooling.settingsoptions.md#optional-path)
* [speech](mmir_tooling.settingsoptions.md#optional-speech)

## Properties

### `Optional` configuration

• **configuration**? : *boolean | [SettingsEntryOptions](mmir_tooling.settingsentryoptions.md)*

options for the configuration.json entry; if FALSE, the resource will be ignored

___

### `Optional` dictionary

• **dictionary**? : *boolean | object*

options-map for the dictionary.json entries where id is (usually) the language code; if `false`, these resources will be ignored

___

### `Optional` grammar

• **grammar**? : *boolean | object*

options-map for the grammar.json entries where id is (usually) the language code; if `false`, these resources will be ignored

___

### `Optional` path

• **path**? : *string*

file path for searching settings:
```bash
path/.../<language ID>/grammar.json
                      /dictionary.json
                      /speech.json
configuration.json
```

___

### `Optional` speech

• **speech**? : *boolean | object*

options-map for the speech.json entries where id is (usually) the language code; if `false`, these resources will be ignored