**[mmir-tooling 7.0.0-beta1](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / PluginExportConfigInfo

# Interface: PluginExportConfigInfo

## Hierarchy

* **PluginExportConfigInfo**

## Index

### Properties

* [buildConfigs](mmir_tooling.pluginexportconfiginfo.md#buildconfigs)
* [config](mmir_tooling.pluginexportconfiginfo.md#config)
* [defaultSpeechValues](mmir_tooling.pluginexportconfiginfo.md#defaultspeechvalues)
* [defaultValues](mmir_tooling.pluginexportconfiginfo.md#defaultvalues)
* [pluginName](mmir_tooling.pluginexportconfiginfo.md#pluginname)
* [speechConfig](mmir_tooling.pluginexportconfiginfo.md#speechconfig)

## Properties

### buildConfigs

• `Optional` **buildConfigs**: ([PluginExportBuildConfig](../modules/mmir_tooling.md#pluginexportbuildconfig) \| [PluginExportBuildConfigCreator](../modules/mmir_tooling.md#pluginexportbuildconfigcreator))[]

optional configuration for the AppConfig / BuildAppConfig / WebpackAppConfig

___

### config

• `Optional` **config**: string[]

___

### defaultSpeechValues

• `Optional` **defaultSpeechValues**: { [speechConfigField:string]: any;  }

may (or may not) contain a default value for entry of field speechConfig

___

### defaultValues

• `Optional` **defaultValues**: { [configField:string]: any;  }

may (or may not) contain a default value for entry of field config

___

### pluginName

•  **pluginName**: string

___

### speechConfig

• `Optional` **speechConfig**: Array<[SpeechConfigField](../modules/mmir_tooling.md#speechconfigfield)\>
