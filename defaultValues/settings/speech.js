
var defaultValues = {

    de: {
        "language": "de-DE",
        "long": "deu-DEU",

        "plugins": {
            "ttsMary": {//"maryTextToSpeech"
                "language": "de"
            },
            "asrNuance": {//"nuanceAudioInput"
                "language": "deu-DEU"
            }
        }
    },

    en: {
        "language": "en-GB",
        "long": "eng-GBR",

        "plugins": {
            "ttsMary": {//"maryTextToSpeech"
                "language": "en_GB"
            },
            "asrNuance": {//"nuanceAudioInput"
                "language": "eng-GBR"
            },
            "ttsNuance": {//"nuanceTextToSpeech"
                "language": "en-UK"
            },
            "ttsNuanceXhr": {//"nuanceHttpTextToSpeech"
                "language": "en-UK"
            }
        }
    },

    ja: {
        "language": "ja-JP",
        "long": "jpn-JPN",

        "plugins": {
            "asrNuance": {//"nuanceAudioInput"
                "language": "jpn-JPN"
            }
        }
    }
};

function getDefault(id){
    return defaultValues[id] || {};
}

module.exports = {
    getDefault
};
