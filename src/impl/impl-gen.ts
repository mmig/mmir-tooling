
import { CompilerCallback , ImplementationCompilerOptions } from '../index.d';

import logUtils from '../utils/log-utils';
const log = logUtils.log;
// const warn = logUtils.warn;

function getExportCodeFor(varName: string): string {
    return '\n' +
                // 'if(typeof module !== "undefined" && module.exports) {' +
                    'module.exports = '+varName+';\n'
                // '}\n';
}

/**
 * compile/convert implementation (controller, helper, model) as module
 *
 * @param  {string} content the implementation code as string
 * @param  {string} implFile the path of the implementation file (for debugging/error information)
 * @param  {ImplLoadOptions} options the ImplLoadOptions with property mapping (list of ImplOptions)
 * @param  {Function} callback the callback when impl. compilation has been completed: callback(error | null, compiledImpl, map, meta)
 * @param  {any} [_map] source mapping (unused)
 * @param  {any} [_meta] meta data (unused)
 */
function compile(content: string, implFile: string, options: ImplementationCompilerOptions, callback: CompilerCallback, _map: any, _meta: any): void {

    const i = options.mapping.findIndex(function(impl){
        return impl.file === implFile;
    });
    const implInfo = options.mapping[i];

    log('mmir-impl-loader: options for resource -> ', implInfo);//DEBUG

    if(!implInfo || !implInfo.name){
        let error: string;
        if(options.mapping.length === 0){
            error = 'failed to parse implementation: empty list for impl. settings [{id: "the ID", file: "the file path", ...}, ...]';
        }
        else if(i === -1 || !implInfo){
            error = 'failed to parse implementation: could not find settings for impl. in impl.-settings list: '+JSON.stringify(options.mapping);
        } else if(!implInfo.name){
            error = 'failed to parse implementation: missing field name for impl: '+JSON.stringify(implInfo);
        } else {
            error = 'failed to parse implementation: invalid impl. settings in list: '+JSON.stringify(options.mapping);
        }
        callback(error);
        return;/////////////// EARLY EXIT /////////////////
    }

    let implCode: string = content;

    if(implInfo.addModuleExport){
        var name = typeof implInfo.addModuleExport === 'string'? implInfo.addModuleExport : implInfo.name;
        log('mmir-impl-loader: adding module.exports for resource '+implInfo.id+' -> ', name);//DEBUG
        implCode += getExportCodeFor(name);
    }


    // log('mmir-impl-loader: emitting code for '+implInfo.id+' -> ', content);//DEBUG

    callback(null, implCode, _map, _meta);
    return;
};

export = {
    compile: compile
}
