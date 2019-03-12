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
				root.mmirDevConfig = factory();
		}
}(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this, function () {

	return {
		paths: {
			  'mmirf/jscc': 'modified-vendor-sourcelibs/jscc-amd'
			, 'mmirf/pegjs': 'modified-vendor-sourcelibs/peg-0.10.0'
			, 'mmirf/require': 'modified-vendor-sourcelibs/require'
			, 'mmirf/stacktrace': 'modified-vendor-sourcelibs/stacktrace-v2.0.0'
		}
	}

}));
