**[mmir-tooling 6.2.0](../README.md)**

> [Globals](../README.md) / [mmir-tooling](../modules/mmir_tooling.md) / TTSPluginSpeechConfig

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

* [language](mmir_tooling.ttspluginspeechconfig.md#language)
* [long](mmir_tooling.ttspluginspeechconfig.md#long)
* [voice](mmir_tooling.ttspluginspeechconfig.md#voice)

## Properties

### language

• `Optional` **language**: string \| { [languageCode:string]: string;  }

local with 2-letter language- and country-code, separated with "-", e.g. "de-DE" or "en-US"

___

### long

• `Optional` **long**: string \| { [languageCode:string]: string;  }

local with 3-letter language- and country-code, separated with "-", e.g. "deu-DEU" or "eng-USA"

___

### voice

• `Optional` **voice**: \"male\" \| \"female\" \| string \| { [languageCode:string]: \"male\" \| \"female\" \| string;  }

voice name or feature (may not be supported by selected TTS plugin)
