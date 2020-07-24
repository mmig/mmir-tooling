"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var log_utils_1 = __importDefault(require("../utils/log-utils"));
var warn = log_utils_1.default.warn;
;
/**
 * scxml currently does not correctly declare the datamodel variables
 * -> fix this by injecting the datamodel variables by intercepting documentStringToModel.handleRawModule(url, rawModule, ...)
 *
 * TODO detect if this fix is needed (e.g. when future versions of scion-scxml have fixed this internally)
 *
 * @param       {scxml} [scxmlCompiler] the scxml module, e.g. <code>require('@scion-scxml/scxml')</code>.
 * 																				If omitted, the default scxml module will be used, i.e. <code>require('@scion-scxml/scxml')</code>.
 * 																				If already applied once, multiple calls to this function will be ignored.
 */
function fixRawCompileInjectDataModule(scxmlCompiler) {
    if (!scxmlCompiler) {
        scxmlCompiler = require('@scion-scxml/scxml');
    }
    var fixedScxmlCompiler = scxmlCompiler;
    if (fixedScxmlCompiler.documentStringToModel.__handleRawModule) {
        return;
    }
    fixedScxmlCompiler.documentStringToModel.__handleRawModule = fixedScxmlCompiler.documentStringToModel.handleRawModule;
    fixedScxmlCompiler.documentStringToModel.handleRawModule = function (_url, rawModule) {
        var invokeConstructor;
        for (var i = rawModule.invokeConstructors.length - 1; i >= 0; --i) {
            invokeConstructor = rawModule.invokeConstructors[i];
            if (invokeConstructor.datamodel) {
                if (!lodash_1.default.isArray(invokeConstructor.module._children) || invokeConstructor.module._children.length < 3 || typeof invokeConstructor.module._children[2].add !== 'function') {
                    warn('[mmir-tooling] could not FIX scxml datamodel variable declaration, because of encountering unknown data structure. Please update mmir-tooling to fix this.');
                }
                else {
                    var injectionNode = invokeConstructor.module._children[2];
                    injectionNode.add(invokeConstructor.datamodel);
                    injectionNode.add('\n');
                }
            }
        }
        fixedScxmlCompiler.documentStringToModel.__handleRawModule.apply(scxmlCompiler.documentStringToModel, arguments);
    };
}
exports.fixRawCompileInjectDataModule = fixRawCompileInjectDataModule;
