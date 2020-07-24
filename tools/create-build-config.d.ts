export declare function createBuildConfig(mmirAppConfig: any, resourcesConfig: any): {
    grammars: any[];
    grammarOptions: any;
    views: any[];
    viewOptions: any;
    states: any[];
    stateOptions: any;
    implList: any[];
    ctrlOptions: any;
    helperOptions: any;
    modelOptions: any;
    settings: any;
    settingsOptions: any;
    directories: {
        "/controllers": any[];
        "/views": any[];
        "/models": any[];
        "/config": string[];
        "/config/languages": any[];
        "/config/states": any[];
        "/helpers": any[];
        "/gen": string[];
    };
};
export declare type BuildConfig = {
    grammars: any[];
    grammarOptions: any;
    views: any[];
    viewOptions: any;
    states: any[];
    stateOptions: any;
    implList: any[];
    ctrlOptions: any;
    helperOptions: any;
    modelOptions: any;
    settings: any;
    settingsOptions: any;
    directories: any;
};
