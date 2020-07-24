"use strict";
var defaultValues = {
    de: {
        "language": "de-DE",
        "long": "deu-DEU",
        "plugins": {
            "ttsMary": {
                "language": "de"
            },
            "asrNuance": {
                "language": "deu-DEU"
            }
        }
    },
    en: {
        "language": "en-GB",
        "long": "eng-GBR",
        "plugins": {
            "ttsMary": {
                "language": "en_GB"
            },
            "asrNuance": {
                "language": "eng-GBR"
            },
            "ttsNuance": {
                "language": "en-UK"
            },
            "ttsNuanceXhr": {
                "language": "en-UK"
            }
        }
    },
    ja: {
        "language": "ja-JP",
        "long": "jpn-JPN",
        "plugins": {
            "asrNuance": {
                "language": "jpn-JPN"
            }
        }
    }
};
function getDefault(id) {
    return defaultValues[id] || {};
}
module.exports = {
    getDefault: getDefault
};
