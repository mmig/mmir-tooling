[mmir-tooling 6.0.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [PluginOptions](mmir_tooling.pluginoptions.md)

# Interface: PluginOptions

**`example`** 
```
var includePlugins = [
	{id: 'mmir-plugin-asr-nuance-xhr', config: {
   // ctx: 'nuance',//OPTIONAL install into sub-context "nuance"
     appKey: "9...",
     appId: "NMDPTRIAL....",
	}},
 {id: 'mmir-plugin-asr-google-xhr',
   mode: 'wasm',
   config: {
     appKey: 'A....',
     results: 5
 }},
 {id: 'mmir-plugin-tts-nuance-xhr', config: {
   appKey: "9....",
   appId: "NMDPTRIAL_...",
   voice: {fr: 'Samantha'},
   language: {ja: 'jpn-JPN'}
 }},
 {id: 'mmir-plugin-tts-speakjs', config: {
   env: 'browser',
   ctx: 'local' //OPTIONAL install into sub-context "local"
 }},
 {id: 'mmir-plugin-speech-android', config: {
   // ctx: 'android',//OPTIONAL install into sub-context "android"
   voice: {de: 'male'},
   language: {en: 'eng-IND'}
 }},
];
```

## Hierarchy

* **PluginOptions**

## Index

### Properties

* [buildConfig](mmir_tooling.pluginoptions.md#optional-buildconfig)
* [config](mmir_tooling.pluginoptions.md#optional-config)
* [id](mmir_tooling.pluginoptions.md#id)
* [mode](mmir_tooling.pluginoptions.md#optional-mode)

## Properties

### `Optional` buildConfig

• **buildConfig**? : *[AppConfig](mmir_tooling.appconfig.md)*

if supported by plugin:
custom build options.

NOTE if the plugin does not support custom build configuration, this
     will be ignored.

___

### `Optional` config

• **config**? : *[PluginConfig](../modules/mmir_tooling.md#pluginconfig) | [TTSPluginSpeechConfig](mmir_tooling.ttspluginspeechconfig.md)*

configuration for the plugin: specific fields/values depending on the plugin
NOTE some plugins require credentials, e.g. "appId" and "appKey"

___

###  id

• **id**: *string*

the (package) ID of the plugin
NOTE: the plugin needs to be installed, i.e. "npm install ..."

___

### `Optional` mode

• **mode**? : *"wasm" | "min" | "default"*

mode for including the plugin: if the plugin does not support the specified mode, will automatically use "default" mode
