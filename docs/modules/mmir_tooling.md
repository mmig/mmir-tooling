**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / mmir-tooling

# Module: mmir-tooling

## Index

### References

* [WebpackAppConfig](mmir_tooling.md#webpackappconfig)

### Interfaces

* [AppConfig](../interfaces/mmir_tooling.appconfig.md)
* [BuildAppConfig](../interfaces/mmir_tooling.buildappconfig.md)
* [BuildOptions](../interfaces/mmir_tooling.buildoptions.md)
* [CompilerCallback](../interfaces/mmir_tooling.compilercallback.md)
* [ControllerOptions](../interfaces/mmir_tooling.controlleroptions.md)
* [DirectoriesInfo](../interfaces/mmir_tooling.directoriesinfo.md)
* [GrammarBuildEntry](../interfaces/mmir_tooling.grammarbuildentry.md)
* [GrammarBuildOptions](../interfaces/mmir_tooling.grammarbuildoptions.md)
* [GrammarCompilerOptions](../interfaces/mmir_tooling.grammarcompileroptions.md)
* [GrammarEntry](../interfaces/mmir_tooling.grammarentry.md)
* [GrammarOption](../interfaces/mmir_tooling.grammaroption.md)
* [GrammarOptions](../interfaces/mmir_tooling.grammaroptions.md)
* [HelperOptions](../interfaces/mmir_tooling.helperoptions.md)
* [ImplementationBuildEntry](../interfaces/mmir_tooling.implementationbuildentry.md)
* [ImplementationCompilerOptions](../interfaces/mmir_tooling.implementationcompileroptions.md)
* [ImplementationEntry](../interfaces/mmir_tooling.implementationentry.md)
* [ImplementationOption](../interfaces/mmir_tooling.implementationoption.md)
* [ModelOptions](../interfaces/mmir_tooling.modeloptions.md)
* [PluginExportConfigInfo](../interfaces/mmir_tooling.pluginexportconfiginfo.md)
* [PluginExportConfigInfoMultiple](../interfaces/mmir_tooling.pluginexportconfiginfomultiple.md)
* [PluginOptions](../interfaces/mmir_tooling.pluginoptions.md)
* [ResourceConfig](../interfaces/mmir_tooling.resourceconfig.md)
* [ResourcesOptions](../interfaces/mmir_tooling.resourcesoptions.md)
* [RuntimeConfiguration](../interfaces/mmir_tooling.runtimeconfiguration.md)
* [SettingsBuildEntry](../interfaces/mmir_tooling.settingsbuildentry.md)
* [SettingsBuildEntryMultiple](../interfaces/mmir_tooling.settingsbuildentrymultiple.md)
* [SettingsBuildOptions](../interfaces/mmir_tooling.settingsbuildoptions.md)
* [SettingsEntryOptions](../interfaces/mmir_tooling.settingsentryoptions.md)
* [SettingsEntryOptionsBase](../interfaces/mmir_tooling.settingsentryoptionsbase.md)
* [SettingsEntryOptionsMultiple](../interfaces/mmir_tooling.settingsentryoptionsmultiple.md)
* [SettingsOptions](../interfaces/mmir_tooling.settingsoptions.md)
* [StateBuildOptions](../interfaces/mmir_tooling.statebuildoptions.md)
* [StateCompilerOptions](../interfaces/mmir_tooling.statecompileroptions.md)
* [StateModelBuildEntry](../interfaces/mmir_tooling.statemodelbuildentry.md)
* [StateModelEntry](../interfaces/mmir_tooling.statemodelentry.md)
* [StateModelOption](../interfaces/mmir_tooling.statemodeloption.md)
* [StateModelsBuildOption](../interfaces/mmir_tooling.statemodelsbuildoption.md)
* [StateModelsOption](../interfaces/mmir_tooling.statemodelsoption.md)
* [StateOptions](../interfaces/mmir_tooling.stateoptions.md)
* [TTSPluginSpeechConfig](../interfaces/mmir_tooling.ttspluginspeechconfig.md)
* [ViewBuildEntry](../interfaces/mmir_tooling.viewbuildentry.md)
* [ViewBuildOptions](../interfaces/mmir_tooling.viewbuildoptions.md)
* [ViewCompilerOptions](../interfaces/mmir_tooling.viewcompileroptions.md)
* [ViewEntry](../interfaces/mmir_tooling.viewentry.md)
* [ViewOptions](../interfaces/mmir_tooling.viewoptions.md)
* [VirtualImplementationEntry](../interfaces/mmir_tooling.virtualimplementationentry.md)

### Type aliases

* [AnyImplementationOptions](mmir_tooling.md#anyimplementationoptions)
* [AsyncGramarExecEntry](mmir_tooling.md#asyncgramarexecentry)
* [BuildConfig](mmir_tooling.md#buildconfig)
* [ImplementationType](mmir_tooling.md#implementationtype)
* [MediaManagerPluginsConfig](mmir_tooling.md#mediamanagerpluginsconfig)
* [ModuleConfig](mmir_tooling.md#moduleconfig)
* [ModuleConfigOptions](mmir_tooling.md#moduleconfigoptions)
* [ModuleId](mmir_tooling.md#moduleid)
* [ModulePaths](mmir_tooling.md#modulepaths)
* [PluginConfig](mmir_tooling.md#pluginconfig)
* [PluginExportBuildConfig](mmir_tooling.md#pluginexportbuildconfig)
* [PluginExportInfo](mmir_tooling.md#pluginexportinfo)
* [PluginExportModeEntry](mmir_tooling.md#pluginexportmodeentry)
* [PluginExportType](mmir_tooling.md#pluginexporttype)
* [PluginModeOption](mmir_tooling.md#pluginmodeoption)
* [ResourceType](mmir_tooling.md#resourcetype)
* [ResourceTypeName](mmir_tooling.md#resourcetypename)
* [SettingsType](mmir_tooling.md#settingstype)
* [SpeechConfigField](mmir_tooling.md#speechconfigfield)
* [StateModelMode](mmir_tooling.md#statemodelmode)

### Functions

* [apply](mmir_tooling.md#apply)

## References

### WebpackAppConfig

Re-exports: [WebpackAppConfig](../interfaces/mmir_webpack.webpackappconfig.md)

## Type aliases

### AnyImplementationOptions

Ƭ  **AnyImplementationOptions**: [ModelOptions](../interfaces/mmir_tooling.modeloptions.md) \| [HelperOptions](../interfaces/mmir_tooling.helperoptions.md) \| [ControllerOptions](../interfaces/mmir_tooling.controlleroptions.md)

___

### AsyncGramarExecEntry

Ƭ  **AsyncGramarExecEntry**: { id: string ; phrase: string  }

#### Type declaration:

Name | Type |
------ | ------ |
`id` | string |
`phrase` | string |

___

### BuildConfig

Ƭ  **BuildConfig**: { ctrlOptions: [ControllerOptions](../interfaces/mmir_tooling.controlleroptions.md) ; directories: [DirectoriesInfo](../interfaces/mmir_tooling.directoriesinfo.md) ; directoriesTargetDir?: string ; grammarOptions: [GrammarBuildOptions](../interfaces/mmir_tooling.grammarbuildoptions.md) ; grammars: [GrammarBuildEntry](../interfaces/mmir_tooling.grammarbuildentry.md)[] ; helperOptions: [HelperOptions](../interfaces/mmir_tooling.helperoptions.md) ; implList: [ImplementationBuildEntry](../interfaces/mmir_tooling.implementationbuildentry.md)[] ; modelOptions: [ModelOptions](../interfaces/mmir_tooling.modeloptions.md) ; settings: [SettingsBuildEntry](../interfaces/mmir_tooling.settingsbuildentry.md)[] ; settingsOptions: [SettingsBuildOptions](../interfaces/mmir_tooling.settingsbuildoptions.md) ; stateOptions: [StateBuildOptions](../interfaces/mmir_tooling.statebuildoptions.md) ; states: [StateModelBuildEntry](../interfaces/mmir_tooling.statemodelbuildentry.md)[] ; viewOptions: [ViewBuildOptions](../interfaces/mmir_tooling.viewbuildoptions.md) ; views: [ViewBuildEntry](../interfaces/mmir_tooling.viewbuildentry.md)[]  }

#### Type declaration:

Name | Type |
------ | ------ |
`ctrlOptions` | [ControllerOptions](../interfaces/mmir_tooling.controlleroptions.md) |
`directories` | [DirectoriesInfo](../interfaces/mmir_tooling.directoriesinfo.md) |
`directoriesTargetDir?` | string |
`grammarOptions` | [GrammarBuildOptions](../interfaces/mmir_tooling.grammarbuildoptions.md) |
`grammars` | [GrammarBuildEntry](../interfaces/mmir_tooling.grammarbuildentry.md)[] |
`helperOptions` | [HelperOptions](../interfaces/mmir_tooling.helperoptions.md) |
`implList` | [ImplementationBuildEntry](../interfaces/mmir_tooling.implementationbuildentry.md)[] |
`modelOptions` | [ModelOptions](../interfaces/mmir_tooling.modeloptions.md) |
`settings` | [SettingsBuildEntry](../interfaces/mmir_tooling.settingsbuildentry.md)[] |
`settingsOptions` | [SettingsBuildOptions](../interfaces/mmir_tooling.settingsbuildoptions.md) |
`stateOptions` | [StateBuildOptions](../interfaces/mmir_tooling.statebuildoptions.md) |
`states` | [StateModelBuildEntry](../interfaces/mmir_tooling.statemodelbuildentry.md)[] |
`viewOptions` | [ViewBuildOptions](../interfaces/mmir_tooling.viewbuildoptions.md) |
`views` | [ViewBuildEntry](../interfaces/mmir_tooling.viewbuildentry.md)[] |

___

### ImplementationType

Ƭ  **ImplementationType**: \"controller\" \| \"helper\" \| \"model\"

___

### MediaManagerPluginsConfig

Ƭ  **MediaManagerPluginsConfig**: { plugins?: { [env:string]: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\>; android?: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\> ; browser?: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\> ; cordova?: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\> ; ios?: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\>  }  }

#### Type declaration:

Name | Type |
------ | ------ |
`plugins?` | { [env:string]: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\>; android?: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\> ; browser?: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\> ; cordova?: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\> ; ios?: Array<[MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md)\>  } |

___

### ModuleConfig

Ƭ  **ModuleConfig**: { [configName:string]: any;  } & { logLevel?: mmir.LogLevelNum \| mmir.LogLevel  }

module configuration: analogous to config-entry in requirejs config-entries

___

### ModuleConfigOptions

Ƭ  **ModuleConfigOptions**: { [moduleId:string]: [ModuleConfig](mmir_tooling.md#moduleconfig);  }

module configuration: analogous to config-entry in requirejs configuration

___

### ModuleId

Ƭ  **ModuleId**: string

___

### ModulePaths

Ƭ  **ModulePaths**: { [moduleId:string]: string;  }

maps module IDs to file paths:
if the path is not absolute, it will be resolved against the mmir-lib path, if it starts with "mmirf/",
otherwise against the rootPath.

___

### PluginConfig

Ƭ  **PluginConfig**: [MediaManagerPluginEntry](../interfaces/mmir_lib.mediamanagerpluginentry.md) & { [config:string]: any;  }

___

### PluginExportBuildConfig

Ƭ  **PluginExportBuildConfig**: { [appBuildConfigField:string]: any;  }

configuration fields of AppConfig / BuildAppConfig / WebpackAppConfig  that a plugin can use to specify additional build configurations

___

### PluginExportInfo

Ƭ  **PluginExportInfo**: { buildConfig?: [PluginExportBuildConfig](mmir_tooling.md#pluginexportbuildconfig) ; dependencies: string[] ; files: string[] ; getBuildConfig?: (buildConfigsMap?: { [buildConfig:string]: boolean;  }) => [PluginExportBuildConfig](mmir_tooling.md#pluginexportbuildconfig)[] ; id: string ; modes?: { [pluginModeOption:string]: [PluginExportModeEntry](mmir_tooling.md#pluginexportmodeentry);  } ; modules: string[] ; paths: { [moduleId:string]: string;  } ; workers: string[] ; getAll: (type: [PluginExportType](mmir_tooling.md#pluginexporttype), mode?: [PluginModeOption](mmir_tooling.md#pluginmodeoption) \| string, isResolve?: boolean) => string[] \| { [moduleId:string]: string;  } \| { [pluginModeOption:string]: [PluginExportModeEntry](mmir_tooling.md#pluginexportmodeentry);  }  }

#### Type declaration:

Name | Type | Description |
------ | ------ | ------ |
`buildConfig?` | [PluginExportBuildConfig](mmir_tooling.md#pluginexportbuildconfig) | - |
`dependencies` | string[] | - |
`files` | string[] | - |
`getBuildConfig?` | (buildConfigsMap?: { [buildConfig:string]: boolean;  }) => [PluginExportBuildConfig](mmir_tooling.md#pluginexportbuildconfig)[] | HELPER returns list of (mmir) build configurations (to be merged into the main mmir build configuration)  **`param`** OPTIONAL a map for already included buildConfigs: {[buildConfig: BuildConfig]: Boolean}  **`returns`** a list of (mmir) build configurations; may be empty  |
`id` | string | - |
`modes?` | { [pluginModeOption:string]: [PluginExportModeEntry](mmir_tooling.md#pluginexportmodeentry);  } | - |
`modules` | string[] | - |
`paths` | { [moduleId:string]: string;  } | - |
`workers` | string[] | - |
`getAll` | (type: [PluginExportType](mmir_tooling.md#pluginexporttype), mode?: [PluginModeOption](mmir_tooling.md#pluginmodeoption) \| string, isResolve?: boolean) => string[] \| { [moduleId:string]: string;  } \| { [pluginModeOption:string]: [PluginExportModeEntry](mmir_tooling.md#pluginexportmodeentry);  } | - |

___

### PluginExportModeEntry

Ƭ  **PluginExportModeEntry**: { [modulePathOverrideId:string]: string;  } & { files?: string[]  }

___

### PluginExportType

Ƭ  **PluginExportType**: \"paths\" \| \"workers\" \| \"modules\" \| \"dependencies\" \| \"files\"

___

### PluginModeOption

Ƭ  **PluginModeOption**: \"wasm\" \| \"min\" \| \"default\"

___

### ResourceType

Ƭ  **ResourceType**: \"grammar\" \| \"view\" \| \"state\"

___

### ResourceTypeName

Ƭ  **ResourceTypeName**: string

a resource type; corresponds to field names in AppConfig

___

### SettingsType

Ƭ  **SettingsType**: \"configuration\" \| \"dictionary\" \| \"grammar\" \| \"speech\" \| \"speech-all\"

___

### SpeechConfigField

Ƭ  **SpeechConfigField**: \"language\" \| \"voice\"

___

### StateModelMode

Ƭ  **StateModelMode**: \"extended\" \| \"simple\"

## Functions

### apply

▸ **apply**(`buildConfig`: [BuildAppConfig](../interfaces/mmir_tooling.buildappconfig.md)): Promise<Error[]\>

compiles the _mmir_ resources:
configure/include/compile/generate _mmir_ resources (e.g. grammars, state-models)

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`buildConfig` | [BuildAppConfig](../interfaces/mmir_tooling.buildappconfig.md) | the _mmir_ build configuration  |

**Returns:** Promise<Error[]\>

a promise that is resolved when compilation has completed.
         If errors ocurred during compilation, the promise is resolved
         with a list of errors.
