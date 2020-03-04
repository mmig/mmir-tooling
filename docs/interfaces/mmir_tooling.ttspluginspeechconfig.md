[mmir-tooling 6.1.0](../README.md) › [mmir-tooling](../modules/mmir_tooling.md) › [TTSPluginSpeechConfig](mmir_tooling.ttspluginspeechconfig.md)

# Interface: TTSPluginSpeechConfig

Additional configuration for speech output (TTS: Text To Speech) for mmir plugins:
extend configuration specified in (language specific) `speech.json`.

NOTE for applying a value to all speech configurations (i.e. for language codes):
use a simple string
 <pre>
 {voice: 'female'}
 </pre>
or, if combined with specific settings, use "__apply-to-all-configs__" as language code
 <pre>
 {voice: {
 	en: 'Hedda',
 	'__apply-to-all-configs__': 'male'
 }}
 </pre>
 which would set "Hedda" as voice for "en", and voice "male" for all other language codes

**`see`** [SimpleSpeechConfig](mmir_lib.simplespeechconfig.md)

## Hierarchy

* **TTSPluginSpeechConfig**

## Index

### Properties

* [language](mmir_tooling.ttspluginspeechconfig.md#optional-language)
* [long](mmir_tooling.ttspluginspeechconfig.md#optional-long)
* [voice](mmir_tooling.ttspluginspeechconfig.md#optional-voice)

## Properties

### `Optional` language

• **language**? : *string | object*

local with 2-letter language- and country-code, separated with "-", e.g. "de-DE" or "en-US"

___

### `Optional` long

• **long**? : *string | object*

local with 3-letter language- and country-code, separated with "-", e.g. "deu-DEU" or "eng-USA"

___

### `Optional` voice

• **voice**? : *"male" | "female" | string | object*

voice name or feature (may not be supported by selected TTS plugin)
