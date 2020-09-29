import { AppConfig, BuildAppConfig } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';
/**
 * add/overwrite module alias (i.e. mapping module ID to file path)
 *
 * @param  {{paths?: {[moduleId: string]: string}}} mmirAppConfig the app-specific configuration: applies module-path-specifications from mmirAppConfig.paths
 * @param  {[{[moduleId: string]: string}]} alias the (default) mapping of module IDs to (absolute) paths
 */
declare function addAliasFrom(mmirAppConfig: AppConfig | BuildAppConfig | WebpackAppConfig, alias: {
    [moduleId: string]: string;
}): void;
declare function registerModuleId(appConfig: WebpackAppConfig, id: string, file: string): void;
declare function addAutoLoadModule(appConfig: WebpackAppConfig, id: string, file: string): void;
declare function addIncludeModule(appConfig: WebpackAppConfig, id: string, file?: string): void;
declare function addAppSettings(appConfig: WebpackAppConfig, id: string, settings: any): void;
declare const _default: {
    addAliasFrom: typeof addAliasFrom;
    /** add alias (i.e. "lookup information" for module ID -> file) for module */
    registerModuleId: typeof registerModuleId;
    /** add alias (i.e. "lookup information") for module AND include module in main script */
    addIncludeModule: typeof addIncludeModule;
    /** add alias (i.e. "lookup information") for module AND "auto-load" module in main script during initialization */
    addAutoLoadModule: typeof addAutoLoadModule;
    addAppSettings: typeof addAppSettings;
};
export = _default;
