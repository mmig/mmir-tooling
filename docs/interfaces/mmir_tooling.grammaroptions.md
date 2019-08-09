> **[mmir-tooling 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / [GrammarOptions](mmir_tooling.grammaroptions.md) /

# Interface: GrammarOptions

**`example`** 
```
var grammarOptions = {
	path: './grammars',
	engine: 'pegjs',
	asyncCompile: false,
	grammars: {
		ja: {ignore: true},
		de: {exclude: true},
		en: {engine: 'jscc', asyncCompile: true},

		//specifying JSON grammar files directly
		testing: {engine: 'jscc', file: path.resolve('./grammar-test/en/grammar.json')},
		testing2: {id: '!id warning!', engine: 'jison', file: path.resolve('./grammar-test/de/grammar.json_large-example')}
	}
};
```

## Hierarchy

* **GrammarOptions**

  * [GrammarBuildOptions](mmir_tooling.grammarbuildoptions.md)

## Index

### Properties

* [grammars](mmir_tooling.grammaroptions.md#optional-grammars)
* [path](mmir_tooling.grammaroptions.md#optional-path)

## Properties

### `Optional` grammars

• **grammars**? : *object*

options for handling found or specified JSON grammars

#### Type declaration:

* \[ **grammarId**: *string*\]: [GrammarEntry](mmir_tooling.grammarentry.md)

___

### `Optional` path

• **path**? : *string*

file path for searching (recursively) JSON grammars within languages-subdirectory:
`path/.../<grammar ID>/grammar.json`