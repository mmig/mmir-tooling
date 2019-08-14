> **[mmir-tooling 5.2.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [ControllerOptions](mmir_tooling.controlleroptions.md) /

# Interface: ControllerOptions

**`example`** 
```
var ctrlOptions = {
	path: './implementations_all/controllers',
	controllers: {
		application: {
			addModuleExport: true
		},
		calendar: {
			file: path.resolve('./implementations/controllers/calendar.js')
		},
		application2: false,
		application3: {exclude: true},
	}
};
```

## Hierarchy

* **ControllerOptions**

## Index

### Properties

* [controllers](mmir_tooling.controlleroptions.md#optional-controllers)
* [path](mmir_tooling.controlleroptions.md#optional-path)

## Properties

### `Optional` controllers

• **controllers**? : *boolean | object*

___

### `Optional` path

• **path**? : *string*

file path for (recursively) searching controller implementation files:
`path/<controller ID>.js`