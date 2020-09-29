"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const promise_1 = __importDefault(require("../utils/promise"));
const filepath_utils_1 = __importDefault(require("../utils/filepath-utils"));
const module_config_init_1 = __importDefault(require("../utils/module-config-init"));
const directories_utils_1 = __importDefault(require("./directories-utils"));
const option_utils_1 = __importDefault(require("./option-utils"));
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
const configuration_1 = __importDefault(require("../defaultValues/settings/configuration"));
const dictionary_1 = __importDefault(require("../defaultValues/settings/dictionary"));
const grammar_1 = __importDefault(require("../defaultValues/settings/grammar"));
const speech_1 = __importDefault(require("../defaultValues/settings/speech"));
const ALL_SPEECH_CONFIGS_TYPE = 'speech-all';
const CONFIG_IGNORE_GRAMMAR_FILES = 'ignoreGrammarFiles';
const CONFIG_GRAMMAR_ASYNC_EXEC = 'grammarAsyncExecMode';
const CONFIG_GRAMMAR_DISABLE_STRICT_MODE = 'grammarDisableStrictCompileMode';
/**
 * scan for
 *
 *  * configuration.[json | js]
 *  * <id>/dictionary.[json | js]
 *  * <id>/grammar.[json | js]
 *  * <id>/speech.[json | js]
 *
 * NOTE: if .js file, it MUST be a CommonJS module that exports the settings object as its only/default export, i.e.  ~ "module.exports = settingsObject;";
 *       any dynamic code is evaluated at compile-time, i.e. the exported settings-object must not contain dynamic content
 *
 * @param  {[type]} dir [description]
 * @param  {[type]} list [description]
 * @param  {[type]} options [description]
 * @return {[type]} [description]
 */
function readDir(dir, list, options) {
    var files = fs_extra_1.default.readdirSync(dir);
    var dirs = [];
    // log('read dir "'+dir+'" -> ', files);
    files.forEach(function (p) {
        var absPath = path_1.default.join(dir, p);
        if (filepath_utils_1.default.isDirectory(absPath)) {
            dirs.push(absPath);
            return false;
        }
        else if (/(configuration|dictionary|grammar|speech)\.js(on)?$/i.test(absPath)) {
            let id, type;
            if (isSettingsType('configuration', absPath)) {
                type = 'configuration';
            }
            else {
                type = getTypeFrom(absPath);
                id = getIdFor(absPath);
            }
            let isAdd = true;
            let isInline = true;
            let isForce; //default for force: undefined
            if (options) {
                isInline = !/file/i.test(options.include);
                if (options[type] === false) {
                    isAdd = false;
                }
                else if (options[type] && (!id || options[type][id])) {
                    var conf = id ? options[type][id] : options[type];
                    isAdd = !conf.exclude;
                    isInline = typeof conf.include !== 'undefined' ? !/file/i.test(conf.include) : isInline;
                    isForce = conf.force;
                }
            }
            if (isAdd) {
                if (type !== 'configuration' && contains(list, type, id)) {
                    warn('ERROR settings-utils: encountered multiple entries for ' + type + ' setting for ID ' + id + ', ignoring ' + absPath);
                }
                else {
                    var normalized = filepath_utils_1.default.normalizePath(absPath);
                    var fileType = getFileType(normalized);
                    list.push({
                        type: type,
                        id: id,
                        file: normalized,
                        fileType: fileType,
                        value: isInline ? readSettingsFile(normalized, fileType) : void (0),
                        include: isInline ? 'inline' : 'file',
                        force: isForce
                    });
                }
            }
        }
    });
    // log('read sub-dirs -> ', dirs);
    var size = dirs.length;
    if (size > 0) {
        for (var i = 0; i < size; ++i) {
            readDir(dirs[i], list, options);
        }
    }
}
// function addFromOptions(settings, list, appRootDir){
// 	//TODO
// }
function isSettingsType(type, filePath) {
    return new RegExp('^' + type + '\.json$', 'i').test(path_1.default.basename(filePath));
}
function getTypeFrom(settingsFilePath) {
    return path_1.default.basename(settingsFilePath).replace(/\.js(on)?$/, '');
}
function getIdFor(settingsFilePath) {
    return path_1.default.basename(path_1.default.dirname(settingsFilePath));
}
function getFileType(filePath) {
    return /\.js$/i.test(filePath) ? 'js' : 'json';
}
/**
 * read settings file as JSON or "plain" CommonJS module and return PlainObject
 *
 * @param  {string} filePath the filePath
 * @param  {'json' | 'js'} [fileType] OPTIONAL if omitted, will be derived from filePath (DEFAULT: 'json')
 * @param  {boolean} [async] OPTIONAL (positional argument!) if settings file should be read async (which will return Promise)
 * @return {{[field: string]: any} | Promise<{[field: string]: any}>} the settings object (or if async, a Promise that resolves to the settings object)
 */
function readSettingsFile(filePath, fileType, async) {
    fileType = fileType || getFileType(filePath);
    if (fileType === 'js') {
        return !async ? requireJson(filePath) : new promise_1.default(function (resolve) { resolve(requireJson(filePath)); });
    }
    else {
        return !async ? readJsonSync(filePath) : readJsonAsync(filePath);
    }
}
//TODO wrap try/catch -> print webpack-error
function requireJson(filePath) {
    try {
        return require(filePath);
    }
    catch (err) {
        log_utils_1.default.warn('cannot load module contents as JSON-like object from ', filePath);
        throw err;
    }
}
function readJsonSync(filePath) {
    // log('reading ', filePath);//DEBU
    var buffer = fs_extra_1.default.readFileSync(filePath);
    return binToJsonObj(buffer, filePath);
}
function readJsonAsync(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        // log('reading ', filePath);//DEBU
        return new promise_1.default(function (resolve, reject) {
            fs_extra_1.default.readFile(filePath, function (err, buffer) {
                if (err) {
                    return reject(err);
                }
                resolve(binToJsonObj(buffer, filePath));
            });
        });
    });
}
//TODO wrap try/catch -> print webpack-error
function binToJsonObj(buffer, filePath) {
    var enc = detectByteOrder(buffer);
    var content = buffer.toString(enc);
    // var content = toUtfString(buffer, enc);// buffer.toString(enc);
    content = removeBom(content);
    // log('encoding '+enc+' -> ', JSON.stringify(content));//DEBU
    try {
        return JSON.parse(content);
    }
    catch (err) {
        log_utils_1.default.warn('cannot parse file contents as JSON from ', filePath);
        throw err;
    }
}
function detectByteOrder(buffer) {
    //from https://docs.microsoft.com/en-us/windows/desktop/Intl/using-byte-order-marks:
    //
    // Byte order mark 		Description
    // EF BB BF 					UTF-8
    // FF FE 							UTF-16, little endian
    // FE FF 							UTF-16, big endian
    // FF FE 00 00 				UTF-32, little endian
    // 00 00 FE FF 				UTF-32, big-endian
    if (buffer[0] === 239 /*EF*/ && buffer[1] === 187 /*BB*/ && buffer[2] === 191 /*BF*/) {
        return 'utf8';
        // } else if(buffer[0] === 255 /*FF*/ && buffer[1] === 254 /*FE*/ && buffer[2] === 0 /*00*/ && buffer[3] === 0 /*00*/){
        // 	return 'utf32le';
        // } else if(buffer[0] === 0 /*00*/ && buffer[1] === 0 /*00*/ && buffer[2] === 254 /*FE*/ && buffer[3] === 255 /*FF*/){
        // 	return 'utf32be';
    }
    else if (buffer[0] === 255 /*FF*/ && buffer[1] === 254 /*FE*/) {
        return 'utf16le';
    }
    else if (buffer[0] === 254 /*FE*/ && buffer[1] === 255 /*FF*/) {
        return 'utf16be';
    }
    //try utf8 anyway...
    return 'utf8';
}
// 	return iconv.decode(buffer, enc);
// }
function removeBom(content) {
    // log('remove BOM? -> ', content.codePointAt(0), content.codePointAt(1), content.codePointAt(2), content.codePointAt(3), content.codePointAt(4));//DEBU
    if (content.codePointAt(0) === 65279 /*FEFF*/ || content.codePointAt(0) === 65534 /*FFFE*/) {
        content = content.substring(1);
        // log('removed BOM!');//DEBU
    }
    return content;
}
/**
 * HELPER load all files for settings-entry
 * @param  {SettingsEntry} s NOTE s.file MUST be an Array!
 */
function doLoadAllFilesFor(s) {
    if (!s.value) {
        warn('WARN settings-utils: forced merging for "' + s.id + '" (' + s.type + ') with multiple file resources: content not loaded yet, loading file content and merging now...');
        if (Array.isArray(s.file)) {
            var content = {};
            s.file.forEach(function (f) {
                lodash_1.default.merge(content, readSettingsFile(f));
            });
            s.value = content;
        }
        else {
            warn('WARN settings-utils: could not merge files for "' + s.id + '" (' + s.type + ') since there is no file list: ', s.file);
        }
    }
    else {
        log('settings-utils: multiple file resources for "' + s.id + '" (' + s.type + ') already merged to ', s.value);
    }
}
function contains(list, settingsType, settingsId) {
    return list.findIndex(function (item) {
        return item.id === settingsId && item.type === settingsType;
    }) !== -1;
}
/**
 * check if value is contained in list
 *
 * @param  {Array<string|&{id: string}>} list
 * @param  {string|&{id: string}} value
 * @return {boolean}
 */
function containsEntry(list, value) {
    var id = typeof value === 'string' ? value : value.id;
    return list.findIndex(function (item) {
        return ((typeof item === 'string' ? item : item.id) === id);
    }) !== -1;
}
function normalizeConfigurations(settingsList) {
    var c, conf;
    for (var i = 0, size = settingsList.length; i < size; ++i) {
        c = settingsList[i];
        if (c.type === 'configuration') {
            if (conf) {
                // log("INFO settings-utils: encountered multiple configuration.json definition: merging configuration, some values may get overwritten");//DEBU
                //if "include" was set to "file", the file contents have not been loaded yet
                if (!conf.value) {
                    conf.value = readSettingsFile(Array.isArray(conf.file) ? conf.file[0] : conf.file, conf.fileType);
                }
                if (!c.value) {
                    c.value = readSettingsFile(c.file, c.fileType);
                }
                //merge configuration values:
                lodash_1.default.merge(conf.value, c.value);
                //"merge" file-fields:
                if (!conf.file) {
                    conf.file = [];
                }
                else if (!lodash_1.default.isArray(conf.file)) {
                    conf.file = [conf.file];
                }
                if (c.file) {
                    conf.file.push(c.file);
                }
                //remove merged configuration from list & adjust i & size
                settingsList.splice(i--, 1);
                --size;
            }
            else {
                conf = c;
            }
        }
    }
}
/**
 * HELPER create a non-file settings entry (i.e. not loaded from a file)
 *
 * @param  {SettingsType} type the type of settings object, e.g. "speech" or "configuration"
 * @param  {Object} value the actual settings-data (JSON-like object)
 * @param  {String} [id] if more than 1 settings-entry for this type can exist, its ID
 * @return {SettingsEntry} the settings-entry
 */
function createSettingsEntryFor(type, value, id) {
    return { type: type, file: 'settings://' + type + '/options' + (id ? '/' + id : ''), include: void (0), value: value, id: id };
}
function getConfiguration(settingsList) {
    return settingsList.find(function (item) { return item.type === 'configuration'; });
}
function getSettings(settingsList, type) {
    return settingsList.filter(function (item) { return item.type === type; });
}
/**
 * HELPER create default for settings type
 *
 * @param  {SettingsType} type the type of settings object, e.g. "speech" or "configuration"
 * @param  {String} id if more than 1 settings-entry for this type can exist, its ID
 * @return {any} the (default) settings value for id
 */
function createDefaultSettingsFor(type, id) {
    switch (type) {
        case 'configuration':
            return configuration_1.default.getDefault();
        case 'dictionary':
            return dictionary_1.default.getDefault(id);
        case 'grammar':
            return grammar_1.default.getDefault(id);
        case 'speech':
            return speech_1.default.getDefault(id);
    }
    warn("WARN settings-utils.createDefaultSettingsFor(): encountered unknown settings type " + type + " (id: " + id + "), using empty object as default value");
    return {};
}
function toAliasId(settings) {
    return 'mmirf/settings/' + settings.type + (settings.id ? '/' + settings.id : ''); //FIXME formalize IDs for loading views in webpack (?)
}
function addToConfigList(runtimeConfiguration, configListName, entry) {
    //NOTE: special treatment for value TRUE:
    //     in case a config-list is set to TRUE, it means that
    //     it should be interpreted, as if the config-list contains
    //     all possible values, e.g. for "ignoreGrammarFiles" -> do ignore ALL grammar files
    if (runtimeConfiguration[configListName] === true) {
        return;
    }
    var exists = false;
    if (!runtimeConfiguration[configListName]) {
        runtimeConfiguration[configListName] = [];
    }
    else {
        exists = containsEntry(runtimeConfiguration[configListName], entry);
    }
    if (!exists) {
        runtimeConfiguration[configListName].push(entry);
    }
}
/**
 * check if settings entry should be excluded
 *
 * @param  {SettingsType} settingsType
 * @param  {Array<SettingsType>|RegExp} [excludeTypePattern] if not specified, always returns FALSE
 * @return {Boolean} TRUE if settings should be excluded
 */
function isExclude(settingsType, excludeTypePattern) {
    if (!excludeTypePattern) {
        return false;
    }
    if (Array.isArray(excludeTypePattern)) {
        return containsEntry(excludeTypePattern, settingsType);
    }
    return excludeTypePattern.test(settingsType);
}
module.exports = {
    setGrammarIgnored: function (runtimeConfiguration, grammarId) {
        addToConfigList(runtimeConfiguration, CONFIG_IGNORE_GRAMMAR_FILES, grammarId);
    },
    setGrammarAsyncExec: function (runtimeConfiguration, grammarIdOrEntry) {
        addToConfigList(runtimeConfiguration, CONFIG_GRAMMAR_ASYNC_EXEC, grammarIdOrEntry);
    },
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
    jsonSettingsFromDir: function (options, appRootDir, settingsList) {
        var dir = options && options.path;
        if (dir && !path_1.default.isAbsolute(dir)) {
            dir = path_1.default.resolve(appRootDir, dir);
        }
        var list = settingsList || [];
        if (dir) {
            readDir(dir, list, options);
        }
        return list;
    },
    // jsonSettingsFromOptions: function(options, appRootDir, settingsList){
    //
    // 	var list = settingsList || [];
    // 	addFromOptions(options, list, appRootDir);
    //
    // 	return list;
    // },
    createSettingsEntryFor: createSettingsEntryFor,
    createDefaultSettingsFor: createDefaultSettingsFor,
    normalizeConfigurations: normalizeConfigurations,
    getConfiguration: getConfiguration,
    getSettingsFor: getSettings,
    /** load settings file
     * NOTE: if updating s.value with the loaded data, need to update s.include and s.file accordingly!
     */
    loadSettingsFrom: readSettingsFile,
    getFileType: getFileType,
    getAllSpeechConfigsType: function () { return ALL_SPEECH_CONFIGS_TYPE; },
    /**
     * apply the "global" options from `options` or default values to the entries
     * from `settingsList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {SetttingsOptions} options the settings options
     * @param  {{Array<SettingsEntry>}} settingsList
     * @return {{Array<SettingsEntry>}}
     */
    applyDefaultOptions: function (options, settingsList) {
        settingsList.forEach(function (g) {
            [
                { name: 'include', defaultValue: 'inline' },
                { name: 'force', defaultValue: false },
            ].forEach(function (fieldInfo) {
                option_utils_1.default.applySetting(fieldInfo.name, g, options, fieldInfo.defaultValue);
            });
        });
        return settingsList;
    },
    addSettingsToAppConfig: function (settings, appConfig, directories, _resources, runtimeConfig, settingsOptions, ignoreMissingDictionaries) {
        if (!settings || settings.length < 1) {
            return;
        }
        //get speech-config settings that should be applied to speech-configs
        const iall = settings.findIndex(function (s) {
            return s.type === ALL_SPEECH_CONFIGS_TYPE;
        });
        let allSpeechSettings;
        if (iall !== -1) {
            allSpeechSettings = settings[iall];
            //remove from settings list (will be merged into each speech-config, see below)
            settings.splice(iall, 1);
        }
        const regExpExcludeType = settingsOptions && settingsOptions.excludeTypePattern;
        const dicts = ignoreMissingDictionaries ? null : new Map();
        settings.forEach(function (s) {
            if (isExclude(s.type, regExpExcludeType)) {
                return;
            }
            var aliasId = toAliasId(s);
            if (s.include === 'file' && lodash_1.default.isArray(s.file)) {
                doLoadAllFilesFor(s);
            }
            log('  adding setting (' + s.include + ') for ' + s.type + ' as ', aliasId); //DEBUG
            if (s.type === 'configuration') {
                if (!lodash_1.default.isEqual(s.value, runtimeConfig)) {
                    warn("WARN settings-utils: encountered multiple configuration.json definitions when applying to app-config: merging configuration, some values may get overwritten...");
                    lodash_1.default.merge(s.value, runtimeConfig);
                }
                //NOTE configuration.json entry is mandatory, i.e. already set in directories
                // directoriesUtil.addConfiguration(directories, aliasId);
            }
            else if (s.type === 'dictionary') {
                dicts && dicts.set(s.id, s);
                directories_utils_1.default.addDictionary(directories, aliasId);
            }
            else if (s.type === 'grammar') {
                directories_utils_1.default.addJsonGrammar(directories, aliasId);
            }
            else if (s.type === 'speech') {
                if (allSpeechSettings) {
                    if (s.include === 'file') {
                        if (!s.value) {
                            s.value = readSettingsFile(s.file, s.fileType);
                            log("  settings-utils: applying 'speech-all' settings: did load file resource for " + s.id + ": ", s.value);
                        }
                    }
                    //NOTE the speech-all settings are treat "weak", i.e. they should not overwrite other setting
                    // (1) merge into a temporary speech-config, where s.value overwrites speech-all settings if necessary
                    // (2) "apply" temporary speech-config to s
                    var temp = lodash_1.default.merge({}, allSpeechSettings.value, s.value);
                    lodash_1.default.merge(s.value, temp);
                }
                directories_utils_1.default.addSpeechConfig(directories, aliasId);
            }
            else if (s.type !== ALL_SPEECH_CONFIGS_TYPE) {
                warn("WARN settings-utils: encountered multiple unknown settings definitions when applying to app-config: ", s);
            }
            if (s.include === 'file') {
                module_config_init_1.default.addIncludeModule(appConfig, aliasId, s.file);
            }
            else {
                module_config_init_1.default.addAppSettings(appConfig, aliasId, s.value);
            }
        });
        //ensure that for each language there is a (possibly empty) dictionary
        if (!ignoreMissingDictionaries && !isExclude('dictionary', regExpExcludeType)) {
            var languages = directories_utils_1.default.getLanguages(directories);
            var missing = [];
            languages.forEach(function (l) {
                var dict = dicts.get(l);
                if (!dict && settingsOptions && settingsOptions.dictionary !== false) {
                    var dictEntry = createSettingsEntryFor('dictionary', createDefaultSettingsFor('dictionary', l), l);
                    missing.push(dictEntry);
                    settings.push(dictEntry);
                }
            });
            if (missing.length > 0) {
                // log("INFO settings-utils: adding missing dictionaries for : ", missing);
                this.addSettingsToAppConfig(missing, appConfig, directories, _resources, runtimeConfig, settingsOptions, true);
            }
        }
    },
    isExcludeType: isExclude,
    configEntryIgnoreGrammar: CONFIG_IGNORE_GRAMMAR_FILES,
    configEntryAsyncExecGrammar: CONFIG_GRAMMAR_ASYNC_EXEC,
    configEntryDisableGrammarStrictMode: CONFIG_GRAMMAR_DISABLE_STRICT_MODE
};
