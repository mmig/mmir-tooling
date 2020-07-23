import * as path from 'path';
import * as fs from 'fs-extra';
var _ = require ('lodash');
import fileUtils from '../utils/filepath-utils';

import appConfigUtils from '../utils/module-config-init';
import directoriesUtil from '../tools/directories-utils';
import optionUtils from '../tools/option-utils';

import logUtils from '../utils/log-utils';
var log = logUtils.log;
var warn = logUtils.warn;

//mode: 'controller' | 'helper' | 'model'
function readDir(mode, dir, list, options, generalOptions){

    var files = fs.readdirSync(dir);
    var dirs = [];
    // log('read dir "'+dir+'" -> ', files);

    files.forEach(function(p){

        var absPath = path.join(dir, p);
        if(fileUtils.isDirectory(absPath)){

            dirs.push(absPath);
            return false;

        } else {

            var normalized = fileUtils.normalizePath(absPath);
            var id = path.basename(absPath, '.js');
            switch(mode){
                case 'helper':
                    if(!/Helper$/.test(id)){
                        warn('impl-utils.addFromDirectory(): invalid file-name for helper '+id+' (must have suffix "Helper"): "'+normalized+'"!');
                        id += 'Helper';
                    }
                    break;
                case 'controller':	// intentional fall through
                case 'model':				// intentional fall through
                default:
                    break;
            }

            log('impl-utils.addFromDirectory(): parsing '+mode+' implemenation '+id+' at "'+normalized+'"');//DEBUG

            var opt = options && options[id];
            if((opt && (opt.exclude || opt.file) || opt === false)){
                //-> ignore/exclude this impl. file!
                log('impl-utils.addFromDirectory(): excluding '+mode+' implemenation '+id+' at "'+normalized+'"!');
                return;//////////////////// EARLY EXIT //////////////////
            }

            var modExport = opt && opt.addModuleExport;
            if(typeof modExport === 'undefined'){
                modExport = generalOptions.addModuleExport || false;
            }

            list.push({
                id: id,
                name: toImplName(id),
                type: mode,
                file: normalized,
                addModuleExport: modExport
            });
        }
    });

    // log('read sub-dirs -> ', dirs);
    var size = dirs.length;
    if(size > 0){
        for(var i = 0; i < size; ++i){
            readDir(mode, dirs[i], list, options, generalOptions);
        }
    }
}

function addFromOptions(implMap, list, appRootDir, generalOptions){

    var impl, entry;
    for(var id in implMap){

        impl = implMap[id];
        if(impl && impl.file && !impl.exclude){

            entry = _.cloneDeep(impl);
            if(!path.isAbsolute(entry.file)){
                entry.file = path.resolve(appRootDir, entry.file);
            }
            entry.file = fileUtils.normalizePath(entry.file);

            if(entry.id && entry.id !== id){
                warn('impl-utils.addFromOptions(): entry from implOptions for ID "'+id+'" has differing field id with value "'+entry.id+'", overwritting the id field with "'+id+'"!');//FIXME proper webpack error/warning
            }
            entry.id = id;

            if(!entry.name){
                entry.name = toImplName(id);
            }

            if(!/^(controller|helper|model)$/.test(entry.type)){
                warn('impl-utils.addFromOptions(): entry from implOptions for ID "'+id+'" has invalid type '+JSON.stringify(entry.type)+', overwritting the type field with "controller"!');//FIXME proper webpack error/warning
                entry.type = 'controller';
            }

            //TODO verify existence of entry.file?

            if(!contains(list, id, entry.type)){
                log('impl-utils.addFromOptions(): adding ', entry);//DEBUG
                list.push(entry)
            } else {
                warn('impl-utils.addFromOptions(): entry from implOptions for ID '+id+' already exists in implementation-list, ignoring entry!');//FIXME proper webpack error/warning
            }
        }
        else {//DEBUG
            log('impl-utils.addFromOptions(): entry for '+id+' has no file set -> ignore ', impl);//DEBU
        }
    }
}

function contains(implList, id, type){
    return implList.findIndex(function(item){
        return item.id === id && item.type === type;
    }) !== -1;
}

function toImplName(id){
    return id[0].toUpperCase() + id.substring(1);
}

function toAliasPath(impl){
    return path.normalize(impl.file).replace(/\.js$/i, '');
}

function toAliasId(impl){
    return 'mmirf/'+impl.type+'/'+impl.id;//FIXME formalize IDs for loading views in webpack (?)
}

export = {

    /**
     * [description]
     * @param  {"controller" | "helper" | "model"} mode the kind of implementation (modules) that the directory contains
     * @param  {ImplOptions} options the implementation options where
     * 										options.path: REQUIRED the directory from which to add the implementations, and has the following structure:
     * 																				<directory>/<module-id-1>.js
     * 																				<directory>/<module-id-2>.js
     * 																				...
     * 										options["controllers" | "helpers" | "models"]: OPTIONAL a map of impl. IDs, i.e. {[implID: string]: ImplOption} with specific options for processing the corresponding implementation:
     *														options[types][id].exclude {Boolean}: OPTIONAL if <code>true</code>, the corresponding implementation will be excluded
     *														options[types][id].addModuleExport {Boolean|String}: OPTIONAL if <code>true</code>, the implementation will be exported,
     *																																				i.e. will be made a "requireable module"; the exported variable will be the impl. name,
     *																																				or, if addModuleExport is a String, this String will be used.
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param {Array<ImplEntry>} [implList] OPTIONAL list of ImplEntry objects, to which the new entries (read from the options.directory) will be added
     * 																					if omitted, a new list will be created and returned.
     * 										ImplEntry.id {String}: the implementation ID
     * 										ImplEntry.name {String}: the implementation's name (usually the ID with capitalized first letter)
     * 										ImplEntry.type {"controller" | "helper" | "model"}: the implementation's type
     * 										ImplEntry.file {String}: the path to the implementation's file
     *										ImplEntry.addModuleExport {Boolean|String}: OPTIONAL if <code>true</code>, the implementation will be exported,
     *																																				i.e. will be made a "requireable module"; the exported variable will be the impl. name,
     *																																				or, if addModuleExport is a String, this String will be used.
     * @return {Array<ImplEntry>} the list of ImplEntry objects
     */
    implFromDir: function(mode, options, appRootDir, implList){

        var dir = options.path;
        if(!path.isAbsolute(dir)){
            dir = path.resolve(appRootDir, dir);
        }

        var list = implList || [];
        readDir(mode, dir, list, options[mode + 's'], options);

        return list;
    },
    /**
     * add implementations form options[mode+'s'] map {[implID: string]: ImplOption}, if the ImplOption has a <code>file</code> field set.
     * @param  {"controller" | "helper" | "model"} mode the kind of implementation (modules) that the directory contains
     * @param  {ImplOptions} options the implementation options with field options[mode+'s'], e.g. option.controllers for mode "controller"
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param  {{Array<ImplEntry>}} [implList] OPTIONAL
     * @return {{Array<ImplEntry>}}
     */
    implFromOptions: function(mode, options, appRootDir, implList){

        var list = implList || [];
        addFromOptions(options[mode + 's'], list, appRootDir, options);

        return list;
    },

    /**
     * apply the "global" options from `options` or default values to the entries
     * from `implList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {ImplOptions} options the implementation options
     * @param  {{Array<ImplEntry>}} implList
     * @return {{Array<ImplEntry>}}
     */
    applyDefaultOptions: function(options, implList){

        implList.forEach(function(impl){
            [
                {name: 'addModuleExport', defaultValue: false}
            ].forEach(function(fieldInfo){
                optionUtils.applySetting(fieldInfo.name, impl, options, fieldInfo.defaultValue);
            });

        });

        return implList;
    },

    /**
     * add implementations to (webpack) app build configuration
     *
     * @param  {Array<ImplEntry>} implList list of ImplEntry objects:
     * 										impl.id {String}: the impl id (usually the language code, e.g. "en" or "de")
     * 										impl.file {String}: the path to the JSON impl (from which the executable impl will be created)
     * @param  {[type]} appConfig the app configuration to which the implementations will be added
     * @param  {[type]} directories the directories.json representation
     * @param  {ResourcesConfig} _resources the resources configuration
     * @param  {[type]} runtimeConfiguration the configuration.json representation
     */
    addImplementationsToAppConfig: function(implList, appConfig, directories, _resources, _runtimeConfiguration){

        if(!implList || implList.length < 1){
            return;
        }

        implList.forEach(function(impl){

            var aliasId = toAliasId(impl);
            appConfigUtils.addIncludeModule(appConfig, aliasId, toAliasPath(impl));


            log('impl-utils.addImplementationsToAppConfig(): adding '+impl.type+' implemenation '+impl.id+': ['+aliasId+'] -> "'+toAliasPath(impl)+'"!');

            switch(impl.type){
                case 'controller':
                    directoriesUtil.addCtrl(directories, aliasId);
                    break;
                case 'helper':
                    directoriesUtil.addHelper(directories, aliasId);
                    break;
                case 'model':
                    directoriesUtil.addModel(directories, aliasId);
                    break;
                default:
                    warn('impl-utils.addImplementationsToAppConfig(): unknown type '+impl.type+' for implemenation '+impl.id+' at "'+impl.file+'"!');
                    break;
            }

        });
    }
};
