> **[mmir-tooling 5.0.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [ModelOptions](mmir_tooling.modeloptions.md) /

# Interface: ModelOptions

**`example`** 
```
var modelOptions = {
	path: './implementations_all/models',
	models: {
		user: {addModuleExport: 'mmir.User'},
		calendarModel: {addModuleExport: 'mmir.CalendarModel'}
	}
};
```

## Hierarchy

* **ModelOptions**

## Index

### Properties

* [models](mmir_tooling.modeloptions.md#optional-models)
* [path](mmir_tooling.modeloptions.md#optional-path)

## Properties

### `Optional` models

• **models**? : *boolean | object*

___

### `Optional` path

• **path**? : *string*

file path for searching (data) model implementation files:
`path/<model ID>.js`