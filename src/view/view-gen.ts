
import { ViewEntry , ViewCompilerOptions , CompilerCallback } from '../index.d';
import { MmirModule, Controller as ControllerClass, View, Partial, Layout } from 'mmir-lib';

import * as mmir from '../mmir-init';
var Controller: typeof ControllerClass = (mmir as MmirModule).require('mmirf/controller');

import logUtils from '../utils/log-utils';
// const log = logUtils.log;
const warn = logUtils.warn;

///////////////////////////////////////////////////////////////////////////////

function getCtrl(viewInfo: ViewEntry): ControllerClass {
    var name = viewInfo.ctrlName;
    var constr = function(){};
    var def = {
        views: [],
        partials: [],
        layout: null
    };
    try {
        return new Controller(name, def, constr);
    } catch(err) {
        warn('WARN: deprecated Controller implementation, using context (ctx) instead of instance constructor...');
        var ctx = {};
        ctx[name] = constr;
        return new Controller(name, def, ctx as any);
    }
}
///////////////////////////////////////////////////////////////////////////////

/**
 * compile view defintion (eHTML) into an executable JS view
 *
 * @param  {string} content the view definition (eHTML) as string
 * @param  {string} viewFile the path of the view file (for debugging/error information)
 * @param  {ViewLoadOptions} options the ViewLoadOptions with property mapping (list of ViewOptions)
 * @param  {Function} callback the callback when view compilation has been completed: callback(error | null, compiledView, map, meta)
 * @param  {any} [_map] source mapping (unused)
 * @param  {any} [_meta] meta data (unused)
 */
function compile(content: string, viewFile: string, options: ViewCompilerOptions, callback: CompilerCallback, _map: any, _meta: any) {

    var i = options.mapping.findIndex(function(v){
        return v.file === viewFile;
    });
    var viewInfo = options.mapping[i];

    if(!viewInfo || !viewInfo.id){
        let error: string;
        if(options.mapping.length === 0){
            error = 'failed to parse view template: empty list for grammar settings [{id: "the ID", file: "the file path", ...}, ...]';
        }
        else if(i === -1 || !viewInfo){
            error = 'failed to parse view template: could not find settings for grammar in grammar-settings list: '+JSON.stringify(options.mapping);
        } else if(!viewInfo.id){
            error = 'failed to parse view template: missing field id for grammar: '+JSON.stringify(viewInfo);
        } else {
            error = 'failed to parse view template: invalid grammar settings in list: '+JSON.stringify(options.mapping);
        }
        callback(error, null, _map, _meta);
        return;/////////////// EARLY EXIT /////////////////
    }

    var strictMode = typeof viewInfo.strict === 'boolean'? viewInfo.strict : (options.config && typeof options.config.strict === 'boolean'? options.config.strict : true);

    var viewConstr = (mmir as MmirModule).require(viewInfo.viewImpl);
    var viewInstance: View | Partial | Layout;
    if(viewInfo.isLayout){
        viewInstance = new viewConstr(viewInfo.viewName, content);
    } else {
        var ctrl = getCtrl(viewInfo);
        // log('mmir-view-loader: creating view "'+viewInfo.viewName+'" for controller "'+viewInfo.ctrlName+'" -> ', ctrl);//DEBU
        viewInstance = new viewConstr(ctrl, viewInfo.viewName, content);
    }

    callback(null, '\n' + viewInstance.stringify(!strictMode) + '\n', _map, _meta);
    return;
};

export = {
    compile: compile
}
