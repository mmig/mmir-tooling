
import { DirectoriesInfo } from '../index.d';

function createDirectoriesJson(): DirectoriesInfo {
    return {
        "/controllers": [],//["mmirf/controller/application.js", "mmirf/controller/calendar.js"]
        "/views": [],//["application", "calendar", "layouts"]
        // "/views/application": ["login.ehtml"],
        // "/views/calendar": ["login.ehtml"],
        // "/views/layouts": ["default.ehtml"],
        "/models": [],
        "/config": ["languages", "states", "configuration.json"],
        "/config/languages": [],//["en"]
        // "/config/languages/en": ["dictionary.json", "speech.json"],
        "/config/states": [],//["dialog.xml", "input.xml"]
        "/helpers": [],
        "/gen": ["directories.json"],
        // "/gen/grammar": [],//["mmirf/grammar/en.js"]
        // "/gen/view": []//,//["application", "calendar", "layouts"]
        // "/gen/view/application": ["login.js"],
        // "/gen/view/calendar": ["login.js"],
        // "/gen/view/layouts": ["default.js"]
    }
};

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

let entryMode: 'id' | 'file' = 'id';// 'id' | 'file';

function _getEntry(entry: string): string {
    if(entryMode === 'file'){
        return entry.replace(/^.*\//, '');
    }
    return entry;
}

function _addPath(json: DirectoriesInfo, path: string, entry: string): void {
    entry = _getEntry(entry);
    if(!json[path]){
        json[path] = [entry];
    } else if(!json[path].find(function(item){return item === entry})){
        json[path].push(entry);
    }
}

function addCtrl(json: DirectoriesInfo, reqId: string): void {
    _addPath(json, cpath, reqId + '.js');
    // log('added '+reqId+' to ['+cpath+']: ', json[cpath], ', existing: ', json[cpath].find(function(item){return item === reqId+'.js'}), ' in -> ', json);
}

function addHelper(json: DirectoriesInfo, reqId: string): void {
    _addPath(json, hpath, reqId + '.js');
}

function addModel(json: DirectoriesInfo, reqId: string): void {
    _addPath(json, mpath, reqId + '.js');
}

/**
 *
 * @param {String} reqId  the module ID for require'ing the view
 */
function addView(json: DirectoriesInfo, reqId: string): void {
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

function addViewTemplate(json: DirectoriesInfo, reqId: string): void {
    const m = reViewInfo.exec(reqId);
    const ctrlName = m[1];

    _addPath(json, vpath, ctrlName);
    _addPath(json, vpath + '/'  + ctrlName, m[2] + '.ehtml');
}

function addGrammar(json: DirectoriesInfo, reqId: string): void {
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

function addJsonGrammar(json: DirectoriesInfo, reqId: string): void {
    const m = reJsonGrammarInfo.exec(reqId);
    const lang = m[1];

    _addPath(json, lpath, lang);
    _addPath(json, lpath + '/'  + lang, 'grammar.json');
}

function addDictionary(json: DirectoriesInfo, reqId: string): void {
    const m = reDictionaryInfo.exec(reqId);
    const lang = m[1];
    _addPath(json, lpath, lang);
    _addPath(json, lpath + '/'  + lang, 'dictionary.json');
}

function addSpeechConfig(json: DirectoriesInfo, reqId: string): void {
    const m = reSpeechConfigInfo.exec(reqId);
    const lang = m[1];
    _addPath(json, lpath, lang);
    _addPath(json, lpath + '/'  + lang, 'speech.json');
}

function addStateModel(json: DirectoriesInfo, reqId: string): void {
    _addPath(json, gpath, gensubstates);
    _addPath(json, genstates, reqId + '.js');
}

function addStateModelXml(json: DirectoriesInfo, reqId: string): void {
    const m = reSateModelInfo.exec(reqId);
    const type = m[1];
    _addPath(json, spath, type + '.xml');
}

function getLanguages(json: DirectoriesInfo): string[] {
    return json[lpath] || [];
}

export = {
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
    setMode: function(mode: 'id' | 'file'): void {
        entryMode = mode;
    }
    // reset: function(){
    // 	_json = null;
    // },
    // getCurrent: function(){
    // 	return _json;
    // }
}
