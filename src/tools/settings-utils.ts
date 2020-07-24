
import { SettingsBuildOptions , SettingsType , SettingsBuildEntry , SettingsBuildEntryMultiple , RuntimeConfiguration , AsyncGramarExecEntry , DirectoriesInfo , ResourceConfig , BuildAppConfig , SettingsOptions } from '../index.d';
import { Grammar , SpeechConfig } from 'mmir-lib';

import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import promise from '../utils/promise';
import fileUtils from '../utils/filepath-utils';

import appConfigUtils from '../utils/module-config-init';

import directoriesUtil from './directories-utils';
import optionUtils from './option-utils';

import logUtils from '../utils/log-utils';
const log = logUtils.log;
const warn = logUtils.warn;

import defaultSettingsConfiguration from '../defaultValues/settings/configuration';
import defaultSettingsDictionary from '../defaultValues/settings/dictionary';
import defaultSettingsGrammar from '../defaultValues/settings/grammar';
import defaultSettingsSpeech from '../defaultValues/settings/speech';

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
function readDir(dir: string, list: SettingsBuildEntry[], options: SettingsOptions): void {

    var files = fs.readdirSync(dir);
    var dirs = [];
    // log('read dir "'+dir+'" -> ', files);

    files.forEach(function(p){

        var absPath = path.join(dir, p);
        if(fileUtils.isDirectory(absPath)){

            dirs.push(absPath);
            return false;

        } else if(/(configuration|dictionary|grammar|speech)\.js(on)?$/i.test(absPath)){

            let id: string, type: SettingsType;
            if(isSettingsType('configuration', absPath)){
                type = 'configuration';
            } else {
                type = getTypeFrom(absPath);
                id = getIdFor(absPath);
            }

            let isAdd = true;
            let isInline = true;
            let isForce: boolean;//default for force: undefined

            if(options){

                isInline = !/file/i.test(options.include);

                if(options[type] === false){
                    isAdd = false;
                } else if(options[type] && (!id || options[type][id])){
                    var conf = id? options[type][id] : options[type];
                    isAdd = !conf.exclude;
                    isInline = typeof conf.include !== 'undefined'? !/file/i.test(conf.include) : isInline;
                    isForce = conf.force;
                }
            }

            if(isAdd){
                if(type !== 'configuration' && contains(list, type, id)){

                    warn('ERROR settings-utils: encountered multiple entries for '+type+' setting for ID '+id+', ignoring '+absPath);

                } else {
                    var normalized = fileUtils.normalizePath(absPath);
                    var fileType = getFileType(normalized);
                    list.push({
                        type: type,
                        id: id,
                        file: normalized,
                        fileType: fileType,
                        value: isInline? readSettingsFile(normalized, fileType) : void(0),
                        include: isInline? 'inline' : 'file',
                        force: isForce
                    });
                }
            }
        }

    });

    // log('read sub-dirs -> ', dirs);
    var size = dirs.length;
    if(size > 0){
        for(var i = 0; i < size; ++i){
            readDir(dirs[i], list, options);
        }
    }
}

// function addFromOptions(settings, list, appRootDir){
// 	//TODO
// }

function isSettingsType(type: SettingsType, filePath: string): boolean {
    return new RegExp('^' +  type  + '\.json$', 'i').test(path.basename(filePath));
}

function getTypeFrom(settingsFilePath: string): SettingsType {
    return path.basename(settingsFilePath).replace(/\.js(on)?$/, '') as SettingsType;
}

function getIdFor(settingsFilePath: string): string {
    return path.basename(path.dirname(settingsFilePath));
}

function getFileType(filePath: string): 'js' | 'json' {
    return /\.js$/i.test(filePath)? 'js' : 'json';
}


/**
 * read settings file as JSON or "plain" CommonJS module and return PlainObject
 *
 * @param  {string} filePath the filePath
 * @param  {'json' | 'js'} [fileType] OPTIONAL if omitted, will be derived from filePath (DEFAULT: 'json')
 * @param  {boolean} [async] OPTIONAL (positional argument!) if settings file should be read async (which will return Promise)
 * @return {{[field: string]: any} | Promise<{[field: string]: any}>} the settings object (or if async, a Promise that resolves to the settings object)
 */
function readSettingsFile(filePath: string, fileType?: 'json' | 'js', async?: boolean): any {
    fileType = fileType || getFileType(filePath);
    if(fileType === 'js'){
        return !async? requireJson(filePath) : new promise(function(resolve){resolve(requireJson(filePath))});
    } else {
        return !async? readJsonSync(filePath) : readJsonAsync(filePath);
    }
}

//TODO wrap try/catch -> print webpack-error
function requireJson(filePath: string): any {
    try{
        return require(filePath);
    } catch (err){
        logUtils.warn('cannot load module contents as JSON-like object from ', filePath);
        throw err;
    }
}

function readJsonSync(filePath: string): any {
    // log('reading ', filePath);//DEBU
    var buffer = fs.readFileSync(filePath);
    return binToJsonObj(buffer, filePath);
}

async function readJsonAsync(filePath: string): Promise<any> {
    // log('reading ', filePath);//DEBU
    return new promise(function(resolve, reject){
        fs.readFile(filePath, function(err, buffer){
            if(err){
                return reject(err);
            }
            resolve(binToJsonObj(buffer, filePath));
        });
    });
}

//TODO wrap try/catch -> print webpack-error
function binToJsonObj(buffer: Buffer, filePath: string): any {
    var enc = detectByteOrder(buffer);
    var content = buffer.toString(enc);
    // var content = toUtfString(buffer, enc);// buffer.toString(enc);
    content = removeBom(content);
    // log('encoding '+enc+' -> ', JSON.stringify(content));//DEBU
    try{
        return JSON.parse(content);
    } catch (err){
        logUtils.warn('cannot parse file contents as JSON from ', filePath);
        throw err;
    }
}

function detectByteOrder(buffer: Buffer): BufferEncoding {
    //from https://docs.microsoft.com/en-us/windows/desktop/Intl/using-byte-order-marks:
    //
    // Byte order mark 		Description
    // EF BB BF 					UTF-8
    // FF FE 							UTF-16, little endian
    // FE FF 							UTF-16, big endian
    // FF FE 00 00 				UTF-32, little endian
    // 00 00 FE FF 				UTF-32, big-endian
    if(buffer[0] === 239 /*EF*/ && buffer[1] === 187 /*BB*/ && buffer[2] === 191 /*BF*/){
        return 'utf8';
    // } else if(buffer[0] === 255 /*FF*/ && buffer[1] === 254 /*FE*/ && buffer[2] === 0 /*00*/ && buffer[3] === 0 /*00*/){
    // 	return 'utf32le';
    // } else if(buffer[0] === 0 /*00*/ && buffer[1] === 0 /*00*/ && buffer[2] === 254 /*FE*/ && buffer[3] === 255 /*FF*/){
    // 	return 'utf32be';
    } else if(buffer[0] === 255 /*FF*/ && buffer[1] === 254 /*FE*/){
        return 'utf16le';
    } else if(buffer[0] === 254 /*FE*/ && buffer[1] === 255 /*FF*/){
        return 'utf16be' as BufferEncoding;
    }
    //try utf8 anyway...
    return 'utf8'
}

// function toUtfString(buffer, enc){
// 	var penc = enc.replace('utf', 'utf-');
// 	// var Iconv = require('iconv').Iconv;
// 	// var iconv = new Iconv(penc, 'UTF-8');
// 	// return iconv.convert(buffer).toString();
// 	import iconv from 'iconv-lite';
import { WebpackAppConfig } from '../index-webpack.d';
// 	return iconv.decode(buffer, enc);
// }

function removeBom(content: string): string {
    // log('remove BOM? -> ', content.codePointAt(0), content.codePointAt(1), content.codePointAt(2), content.codePointAt(3), content.codePointAt(4));//DEBU
    if(content.codePointAt(0) === 65279 /*FEFF*/ || content.codePointAt(0) === 65534 /*FFFE*/){
        content = content.substring(1);
        // log('removed BOM!');//DEBU
    }
    return content;
}

/**
 * HELPER load all files for settings-entry
 * @param  {SettingsEntry} s NOTE s.file MUST be an Array!
 */
function doLoadAllFilesFor(s: SettingsBuildEntryMultiple){
    if(!s.value){
        warn('WARN settings-utils: forced merging for "'+s.id+'" ('+s.type+') with multiple file resources: content not loaded yet, loading file content and merging now...');
        if(Array.isArray(s.file)){
            var content = {};
            s.file.forEach(function(f){
                _.merge(content, readSettingsFile(f));
            });
            s.value = content;
        } else {
            warn('WARN settings-utils: could not merge files for "'+s.id+'" ('+s.type+') since there is no file list: ', s.file);
        }
    } else {
        log('settings-utils: multiple file resources for "'+s.id+'" ('+s.type+') already merged to ', s.value);
    }
}

function contains(list: SettingsBuildEntry[], settingsType: SettingsType, settingsId: string): boolean {
    return list.findIndex(function(item){
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
function containsEntry(list: Array<string | &{id: string}>, value: string | &{id: string}): boolean {
    var id = typeof value === 'string'? value : value.id;
    return list.findIndex(function(item){
        return ((typeof item === 'string'? item : item.id) === id);
    }) !== -1;
}

function normalizeConfigurations(settingsList: SettingsBuildEntry[]): void {
    var c: SettingsBuildEntry, conf: SettingsBuildEntryMultiple;
    for(var i = 0, size = settingsList.length; i < size; ++i){
        c = settingsList[i];
        if(c.type === 'configuration'){
            if(conf){

                // log("INFO settings-utils: encountered multiple configuration.json definition: merging configuration, some values may get overwritten");//DEBU

                //if "include" was set to "file", the file contents have not been loaded yet
                if(!conf.value){
                    conf.value = readSettingsFile(Array.isArray(conf.file)? conf.file[0] : conf.file, conf.fileType);
                }
                if(!c.value){
                    c.value = readSettingsFile(c.file, c.fileType);
                }

                //merge configuration values:
                _.merge(conf.value, c.value);

                //"merge" file-fields:
                if(!conf.file){
                    conf.file = [];
                } else if(!_.isArray(conf.file)){
                    conf.file = [conf.file];
                }
                if(c.file){
                    conf.file.push(c.file)
                }
                //remove merged configuration from list & adjust i & size
                settingsList.splice(i--, 1);
                --size;
            } else {
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
function createSettingsEntryFor(type: SettingsType, value: any, id?: string): SettingsBuildEntry {
    return {type: type, file: 'settings://'+type+'/options' + (id? '/'+id : ''), include: void(0), value: value, id: id};
}

function getConfiguration(settingsList: SettingsBuildEntry[]): SettingsBuildEntryMultiple | undefined {
    return settingsList.find(function(item){ return item.type === 'configuration'});
}

function getSettings(settingsList: SettingsBuildEntry[], type: SettingsType): SettingsBuildEntry[] {
    return settingsList.filter(function(item){ return item.type === type});
}

/**
 * HELPER create default for settings type
 *
 * @param  {SettingsType} type the type of settings object, e.g. "speech" or "configuration"
 * @param  {String} id if more than 1 settings-entry for this type can exist, its ID
 * @return {any} the (default) settings value for id
 */
function createDefaultSettingsFor(type: SettingsType | string, id: string): RuntimeConfiguration | Grammar | {[dictKey: string]: string} | SpeechConfig {
    switch(type){
        case 'configuration':
            return defaultSettingsConfiguration.getDefault();
        case 'dictionary':
            return defaultSettingsDictionary.getDefault(id);
        case 'grammar':
            return defaultSettingsGrammar.getDefault(id);
        case 'speech':
            return defaultSettingsSpeech.getDefault(id);
    }

    warn("WARN settings-utils.createDefaultSettingsFor(): encountered unknown settings type "+type+" (id: "+id+"), using empty object as default value");
    return {};
}

function toAliasId(settings: SettingsBuildEntry): string {
    return 'mmirf/settings/' + settings.type + (settings.id? '/' + settings.id : '');//FIXME formalize IDs for loading views in webpack (?)
}

function addToConfigList(runtimeConfiguration: RuntimeConfiguration, configListName: string, entry: string | {id: string, [field: string]: any}): void {

    //NOTE: special treatment for value TRUE:
    //     in case a config-list is set to TRUE, it means that
    //     it should be interpreted, as if the config-list contains
    //     all possible values, e.g. for "ignoreGrammarFiles" -> do ignore ALL grammar files
    if(runtimeConfiguration[configListName] === true){
        return;
    }

    var exists = false;
    if(!runtimeConfiguration[configListName]){
        runtimeConfiguration[configListName] = [];
    } else {
        exists = containsEntry(runtimeConfiguration[configListName], entry);
    }

    if(!exists){
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
function isExclude(settingsType: SettingsType, excludeTypePattern: Array<SettingsType> | RegExp): boolean {
    if(!excludeTypePattern){
        return false;
    }
    if(Array.isArray(excludeTypePattern) ){
        return containsEntry(excludeTypePattern, settingsType);
    }
    return excludeTypePattern.test(settingsType);
}

export = {

    setGrammarIgnored: function(runtimeConfiguration: RuntimeConfiguration, grammarId: string): void {

        addToConfigList(runtimeConfiguration, CONFIG_IGNORE_GRAMMAR_FILES, grammarId);
    },
    setGrammarAsyncExec: function(runtimeConfiguration: RuntimeConfiguration, grammarIdOrEntry: string | AsyncGramarExecEntry): void {

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
    jsonSettingsFromDir: function(options: SettingsOptions | SettingsBuildOptions | false, appRootDir: string, settingsList?: SettingsBuildEntry[]): SettingsBuildEntry[] {

        var dir = options && options.path;
        if(dir && !path.isAbsolute(dir)){
            dir = path.resolve(appRootDir, dir);
        }

        var list = settingsList || [];
        if(dir){
            readDir(dir, list, options as SettingsOptions);
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
    getAllSpeechConfigsType: function(): 'speech-all' { return ALL_SPEECH_CONFIGS_TYPE; },
    /**
     * apply the "global" options from `options` or default values to the entries
     * from `settingsList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {SetttingsOptions} options the settings options
     * @param  {{Array<SettingsEntry>}} settingsList
     * @return {{Array<SettingsEntry>}}
     */
    applyDefaultOptions: function(options: SettingsBuildOptions, settingsList: SettingsBuildEntry[]): SettingsBuildEntry[] {
        settingsList.forEach(function(g){
            [
                {name: 'include', defaultValue: 'inline'},
                {name: 'force', defaultValue: false},
            ].forEach(function(fieldInfo){
                optionUtils.applySetting(fieldInfo.name, g, options, fieldInfo.defaultValue);
            });

        });

        return settingsList;
    },
    addSettingsToAppConfig: function(settings: SettingsBuildEntry[], appConfig: BuildAppConfig | WebpackAppConfig, directories: DirectoriesInfo, _resources: ResourceConfig, runtimeConfig: RuntimeConfiguration, settingsOptions: SettingsOptions | SettingsBuildOptions | false, ignoreMissingDictionaries?: boolean){

        if(!settings || settings.length < 1){
            return;
        }

        //get speech-config settings that should be applied to speech-configs
        const iall = settings.findIndex(function(s){
            return s.type === ALL_SPEECH_CONFIGS_TYPE;
        });
        let allSpeechSettings: SettingsBuildEntry;
        if(iall !== -1){
            allSpeechSettings = settings[iall];
            //remove from settings list (will be merged into each speech-config, see below)
            settings.splice(iall, 1);
        }

        const regExpExcludeType = settingsOptions && settingsOptions.excludeTypePattern;
        const dicts = ignoreMissingDictionaries? null : new Map();

        settings.forEach(function(s){

            if(isExclude(s.type, regExpExcludeType)){
                return;
            }

            var aliasId = toAliasId(s);

            if(s.include === 'file' && _.isArray(s.file)){
                doLoadAllFilesFor(s);
            }

            log('  adding setting ('+s.include+') for '+s.type+' as ', aliasId);//DEBUG

            if(s.type === 'configuration'){

                if(!_.isEqual(s.value, runtimeConfig)){
                    warn("WARN settings-utils: encountered multiple configuration.json definitions when applying to app-config: merging configuration, some values may get overwritten...");
                    _.merge(s.value, runtimeConfig);
                }
                //NOTE configuration.json entry is mandatory, i.e. already set in directories
                // directoriesUtil.addConfiguration(directories, aliasId);

            } else if(s.type === 'dictionary'){
                dicts && dicts.set(s.id, s);
                directoriesUtil.addDictionary(directories, aliasId)
            } else if(s.type === 'grammar'){
                directoriesUtil.addJsonGrammar(directories, aliasId)
            } else if(s.type === 'speech'){
                if(allSpeechSettings){
                    if(s.include === 'file'){
                        if(!s.value){
                            s.value = readSettingsFile(s.file, s.fileType);
                            log("  settings-utils: applying 'speech-all' settings: did load file resource for "+s.id+": ", s.value);
                        }
                    }
                    //NOTE the speech-all settings are treat "weak", i.e. they should not overwrite other setting
                    // (1) merge into a temporary speech-config, where s.value overwrites speech-all settings if necessary
                    // (2) "apply" temporary speech-config to s
                    var temp = _.merge({}, allSpeechSettings.value, s.value);
                    _.merge(s.value, temp);
                }
                directoriesUtil.addSpeechConfig(directories, aliasId)
            } else if(s.type !== ALL_SPEECH_CONFIGS_TYPE) {
                warn("WARN settings-utils: encountered multiple unknown settings definitions when applying to app-config: ", s);
            }

            if(s.include === 'file'){
                appConfigUtils.addIncludeModule(appConfig, aliasId, s.file);
            } else {
                appConfigUtils.addAppSettings(appConfig, aliasId, s.value);
            }
        });


        //ensure that for each language there is a (possibly empty) dictionary
        if(!ignoreMissingDictionaries && !isExclude('dictionary', regExpExcludeType)){
            var languages = directoriesUtil.getLanguages(directories);
            var missing = [];
            languages.forEach(function(l){
                var dict = dicts.get(l);
                if(!dict && settingsOptions && settingsOptions.dictionary !== false){
                    var dictEntry = createSettingsEntryFor('dictionary', createDefaultSettingsFor('dictionary', l), l);
                    missing.push(dictEntry);
                    settings.push(dictEntry)
                }
            });
            if(missing.length > 0){
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
