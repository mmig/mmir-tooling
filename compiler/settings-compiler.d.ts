import { DirectoriesInfo, SettingsBuildEntry, SettingsBuildOptions } from '../index.d';
declare function writeDirectoriesJson(directories: DirectoriesInfo, targetDir: string): Promise<void | Error>;
declare function prepareWriteSettings(settings: SettingsBuildEntry[], settingsOptions: SettingsBuildOptions): Promise<void | Error>;
/**
 * HELPER write settings files to config/* (for configuration settings) and
 *        to config/languages/<id>/* (for dictionary, grammar, and speech settings),
 *        if settings options specify that files should be written.
 *
 * @param  {Array<SettingsEntry>} settings the list of settings
 * @param  {SettingsOptions} settingsOptions the settings options
 */
declare function writeSettings(settings: SettingsBuildEntry[], settingsOptions: SettingsBuildOptions): Promise<Array<Error | Error[]> | any[]>;
declare const _default: {
    writeDirectoriesJson: typeof writeDirectoriesJson;
    writeSettings: typeof writeSettings;
    prepareWriteSettings: typeof prepareWriteSettings;
};
export = _default;
