
import { StateOptions , StateModelBuildEntry , StateModelsBuildOption , StateModelMode , StateModelEntry , StateBuildOptions , BuildAppConfig , DirectoriesInfo , ResourceConfig , RuntimeConfiguration } from '../index.d';

import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import fileUtils from '../utils/filepath-utils';

import appConfigUtils from '../utils/module-config-init';
import directoriesUtil from '../tools/directories-utils';
import optionUtils from '../tools/option-utils';

import logUtils from '../utils/log-utils';
import { WebpackAppConfig } from '../index-webpack.d';
const log = logUtils.log;
const warn = logUtils.warn;

const DEFAULT_MODE = 'extended';

function readDir(dir: string, list: StateModelBuildEntry[], options: StateModelsBuildOption): void {

    const files = fs.readdirSync(dir);
    const dirs = [];

    //sort file list to prioritize 'dialog.xml' and 'input.xml' (i.e. put at the beginning of the list)
    const re = /^(dialog|input)\.xml$/i
    files.sort(function(f1, f2){
        if(f1 === f2) return 0;
        if(re.test(f1)) return -1;
        if(re.test(f2)) return 1;
        return f1.localeCompare(f2);
    });

    // log('read dir "'+dir+'" -> ', files);//DEBU

    files.forEach(function(p){
        const absPath = path.join(dir, p);
        if(fileUtils.isDirectory(absPath)){
            dirs.push(absPath);
            return false;
        } else if(/\.xml$/i.test(p)) {

            const normalized = fileUtils.normalizePath(absPath);

            let defModel: RegExpExecArray, id: string, modId: string;
            if(/^(dialog|input)(DescriptionSCXML)?\.xml$/i.test(p)){// BACKWARDS COMPATIBILITY: do also accept old/deprecated file names ...DescriptionSCXML.xml
                // -> state models for input- or dialog-manager
                defModel = /^(dialog|input)/i.exec(p);
                id = defModel[1].toLowerCase();
                modId = id === 'dialog'? 'mmirf/dialogManager' : 'mmirf/inputManager';
            } else {
                // -> custom state models
                const opt = options && options[id];
                id = opt && opt.id? opt.id : path.basename(p, path.extname(p));
            }

            const opt: StateModelBuildEntry = options && options[id];
            if(opt && (opt.exclude || opt.file)){
                //-> ignore/exclude this scxml!
                //  (if was not exlcuded, but file was specified -> will be added later in addFromOptions(..))
                log('scxml-utils.addFromDirectory(): excluding scxml file for '+id+' model at "'+normalized+'"!');//DEBUG
                return;//////////////////// EARLY EXIT //////////////////
            }

            if(opt && opt.id && opt.id !== id){
                warn('scxml-utils.addFromDirectory(): ignoring option id "'+opt.id+'", using default id "'+id+'" for ', normalized);
            }

            if(!modId){
                if(opt && opt.moduleId){
                    modId = opt.moduleId;
                } else {
                    log('scxml-utils.addFromDirectory(): no moduleId specified for "'+p+'", using ID "'+id+'" as module ID!');
                    modId = id;
                }
            } else if(defModel && opt && opt.moduleId && opt.moduleId !== modId){
                warn('scxml-utils.addFromDirectory(): ignoring option moduleId "'+opt.moduleId+'" for state model ID "'+id+'", using default moduleId "'+modId+'" instead!');
            }

            if(contains(list, id, modId)){
                warn('scxml-utils.addFromDirectory(): entry for ID '+id+' (module ID '+modId+') already exists in state model-list, ignoring state model in file '+normalized);
                return;//////////////////// EARLY EXIT //////////////////
            }

            list.push({
                id: id,
                moduleId: modId,
                file: normalized,
                mode: opt && opt.mode? opt.mode : DEFAULT_MODE,
                ignoreErrors: opt && typeof opt.ignoreErrors === 'boolean'? opt.ignoreErrors : void(0),
                force: opt && typeof opt.force === 'boolean'? opt.force : void(0),
                strict: opt && typeof opt.strict === 'boolean'? opt.strict : void(0)
            });
        } else {
            log('scxml-utils.addFromDirectory(): ignoring non-XML file '+absPath);//DEBUG
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

function addFromOptions(stateModels: StateModelsBuildOption, list: StateModelBuildEntry[], appRootDir: string): void {

    let s: StateModelBuildEntry, entry: StateModelBuildEntry, moduleId: string;
    for(var id in stateModels){

        s = stateModels[id];
        if(s && s.file && !s.exclude){

            entry = _.cloneDeep(s);
            if(!path.isAbsolute(entry.file)){
                entry.file = path.resolve(appRootDir, entry.file);
            }
            entry.file = fileUtils.normalizePath(entry.file);

            if(entry.id && entry.id !== id){
                warn('scxml-utils.addFromOptions(): entry from modelOptions for ID "'+id+'" has differing field id with value "'+entry.id+'", overwritting the id field with "'+id+'"!');//FIXME proper webpack error/warning
            }
            entry.id = id;

            //TODO verify existence of entry.file?

            if(!entry.moduleId){
                if(entry.id === 'dialog'){
                    entry.moduleId = 'mmirf/dialogManager';
                } else if(entry.id === 'input'){
                    entry.moduleId = 'mmirf/inputManager';
                } else {
                    log('scxml-utils.addFromOptions(): entry from modelOptions for ID "'+id+'" has has no module ID set, using ID "'+id+'" as module ID!');
                    entry.moduleId = id;
                }
            }
            moduleId = entry.moduleId;

            if(!contains(list, id, moduleId)){
                // log('scxml-utils.addFromOptions(): adding ', entry);//DEBU
                list.push(entry)
            } else {
                warn('scxml-utils.addFromOptions(): entry from modelOptions for ID '+id+' (module ID '+moduleId+') already exists in state model-list, ignoring entry!');//FIXME proper webpack error/warning
            }
        }
        // else {//DEBU
        // 	log('scxml-utils.addFromOptions(): entry for '+id+' has no file set -> ignore ', s);//DEBU
        // }
    }
}

/**
 * add (minimal) default state models for 'dialog' and/or 'input'
 *
 * @param kind the mode for the create default models, specified and other than 'minimal', a warning will be printed
 * @param list INOUT parameter: the list of state model entries, to which the created default models will be added
 * @param _appRootDir this path to app's root directory
 */
function addDefaults(kind: StateModelMode | 'minimal' | '', list: StateModelBuildEntry[], _appRootDir: string): void {

    //TODO support other types/kinds than "minimal" engines
    if(kind && kind !== 'minimal'){
        warn('WARN scxml-utils: only support "minimal" for default input- and dialog-engine!');
    }

    const inputEngine: StateModelBuildEntry = {
        id: 'input',
        moduleId: 'mmirf/inputManager',
        mode: 'extended',
        file: fileUtils.normalizePath(path.resolve(__dirname, '..', 'defaultValues/inputEngine.scxml'))
    };

    const dialogEngine: StateModelBuildEntry = {
        id: 'dialog',
        moduleId: 'mmirf/dialogManager',
        mode: 'extended',
        file: fileUtils.normalizePath(path.resolve(__dirname, '..', 'defaultValues/dialogEngine.scxml'))
    };

    list.push(inputEngine, dialogEngine);
}

function contains(list: StateModelBuildEntry[], id: string, moduleId: string){
    return list.findIndex(function(item){
        return item.id === id || item.moduleId === moduleId;
    }) !== -1;
}

function toAliasPath(stateModel: StateModelEntry): string {
    return path.normalize(stateModel.file);
}

function toAliasId(stateModel: StateModelBuildEntry): string {
    return 'mmirf/state/'+stateModel.id;
}

export = {

    /**
     * [description]
     * @param  {ScxmlOptions} options the SCXML model options where
     * 										options.path: REQUIRED the directory from which to add the scxml models, and has the following structure:
     * 																				<directory>/../dialog.xml
     * 																				<directory>/../input.xml
     * 																				...
     * 										options.models: OPTIONAL a map of SCXML model IDs, i.e. {[scxmlID: string]: ScxmlOption} with specific options for compiling the corresponding SCXML model:
     *														options.models[id].exclude {Boolean}: OPTIONAL if <code>true</code>, the corresponding SCXML model will be completely excluded, i.e. no executable state model will be compiled
     *																																				from the corresponding SCXML state model definition
     *														options.models[id].mode {"extended" | "simple"}: OPTIONAL run SCXML modle in "simple" or "extended" mode,
     *																																				DEFAULT: "extended"
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param {Array<ScxmlEntry>} [stateModels] OPTIONAL list of ScxmlEntry objects, to which the new entries (read from the options.directory) will be added
     * 																					if omitted, a new list will be created and returned.
     * 										ScxmlEntry.id {String}: the SCXML engine ID (one of "input" or "dialog")
     * 										ScxmlEntry.file {String}: the path to the SCXML file (from which the executable state model will be created)
     * 										ScxmlEntry.mode {"extended" | "simple"}: run SCXML modle in "simple" or "extended" mode, DEFAULT: "extended"
     * @return {Array<ScxmlEntry>} the list of ScxmlEntry objects
     */
    scxmlFromDir: function(options: StateOptions, appRootDir: string, stateModels: StateModelEntry[]): StateModelBuildEntry[] {

        var dir = options.path;
        if(!path.isAbsolute(dir)){
            dir = path.resolve(appRootDir, dir);
        }

        var list = stateModels || [];
        readDir(dir, list, options.models);

        return list;
    },

    scxmlFromOptions: function(options: StateOptions, appRootDir: string, stateModels: StateModelEntry[]): StateModelBuildEntry[] {

        var models = options.models;

        var list = stateModels || [];
        addFromOptions(models, list, appRootDir);

        return list;
    },

    scxmlDefaults: function(options: StateBuildOptions, appRootDir: string, stateModels: StateModelEntry[]): StateModelBuildEntry[] {

        const kind = options && options.defaultType;

        var list = stateModels || [];
        addDefaults(kind, list, appRootDir);

        return list;
    },

    /**
     * apply the "global" options from `options` or default values to the entries
     * from `stateModels` if its corresponding options-field is not explicitly specified.
     *
     * @param  {ScxmlOptions} options the state-models options
     * @param  {{Array<ScxmlEntry>}} stateModels
     * @return {{Array<ScxmlEntry>}}
     */
    applyDefaultOptions: function(options: StateOptions, stateModels: StateModelEntry[]): StateModelBuildEntry[] {

        stateModels.forEach(function(st){
            [
                {name: 'mode', defaultValue: DEFAULT_MODE},
                {name: 'ignoreErrors', defaultValue: false},
                {name: 'force', defaultValue: false},
                {name: 'strict', defaultValue: true}
            ].forEach(function(fieldInfo){
                optionUtils.applySetting(fieldInfo.name, st, options, fieldInfo.defaultValue);
            });

        });

        return stateModels;
    },

    /**
     * add SCXML models to (webpack) app build configuration
     *
     * @param  {Array<ScxmlEntry>} stateModels list of ScxmlEntry objects:
     * 										stateModel.id {String}: the SCXML id ("dialog" | "input")
     * 										stateModel.file {String}: the path to the SCXML file (from which the executable SCXML model will be created)
     * @param  {[type]} appConfig the app configuration to which the SCXML models will be added
     * @param  {[type]} directories the directories.json representation
     * @param  {ResourcesConfig} resources the resources configuration
     * @param  {[type]} _runtimeConfiguration the configuration.json representation
     */
    addStatesToAppConfig: function(stateModels: StateModelBuildEntry[], appConfig: WebpackAppConfig, directories: DirectoriesInfo, resources: ResourceConfig, _runtimeConfiguration: RuntimeConfiguration): void {

        if(!stateModels || stateModels.length < 1){
            return;
        }

        if(!appConfig.paths){
            appConfig.paths = {};
        }

        //use scion runtime for compiled SCXML models instead of scion compiler/runtime
        resources.paths['mmirf/scion'] = resources.paths['mmirf/scionRuntime'];

        // log('scxml-utils.addStateModelsToAppConfig(): set mmirf/scion module implementation to ', appConfig.paths['mmirf/scion']);//DEBU

        if(!appConfig.config){
            appConfig.config = {};
        }

        var stateIds = new Set();

        stateModels.forEach(function(s){

            if(stateIds.has(s.id)){
                warn('scxml-utils: there already is a state model for "'+s.id+'", omitting state model from: "'+s.file+'"');
                return;
            }
            stateIds.add(s.id);

            var aliasId = toAliasId(s);
            appConfigUtils.addIncludeModule(appConfig, aliasId, toAliasPath(s));
            directoriesUtil.addStateModel(directories, aliasId);
            if((appConfig as BuildAppConfig).includeStateModelXmls){
                directoriesUtil.addStateModelXml(directories, aliasId);
            }

            var configId = s.moduleId;
            if(!appConfig.config[configId]){
                appConfig.config[configId] = {};
            }
            if(appConfig.config[configId].modelUri){
                if(appConfig.config[configId].modelUri !== aliasId){
                    warn('scxml-utils: state model for "'+s.id+'" is already set to "'+appConfig.config[configId].modelUri+'", omitting configuration to load from module ID "'+aliasId+'"');
                }
                // else {//DEBU
                // 	log(' scxml-utils: SCXML model for "'+s.id+'" is already set to "'+aliasId+'", do nothing ...');//DEBU
                // }
            } else {
                // log(' scxml-utils: setting SCXML model for "'+s.id+'" to "'+aliasId+'", do nothing ...');//DEBU

                appConfig.config[configId].modelUri = aliasId;
            }

            if(!appConfig.config[configId].mode){
                // log(' scxml-utils: setting mode for SCXML model "'+s.id+'" to default mode: ', JSON.stringify(s.mode || DEFAULT_MODE));//DEBU

                appConfig.config[configId].mode = s.mode || DEFAULT_MODE;
            } else if(s.mode) {
                warn('scxml-utils: SCXML model mode for "'+s.id+'" is already set to "'+appConfig.config[configId].mode+'", omitting mode-setting ', JSON.stringify(s.mode));
            }

        });
    }
};
