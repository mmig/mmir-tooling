declare function writeDirectoriesJson(directories: any, targetDir: any): Promise<any>;
declare function prepareWriteSettings(settings: any, settingsOptions: any): Promise<void>;
/**
 * HELPER write settings files to config/* (for configuration settings) and
 *        to config/languages/<id>/* (for dictionary, grammar, and speech settings),
 *        if settings options specify that files should be written.
 *
 * @param  {Array<SettingsEntry>} settings the list of settings
 * @param  {SettingsOptions} settingsOptions the settings options
 */
declare function writeSettings(settings: any, settingsOptions: any): Promise<any[]>;
declare const _default: {
    writeDirectoriesJson: typeof writeDirectoriesJson;
    writeSettings: typeof writeSettings;
    prepareWriteSettings: typeof prepareWriteSettings;
};
export = _default;
