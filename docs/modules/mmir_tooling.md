> **[mmir-tooling 5.1.0](../README.md)**

[Globals](../README.md) / [mmir-tooling](mmir_tooling.md) /

# External module: mmir-tooling

`mmir-tooling` generates/compiles/builds _mmir_ resources, e.g.
grammars or state-models.

**`see`** [apply](mmir_tooling.md#apply)

## Index

### Interfaces

* [AppConfig](../interfaces/mmir_tooling.appconfig.md)
* [BuildAppConfig](../interfaces/mmir_tooling.buildappconfig.md)
* [BuildOptions](../interfaces/mmir_tooling.buildoptions.md)
* [ControllerOptions](../interfaces/mmir_tooling.controlleroptions.md)
* [GrammarBuildEntry](../interfaces/mmir_tooling.grammarbuildentry.md)
* [GrammarBuildOptions](../interfaces/mmir_tooling.grammarbuildoptions.md)
* [GrammarEntry](../interfaces/mmir_tooling.grammarentry.md)
* [GrammarOptions](../interfaces/mmir_tooling.grammaroptions.md)
* [HelperOptions](../interfaces/mmir_tooling.helperoptions.md)
* [ImplementationOptions](../interfaces/mmir_tooling.implementationoptions.md)
* [ModelOptions](../interfaces/mmir_tooling.modeloptions.md)
* [PluginOptions](../interfaces/mmir_tooling.pluginoptions.md)
* [ResourcesOptions](../interfaces/mmir_tooling.resourcesoptions.md)
* [RuntimeConfiguration](../interfaces/mmir_tooling.runtimeconfiguration.md)
* [SettingsEntryOptions](../interfaces/mmir_tooling.settingsentryoptions.md)
* [SettingsOptions](../interfaces/mmir_tooling.settingsoptions.md)
* [StateBuildOptions](../interfaces/mmir_tooling.statebuildoptions.md)
* [StateModelBuildEntry](../interfaces/mmir_tooling.statemodelbuildentry.md)
* [StateModelEntry](../interfaces/mmir_tooling.statemodelentry.md)
* [StateOptions](../interfaces/mmir_tooling.stateoptions.md)
* [ViewBuildEntry](../interfaces/mmir_tooling.viewbuildentry.md)
* [ViewBuildOptions](../interfaces/mmir_tooling.viewbuildoptions.md)
* [ViewOptions](../interfaces/mmir_tooling.viewoptions.md)

### Type aliases

* [ModuleConfig](mmir_tooling.md#moduleconfig)
* [ModuleConfigOptions](mmir_tooling.md#moduleconfigoptions)
* [ModuleId](mmir_tooling.md#moduleid)
* [ModulePaths](mmir_tooling.md#modulepaths)
* [PluginConfig](mmir_tooling.md#pluginconfig)
* [ResourceType](mmir_tooling.md#resourcetype)
* [ResourceTypeName](mmir_tooling.md#resourcetypename)
* [SettingsType](mmir_tooling.md#settingstype)

### Functions

* [apply](mmir_tooling.md#apply)

## Type aliases

###  ModuleConfig

Ƭ **ModuleConfig**: *object & object*

module configuration: analogous to config-entry in requirejs config-entries

___

###  ModuleConfigOptions

Ƭ **ModuleConfigOptions**: *object*

module configuration: analogous to config-entry in requirejs configuration

#### Type declaration:

* \[ **moduleId**: *string*\]: [ModuleConfig](mmir_tooling.md#moduleconfig)

___

###  ModuleId

Ƭ **ModuleId**: *string*

___

###  ModulePaths

Ƭ **ModulePaths**: *object*

maps module IDs to file paths:
if the path is not absolute, it will be resolved against the mmir-lib path, if it starts with "mmirf/",
otherwise against the rootPath.

#### Type declaration:

* \[ **moduleId**: *string*\]: string

___

###  PluginConfig

Ƭ **PluginConfig**: *object*

#### Type declaration:

* \[ **config**: *string*\]: any

___

###  ResourceType

Ƭ **ResourceType**: *"grammar" | "view" | "state"*

___

###  ResourceTypeName

Ƭ **ResourceTypeName**: *string*

a resource type; corresponds to field names in AppConfig

___

###  SettingsType

Ƭ **SettingsType**: *"configuration" | "dictionary" | "grammar" | "speech"*

## Functions

###  apply

▸ **apply**(`buildConfig`: [BuildAppConfig](../interfaces/mmir_tooling.buildappconfig.md)): *`Promise<Error[]>`*

compiles the _mmir_ resources:
configure/include/compile/generate _mmir_ resources (e.g. grammars, state-models)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buildConfig` | [BuildAppConfig](../interfaces/mmir_tooling.buildappconfig.md) | the _mmir_ build configuration  |

**Returns:** *`Promise<Error[]>`*

a promise that is resolved when compilation has completed.
         If errors ocurred during compilation, the promise is resolved
         with a list of errors.