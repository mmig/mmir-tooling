declare function registerModuleId(appConfig: any, id: any, file: any): void;
declare function addAutoLoadModule(appConfig: any, id: any, file: any): void;
declare function addIncludeModule(appConfig: any, id: any, file?: any): void;
declare function addAppSettings(appConfig: any, id: any, settings: any): void;
declare const _default: {
    addModulePaths: (userConfig: any, mmirAppConfig: any) => void;
    addModuleConfigs: (userConfig: any, mmirAppConfig: any) => void;
    addAliasFrom: (mmirAppConfig: any, alias: any) => void;
    /** add alias (i.e. "lookup information" for module ID -> file) for module */
    registerModuleId: typeof registerModuleId;
    /** add alias (i.e. "lookup information") for module AND include module in main script */
    addIncludeModule: typeof addIncludeModule;
    /** add alias (i.e. "lookup information") for module AND "auto-load" module in main script during initialization */
    addAutoLoadModule: typeof addAutoLoadModule;
    addAppSettings: typeof addAppSettings;
};
export = _default;
