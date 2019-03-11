
var createDirectoriesJson = function(){
	return {
	  "/controllers": [],//["mmirf/controller/application.js", "mmirf/controller/calendar.js"]
	  "/views": [],//["application", "calendar", "layouts"]
	  // "/views/application": ["login.ehtml"],
	  // "/views/calendar": ["login.ehtml"],
	  // "/views/layouts": ["default.ehtml"],
	  "/models": [],
	  "/config": ["languages", "statedef", "configuration.json", "directories.json"],
	  "/config/languages": [],//["en"]
	  // "/config/languages/en": ["dictionary.json", "speech.json"],
	  "/config/statedef": [],//["dialogDescriptionSCXML.xml", "inputDescriptionSCXML.xml"]
	  "/helpers": [],
	  "/gen/grammar": [],//["mmirf/grammar/en.js"]
	  "/gen/views": []//,//["application", "calendar", "layouts"]
	  // "/gen/views/application": ["login.js"],
	  // "/gen/views/calendar": ["login.js"],
	  // "/gen/views/layouts": ["default.js"]
	}
};

var cpath = "/controllers";
var vpath = "/views";
var mpath = "/models";
var lpath = "/config/languages";
var spath = "/config/statedef";
var hpath = "/helpers";
var gengrammars = "/gen/grammar";
var genviews = "/gen/views";
var confpath = "/config";

var reViewInfo = /mmirf\/view\/([^/]+)\/([^/]+)/;
var reCtrlInfo = /mmirf\/controller\/([^/]+)/;
var reGrammarInfo = /mmirf\/grammar\/([^/]+)/;
var reJsonGrammarInfo = /mmirf\/settings\/grammar\/([^/]+)/;
var reDictionaryInfo = /mmirf\/settings\/dictionary\/([^/]+)/;
var reSpeechConfigInfo = /mmirf\/settings\/speech\/([^/]+)/;


function _addPath(json, path, entry){
	if(!json[path]){
		json[path] = [entry];
	} else if(!json[path].find(function(item){return item === entry})){
		json[path].push(entry);
	}
}

function addCtrl(json, reqId){
	_addPath(json, cpath, reqId + '.js');
	// console.log('added '+reqId+' to ['+cpath+']: ', json[cpath], ', existing: ', json[cpath].find(function(item){return item === reqId+'.js'}), ' in -> ', json);
}

function addHelper(json, reqId){
	_addPath(json, hpath, reqId + '.js');
}

function addModel(json, reqId){
	_addPath(json, mpath, reqId + '.js');
}

/**
 *
 * @param {String} reqId  the module ID for require'ing the view
 */
function addView(json, reqId){
	var m = reViewInfo.exec(reqId);
	var ctrlName = m[1];

	_addPath(json, genviews, ctrlName);
	_addPath(json, genviews + '/' + ctrlName, reqId + '.js');

	// //FIXME this entries are used for determing the existence of view(s), ie. without it, the generated views will not be LOADED
	// //      ... but the webpack-build does not really contain the eHTML templates  -> should change existence detection, so that gen-views are loaded even if view templates are missing
	// _addPath(json, vpath, ctrlName);
	// _addPath(json, vpath + '/'  + ctrlName, m[2] + '.ehtml');
}

function addGrammar(json, reqId){
	var m = reGrammarInfo.exec(reqId);
	var lang = m[1];
	_addPath(json, gengrammars, reqId + '.js');

	//NOTE add language-entry to indicate that there is a resource available for the language:
	_addPath(json, lpath, lang);

	// //FIXME this entries are used for determing the existence of grammar(s), ie. without it, the generated grammars will not be LOADED
	// //      ... but the webpack-build does not really contain the JSON grammars -> should change existence detection, so that gen-grammars are loaded even if JSON grammars are missing
	// _addPath(json, lpath + '/'  + lang, 'grammar.json');
}

function addJsonGrammar(json, reqId){
	var m = reJsonGrammarInfo.exec(reqId);
	var lang = m[1];

	_addPath(json, lpath, lang);
	_addPath(json, lpath + '/'  + lang, 'grammar.json');
}

function addDictionary(json, reqId){
	var m = reDictionaryInfo.exec(reqId);
	var lang = m[1];
	_addPath(json, lpath, lang);
	_addPath(json, lpath + '/'  + lang, 'dictionary.json');
}

function addSpeechConfig(json, reqId){
	var m = reSpeechConfigInfo.exec(reqId);
	var lang = m[1];
	_addPath(json, lpath, lang);
	_addPath(json, lpath + '/'  + lang, 'speech.json');
}

function addScxml(scxml, reqId){
	_addPath(scxml, spath, reqId + '.js');
}

function getLanguages(json){
	return json[lpath] || [];
}

module.exports = {
	addCtrl: addCtrl,
	addView: addView,
	addHelper: addHelper,
	addModel: addModel,
	addGrammar: addGrammar,
	addJsonGrammar: addJsonGrammar,
	addDictionary: addDictionary,
	addSpeechConfig: addSpeechConfig,
	addScxml: addScxml,
	createDirectoriesJson: createDirectoriesJson,
	getLanguages: getLanguages
	// reset: function(){
	// 	_json = null;
	// },
	// getCurrent: function(){
	// 	return _json;
	// }
}
