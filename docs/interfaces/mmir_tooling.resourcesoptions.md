**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / ResourcesOptions

# Interface: ResourcesOptions

options for handling found resources when parsing the resourcesPath

## Hierarchy

* **ResourcesOptions**

## Index

### Properties

* [addModuleExport](mmir_tooling.resourcesoptions.md#addmoduleexport)
* [config](mmir_tooling.resourcesoptions.md#config)
* [controllers](mmir_tooling.resourcesoptions.md#controllers)
* [exclude](mmir_tooling.resourcesoptions.md#exclude)
* [helpers](mmir_tooling.resourcesoptions.md#helpers)
* [models](mmir_tooling.resourcesoptions.md#models)
* [views](mmir_tooling.resourcesoptions.md#views)

## Properties

### addModuleExport

• `Optional` **addModuleExport**: boolean

for automatically converting old-style implementations that are no CommonJS or AMD modules:
if `true`, explicitly exports the implementation resource (i.e. as module.exports)

**`see`** ImplementationEntry

___

### config

• `Optional` **config**: false

exclude mmir resource directory `config` from parsing for settings

___

### controllers

• `Optional` **controllers**: false

exclude mmir resource directory `controllers` from parsing for settings

___

### exclude

• `Optional` **exclude**: Array<[ResourceTypeName](../modules/mmir_tooling.md#resourcetypename)\>

excludes the specified resources types when parsing the `resourcesPath`

___

### helpers

• `Optional` **helpers**: false

exclude mmir resource directory `helpers` from parsing for settings

___

### models

• `Optional` **models**: false

exclude mmir resource directory `models` from parsing for settings

___

### views

• `Optional` **views**: false

exclude mmir resource directory `views` from parsing for settings
