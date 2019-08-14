> **[mmir-tooling 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [HelperOptions](mmir_tooling.helperoptions.md) /

# Interface: HelperOptions

**`example`** 
```
var helperOptions = {
	path: './implementations_all/helpers',
	addModuleExport: true,
	helpers: {
		calendarHelper: {exclude: false}
	}
};
```

## Hierarchy

* **HelperOptions**

## Index

### Properties

* [helpers](mmir_tooling.helperoptions.md#optional-helpers)
* [path](mmir_tooling.helperoptions.md#optional-path)

## Properties

### `Optional` helpers

• **helpers**? : *boolean | object*

___

### `Optional` path

• **path**? : *string*

file path for (recursively) searching helper implementation files:
`path/.../<controller ID>Helper.js`