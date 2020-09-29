import { SettingsBuildOptions, SettingsType, SettingsBuildEntry, SettingsBuildEntryMultiple, RuntimeConfiguration, AsyncGramarExecEntry, DirectoriesInfo, ResourceConfig, BuildAppConfig, SettingsOptions } from '../index.d';
import { Grammar, SpeechConfig } from 'mmir-lib';
declare function getFileType(filePath: string): 'js' | 'json';
/**
 * read settings file as JSON or "plain" CommonJS module and return PlainObject
 *
 * @param  {string} filePath the filePath
 * @param  {'json' | 'js'} [fileType] OPTIONAL if omitted, will be derived from filePath (DEFAULT: 'json')
 * @param  {boolean} [async] OPTIONAL (positional argument!) if settings file should be read async (which will return Promise)
 * @return {{[field: string]: any} | Promise<{[field: string]: any}>} the settings object (or if async, a Promise that resolves to the settings object)
 */
declare function readSettingsFile(filePath: string, fileType?: 'json' | 'js', async?: boolean): any;
import { WebpackAppConfig } from '../index-webpack.d';
declare function normalizeConfigurations(settingsList: SettingsBuildEntry[]): void;
/**
 * HELPER create a non-file settings entry (i.e. not loaded from a file)
 *
 * @param  {SettingsType} type the type of settings object, e.g. "speech" or "configuration"
 * @param  {Object} value the actual settings-data (JSON-like object)
 * @param  {String} [id] if more than 1 settings-entry for this type can exist, its ID
 * @return {SettingsEntry} the settings-entry
 */
declare function createSettingsEntryFor(type: SettingsType, value: any, id?: string): SettingsBuildEntry;
declare function getConfiguration(settingsList: SettingsBuildEntry[]): SettingsBuildEntryMultiple | undefined;
declare function getSettings(settingsList: SettingsBuildEntry[], type: SettingsType): SettingsBuildEntry[];
/**
 * HELPER create default for settings type
 *
 * @param  {SettingsType} type the type of settings object, e.g. "speech" or "configuration"
 * @param  {String} id if more than 1 settings-entry for this type can exist, its ID
 * @return {any} the (default) settings value for id
 */
declare function createDefaultSettingsFor(type: SettingsType | string, id: string): RuntimeConfiguration | Grammar | {
    [dictKey: string]: string;
} | SpeechConfig;
/**
 * check if settings entry should be excluded
 *
 * @param  {SettingsType} settingsType
 * @param  {Array<SettingsType>|RegExp} [excludeTypePattern] if not specified, always returns FALSE
 * @return {Boolean} TRUE if settings should be excluded
 */
declare function isExclude(settingsType: SettingsType, excludeTypePattern: Array<SettingsType> | RegExp): boolean;
declare const _default: {
    setGrammarIgnored: (runtimeConfiguration: RuntimeConfiguration, grammarId: string) => void;
    setGrammarAsyncExec: (runtimeConfiguration: RuntimeConfiguration, grammarIdOrEntry: string | AsyncGramarExecEntry) => void;
    /**
     * parse for JSON settings files
     *
     * @param  {SetttingsOptions} options the settings-options with field options.path:
     *                                  options.path: {String} the directory to parse for JSON settings
     *                                  options.configuration: {Boolean | SettingsEntryOptions} options for the configuration.json (or .js) entry
     *                                  options.dictionary: {Boolean | {[id: String]: SettingsEntryOptions}} options-map for the dictionary.json (or .js) entries where id is (usually) the language code
     *                                  options.grammar: {Boolean | {[id: String]: SettingsEntryOptions}} options-map for the grammar.json (or .js) entries where id is (usually) the language code
     *                                  options.speech: {Boolean | {[id: String]: SettingsEntryOptions}} options-map for the speech.json (or .js) entries where id is (usually) the language code
     *                                   where:
     *                                     if Boolean: if FALSE, the corresponding JSON settings are excluded/ignored
     *                                     if SettingsEntryOptions:
     *                                     			SettingsEntryOptions.exclude: {Boolean} if TRUE the JSON setting for the corresponding ID will be excluded/ignored
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param  {Array<SettingsEntry>} [settingsList] OPTIONAL
     * @return {Array<SettingsEntry>} list of setting entries:
     * 																		{
     * 																			type: 'configuration' | 'dictionary' | 'grammar' | 'speech',
     * 																			file: String,
     * 																			id: String | undefined
     * 																		}
     */
    jsonSettingsFromDir: (options: SettingsOptions | SettingsBuildOptions | false, appRootDir: string, settingsList?: SettingsBuildEntry[]) => SettingsBuildEntry[];
    createSettingsEntryFor: typeof createSettingsEntryFor;
    createDefaultSettingsFor: typeof createDefaultSettingsFor;
    normalizeConfigurations: typeof normalizeConfigurations;
    getConfiguration: typeof getConfiguration;
    getSettingsFor: typeof getSettings;
    /** load settings file
     * NOTE: if updating s.value with the loaded data, need to update s.include and s.file accordingly!
     */
    loadSettingsFrom: typeof readSettingsFile;
    getFileType: typeof getFileType;
    getAllSpeechConfigsType: () => 'speech-all';
    /**
     * apply the "global" options from `options` or default values to the entries
     * from `settingsList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {SetttingsOptions} options the settings options
     * @param  {{Array<SettingsEntry>}} settingsList
     * @return {{Array<SettingsEntry>}}
     */
    applyDefaultOptions: (options: SettingsBuildOptions, settingsList: SettingsBuildEntry[]) => SettingsBuildEntry[];
    addSettingsToAppConfig: (settings: SettingsBuildEntry[], appConfig: BuildAppConfig | WebpackAppConfig, directories: DirectoriesInfo, _resources: ResourceConfig, runtimeConfig: RuntimeConfiguration, settingsOptions: SettingsOptions | SettingsBuildOptions | false, ignoreMissingDictionaries?: boolean) => void;
    isExcludeType: typeof isExclude;
    configEntryIgnoreGrammar: string;
    configEntryAsyncExecGrammar: string;
    configEntryDisableGrammarStrictMode: string;
};
export = _default;
