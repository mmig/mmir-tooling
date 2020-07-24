import scxml from '@scion-scxml/scxml';
declare type ScxmlCompiler = typeof scxml;
interface FixedScxmlCompiler extends ScxmlCompiler {
    documentStringToModel: FixedDocumentStringToModel;
}
declare type DocumentStringToModel = typeof scxml.documentStringToModel;
declare type HandleRawModule = (url: string, rawModule: any, ...args: any[]) => void;
declare type FixedDocumentStringToModel = DocumentStringToModel & {
    __handleRawModule: DocumentStringToModel;
    handleRawModule: HandleRawModule;
};
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
export declare function fixRawCompileInjectDataModule(scxmlCompiler: ScxmlCompiler | FixedScxmlCompiler): FixedScxmlCompiler;
export {};
