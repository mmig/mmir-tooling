"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const lodash_1 = __importDefault(require("lodash"));
var defaultGrammar = {
    "stopwords": [],
    "tokens": {},
    "utterances": {}
};
function getDefault(_id) {
    return lodash_1.default.cloneDeep(defaultGrammar);
}
module.exports = {
    getDefault
};
