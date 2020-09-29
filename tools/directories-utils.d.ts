import { DirectoriesInfo } from '../index.d';
declare function createDirectoriesJson(): DirectoriesInfo;
declare function addCtrl(json: DirectoriesInfo, reqId: string): void;
declare function addHelper(json: DirectoriesInfo, reqId: string): void;
declare function addModel(json: DirectoriesInfo, reqId: string): void;
/**
 *
 * @param {String} reqId  the module ID for require'ing the view
 */
declare function addView(json: DirectoriesInfo, reqId: string): void;
declare function addViewTemplate(json: DirectoriesInfo, reqId: string): void;
declare function addGrammar(json: DirectoriesInfo, reqId: string): void;
declare function addJsonGrammar(json: DirectoriesInfo, reqId: string): void;
declare function addDictionary(json: DirectoriesInfo, reqId: string): void;
declare function addSpeechConfig(json: DirectoriesInfo, reqId: string): void;
declare function addStateModel(json: DirectoriesInfo, reqId: string): void;
declare function addStateModelXml(json: DirectoriesInfo, reqId: string): void;
declare function getLanguages(json: DirectoriesInfo): string[];
declare const _default: {
    addCtrl: typeof addCtrl;
    addView: typeof addView;
    addViewTemplate: typeof addViewTemplate;
    addHelper: typeof addHelper;
    addModel: typeof addModel;
    addGrammar: typeof addGrammar;
    addJsonGrammar: typeof addJsonGrammar;
    addDictionary: typeof addDictionary;
    addSpeechConfig: typeof addSpeechConfig;
    addStateModel: typeof addStateModel;
    addStateModelXml: typeof addStateModelXml;
    createDirectoriesJson: typeof createDirectoriesJson;
    getLanguages: typeof getLanguages;
    setMode: (mode: "file" | "id") => void;
};
export = _default;
