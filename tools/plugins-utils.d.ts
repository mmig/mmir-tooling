import { RuntimeConfiguration, SettingsBuildEntry, DirectoriesInfo, ResourceConfig, PluginOptions } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';
/**
 * check if `plugin` is already contained in `pluginList`
 *
 * NOTE: uses deep comparision, i.e. entries with same id (plugin.id) are considered
 *       deferent, if their (other) properties differ (even if the IDs match).
 *
 * @param  plugin the plugin
 * @param  pluginList the list of plugins to check
 * @param  deepComparison if `true`, makes deep comparision, instead of comparing the IDs
 * @return `false` if `plugin` is NOT contained in `pluginList`, otherwise the duplicate entry from `pluginList`
 */
declare function constainsPlugin(plugin: PluginOptions, pluginList: PluginOptions[] | null | undefined, deepComparison: boolean): false | PluginOptions;
declare function processDuplicates(pluginList: PluginOptions[], removeFromList?: boolean): Map<string, PluginOptions[]>;
declare function normalizePluginEntry(plugin: PluginOptions | string): PluginOptions;
declare const _default: {
    addPluginInfos: (pluginSettings: PluginOptions, appConfig: WebpackAppConfig, _directories: DirectoriesInfo, resourcesConfig: ResourceConfig, runtimeConfig: RuntimeConfiguration, settings: SettingsBuildEntry[]) => void;
    processDuplicates: typeof processDuplicates;
    constainsPlugin: typeof constainsPlugin;
    normalizePluginEntry: typeof normalizePluginEntry;
};
export = _default;
