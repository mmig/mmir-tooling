declare function addCtrl(json: any, reqId: any): void;
declare function addHelper(json: any, reqId: any): void;
declare function addModel(json: any, reqId: any): void;
/**
 *
 * @param {String} reqId  the module ID for require'ing the view
 */
declare function addView(json: any, reqId: any): void;
declare function addViewTemplate(json: any, reqId: any): void;
declare function addGrammar(json: any, reqId: any): void;
declare function addJsonGrammar(json: any, reqId: any): void;
declare function addDictionary(json: any, reqId: any): void;
declare function addSpeechConfig(json: any, reqId: any): void;
declare function addStateModel(json: any, reqId: any): void;
declare function addStateModelXml(json: any, reqId: any): void;
declare function getLanguages(json: any): any;
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
    createDirectoriesJson: () => {
        "/controllers": any[];
        "/views": any[];
        "/models": any[];
        "/config": string[];
        "/config/languages": any[];
        "/config/states": any[];
        "/helpers": any[];
        "/gen": string[];
    };
    getLanguages: typeof getLanguages;
    setMode: (mode: any) => void;
};
export = _default;
