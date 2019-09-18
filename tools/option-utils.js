
/**
 * HELPER: do set the field in options, if it is not explicitly specified, either
 * 				 to the globally specified value, or the default/fallback value for the field
 *
 * @param  {string} field the field name for the option
 * @param  {{[field: string]: any}} opt the element's options (e.g. GrammarOption)
 * @param  {{[field: string]: any}} globalOpt the global options for that type of element (e.g. GrammarOptions)
 * @param  {any} defaultValue the default value for the option/field (in case neither opt nor globalOpt for that field is defined)
 */
function applySetting(field, opt, globalOpt, defaultValue){
	if(typeof opt[field] === 'undefined'){
		if(typeof globalOpt[field] !== 'undefined'){
			opt[field] = globalOpt[field];
		} else if(typeof defaultValue !== 'undefined') {
			opt[field] = defaultValue;
		}
	}
}

module.exports = {
	applySetting: applySetting
}
