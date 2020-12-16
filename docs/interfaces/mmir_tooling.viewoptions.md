**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / ViewOptions

# Interface: ViewOptions

## Hierarchy

* **ViewOptions**

  ↳ [ViewBuildOptions](mmir_tooling.viewbuildoptions.md)

## Index

### Properties

* [path](mmir_tooling.viewoptions.md#path)
* [strict](mmir_tooling.viewoptions.md#strict)

## Properties

### path

• `Optional` **path**: string

file path for searching view files:
```bash
path/views/<controller ID>/*.ehtml
path/layouts/<controller ID>.ehtml
```

___

### strict

• `Optional` **strict**: boolean

set or disable strict-mode for generated JavaScript code

**`default`** true
