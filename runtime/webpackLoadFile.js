
/**
 * HELPER "proxy" for mmirf/util/loadFile:
 *        check, if webpack has inlined the request resource
 *        -> is yes: return the inlined data
 *        -> if no: invoke the original loadFile implementation
 */

//retrieve the original implementation of loadFile (will be handled/redirected by webpack.NormalModuleReplacementPlugin)
var orig_loadFile = require('mmirf/util/loadFile__webpack_proxied');

//retrive the inlined resouces:
var settings = require('build-tool/webpack-app-config').settings;

var logger = require('mmirf/logger').create('mmirf/util/loadInlineResource');

function isInlined(url){
	return !!settings[url];
}

function invoke(isAsync, func, args){
	if(isAsync){
		setTimeout(function(){
			func.apply(null, args);
		}, 0);
	} else {
		func.apply(null, args);
	}
}

/**
 *
 * @param options
 * <pre>
 * {
 * 	url: STRING,
 * 	dataType: 'text' | 'json' | 'xml',
 * 	async: true | false,
 * 	success: function(data: STRING | OBJECT),
 * 	error: function(xhr, statusString, error),
 * 	data: SERIALZED_DATA_STRING
 * }
 * </pre>
 *
 */
module.exports = function(options){

	if(isInlined(options.url)){

		logger.debug('loading inline resource '+options.url);

		try {
			var result = settings[options.url];//require(options.url);
			options.success && invoke(options.async !== false, options.success, [result]);
		} catch(err){
			options.error && invoke(options.async !== false, options.error, [err, 'error', err+'']);
		}

	} else {

		return orig_loadFile(options);
	}

}
