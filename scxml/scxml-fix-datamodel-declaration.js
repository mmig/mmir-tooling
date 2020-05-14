

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
function _fixRawCompileInjectDataModule(scxmlCompiler){
	if(!scxmlCompiler){
		scxmlCompiler = require('@scion-scxml/scxml');
	}
	if(scxmlCompiler.documentStringToModel.__handleRawModule){
		return;
	}
	scxmlCompiler.documentStringToModel.__handleRawModule = scxmlCompiler.documentStringToModel.handleRawModule;
	scxmlCompiler.documentStringToModel.handleRawModule = function(_url, rawModule){
		var invokeConstructor;
		for(var i=rawModule.invokeConstructors.length-1; i >= 0; --i){
			invokeConstructor = rawModule.invokeConstructors[i];
			if(invokeConstructor.datamodel) {//FIXME russa
				var injectionNode = invokeConstructor.module._children[2];
				injectionNode.add(invokeConstructor.datamodel);
				injectionNode.add('\n');
			}
		}
		scxmlCompiler.documentStringToModel.__handleRawModule.apply(scxmlCompiler.documentStringToModel, arguments);
	}
}

module.exports = {
	fixRawCompileInjectDataModule: _fixRawCompileInjectDataModule
};
