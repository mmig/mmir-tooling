;(function (root, factory) {
		if (typeof define === 'function' && define.amd) {
				// AMD. Register as an anonymous module.
				define(function () {
						return factory();
				});
		} else if (typeof module === 'object' && module.exports) {
				// Node. Does not work with strict CommonJS, but
				// only CommonJS-like environments that support module.exports,
				// like Node.
				module.exports = factory();
		} else {
				// Browser globals
				root.mmirShimConfig = factory();
		}
}(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this, function () {

	return {
		paths: {
			/** @memberOf mmir.require.config.shim */
			  'mmirf/antlr3': 'vendor-sourcelibs/antlr3-all'
			, 'mmirf/ES3Lexer': 'sourcelibs/ES3Lexer'
			, 'mmirf/ES3Parser': 'sourcelibs/ES3Parser'
			, 'mmirf/scriptLexer': 'sourcelibs/MmirScriptLexer'
			, 'mmirf/scriptParser': 'sourcelibs/MmirScriptParser'
			, 'mmirf/contentLexer': 'sourcelibs/MmirScriptContentLexer'
			, 'mmirf/contentParser': 'sourcelibs/MmirScriptContentParser'
			, 'mmirf/templateLexer': 'sourcelibs/MmirTemplateLexer'
			, 'mmirf/templateParser': 'sourcelibs/MmirTemplateParser'
		},
		shim: {
			/** @memberOf mmir.require.config.shim */
			  'mmirf/antlr3':         {deps: ['mmirf/parsingResult'], exports : 'org'}

			, 'mmirf/ES3Lexer':       {deps: ['mmirf/antlr3'], init: function(org){ return ES3Lexer;} }
			, 'mmirf/ES3Parser':      {deps: ['mmirf/antlr3'], init: function(org){ return ES3Parser;} }
			, 'mmirf/scriptLexer':    {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptLexer;} }
			, 'mmirf/scriptParser':   {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptParser;} }
			, 'mmirf/contentLexer':   {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptContentLexer;} }
			, 'mmirf/contentParser':  {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptContentParser;} }
			, 'mmirf/templateLexer':  {deps: ['mmirf/antlr3'], init: function(org){ return MmirTemplateLexer;} }
			, 'mmirf/templateParser': {deps: ['mmirf/antlr3'], init: function(org){ return MmirTemplateParser;} }
		}
	}

}));
