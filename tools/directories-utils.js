"use strict";
function createDirectoriesJson() {
    return {
        "/controllers": [],
        "/views": [],
        // "/views/application": ["login.ehtml"],
        // "/views/calendar": ["login.ehtml"],
        // "/views/layouts": ["default.ehtml"],
        "/models": [],
        "/config": ["languages", "states", "configuration.json"],
        "/config/languages": [],
        // "/config/languages/en": ["dictionary.json", "speech.json"],
        "/config/states": [],
        "/helpers": [],
        "/gen": ["directories.json"],
    };
}
;
const cpath = "/controllers";
const vpath = "/views";
const mpath = "/models";
// const confpath = "/config";
const lpath = "/config/languages";
const spath = "/config/states";
const hpath = "/helpers";
const gpath = "/gen";
const gensubgrammars = "/grammar";
const gengrammars = "/gen" + gensubgrammars;
const gensubviews = "/view";
const genviews = "/gen" + gensubviews;
const gensubstates = "/state";
const genstates = "/gen" + gensubstates;
const reViewInfo = /mmirf\/view\/([^/]+)\/([^/]+)/;
// const reCtrlInfo = /mmirf\/controller\/([^/]+)/;
const reGrammarInfo = /mmirf\/grammar\/([^/]+)/;
const reJsonGrammarInfo = /mmirf\/settings\/grammar\/([^/]+)/;
const reDictionaryInfo = /mmirf\/settings\/dictionary\/([^/]+)/;
const reSpeechConfigInfo = /mmirf\/settings\/speech\/([^/]+)/;
const reSateModelInfo = /mmirf\/state\/([^/]+)/;
let entryMode = 'id'; // 'id' | 'file';
function _getEntry(entry) {
    if (entryMode === 'file') {
        return entry.replace(/^.*\//, '');
    }
    return entry;
}
function _addPath(json, path, entry) {
    entry = _getEntry(entry);
    if (!json[path]) {
        json[path] = [entry];
    }
    else if (!json[path].find(function (item) { return item === entry; })) {
        json[path].push(entry);
    }
}
function addCtrl(json, reqId) {
    _addPath(json, cpath, reqId + '.js');
    // log('added '+reqId+' to ['+cpath+']: ', json[cpath], ', existing: ', json[cpath].find(function(item){return item === reqId+'.js'}), ' in -> ', json);
}
function addHelper(json, reqId) {
    _addPath(json, hpath, reqId + '.js');
}
function addModel(json, reqId) {
    _addPath(json, mpath, reqId + '.js');
}
/**
 *
 * @param {String} reqId  the module ID for require'ing the view
 */
function addView(json, reqId) {
    const m = reViewInfo.exec(reqId);
    const ctrlName = m[1];
    _addPath(json, gpath, gensubviews);
    _addPath(json, genviews, ctrlName);
    _addPath(json, genviews + '/' + ctrlName, reqId + '.js');
    // //FIXME this entries are used for determing the existence of view(s), ie. without it, the generated views will not be LOADED
    // //      ... but the webpack-build does not really contain the eHTML templates  -> should change existence detection, so that gen-views are loaded even if view templates are missing
    // _addPath(json, vpath, ctrlName);
    // _addPath(json, vpath + '/'  + ctrlName, m[2] + '.ehtml');
}
function addViewTemplate(json, reqId) {
    const m = reViewInfo.exec(reqId);
    const ctrlName = m[1];
    _addPath(json, vpath, ctrlName);
    _addPath(json, vpath + '/' + ctrlName, m[2] + '.ehtml');
}
function addGrammar(json, reqId) {
    const m = reGrammarInfo.exec(reqId);
    const lang = m[1];
    _addPath(json, gpath, gensubgrammars);
    _addPath(json, gengrammars, reqId + '.js');
    //NOTE add language-entry to indicate that there is a resource available for the language:
    _addPath(json, lpath, lang);
    // //FIXME this entries are used for determing the existence of grammar(s), ie. without it, the generated grammars will not be LOADED
    // //      ... but the webpack-build does not really contain the JSON grammars -> should change existence detection, so that gen-grammars are loaded even if JSON grammars are missing
    // _addPath(json, lpath + '/'  + lang, 'grammar.json');
}
function addJsonGrammar(json, reqId) {
    const m = reJsonGrammarInfo.exec(reqId);
    const lang = m[1];
    _addPath(json, lpath, lang);
    _addPath(json, lpath + '/' + lang, 'grammar.json');
}
function addDictionary(json, reqId) {
    const m = reDictionaryInfo.exec(reqId);
    const lang = m[1];
    _addPath(json, lpath, lang);
    _addPath(json, lpath + '/' + lang, 'dictionary.json');
}
function addSpeechConfig(json, reqId) {
    const m = reSpeechConfigInfo.exec(reqId);
    const lang = m[1];
    _addPath(json, lpath, lang);
    _addPath(json, lpath + '/' + lang, 'speech.json');
}
function addStateModel(json, reqId) {
    _addPath(json, gpath, gensubstates);
    _addPath(json, genstates, reqId + '.js');
}
function addStateModelXml(json, reqId) {
    const m = reSateModelInfo.exec(reqId);
    const type = m[1];
    _addPath(json, spath, type + '.xml');
}
function getLanguages(json) {
    return json[lpath] || [];
}
module.exports = {
    addCtrl: addCtrl,
    addView: addView,
    addViewTemplate: addViewTemplate,
    addHelper: addHelper,
    addModel: addModel,
    addGrammar: addGrammar,
    addJsonGrammar: addJsonGrammar,
    addDictionary: addDictionary,
    addSpeechConfig: addSpeechConfig,
    addStateModel: addStateModel,
    addStateModelXml: addStateModelXml,
    createDirectoriesJson: createDirectoriesJson,
    getLanguages: getLanguages,
    setMode: function (mode) {
        entryMode = mode;
    }
    // reset: function(){
    // 	_json = null;
    // },
    // getCurrent: function(){
    // 	return _json;
    // }
};
