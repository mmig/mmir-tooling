import { WebpackAppConfig } from '../index-webpack.d';
declare function registerModuleId(appConfig: WebpackAppConfig, id: string, file: string): void;
declare function addAutoLoadModule(appConfig: WebpackAppConfig, id: string, file: string): void;
declare function addIncludeModule(appConfig: WebpackAppConfig, id: string, file?: string): void;
declare function addAppSettings(appConfig: WebpackAppConfig, id: string, settings: any): void;
declare const _default: {
    /** add alias (i.e. "lookup information" for module ID -> file) for module */
    registerModuleId: typeof registerModuleId;
    /** add alias (i.e. "lookup information") for module AND include module in main script */
    addIncludeModule: typeof addIncludeModule;
    /** add alias (i.e. "lookup information") for module AND "auto-load" module in main script during initialization */
    addAutoLoadModule: typeof addAutoLoadModule;
    addAppSettings: typeof addAppSettings;
};
export = _default;
