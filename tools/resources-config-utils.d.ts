declare const _default: {
    /**
     * [resourcePathsFrom description]
     * @param  {String} directory the directory that contains the default MMIR direcotry structure containing (possibly) config, languages, controllers, helpers etc.
     * @param  {ResourceParseOptions} parseOptions options for parsing the directories:
     * 													parseOptions.addModuleExport: {Boolean} use the addModuleExport option for controllers, helpers, and models
     * 													parseOptions.exclude: {Array<String>} exlude some resource types, like "controllers", or "models"
     * 																								for excluding sub-types for settings, e.g. dictionaries, use "settings/dictionary",
     * 																								or "settings/grammar" for excluding the sources of JSON grammars (i.e. exclude the sources for compiled grammars)
     * @return {AppConfig} the AppConfig with the 'path' option set for the corresponding resource type, so that the corresponding utils/loaders will the the resources from that path
     */
    resourcePathsFrom(directory: any, parseOptions: any): {};
    /**
     * HELPER for merging the results of resourcePathsFrom() with the user-supplied AppConfig,
     *        without overwritting user-set options
     * @param  {AppConfig} userConfig the user-supplied AppConfig, into which  the generatedConfig will be merged)
     * @param  {AppConfig} generatedConfig the generated AppConfig containing the path-field for discovered resources
     * @return {AppConfig} the merge AppConfig (same as userConfig)
     */
    mergeResourceConfigs(userConfig: any, generatedConfig: any): any;
};
export = _default;
