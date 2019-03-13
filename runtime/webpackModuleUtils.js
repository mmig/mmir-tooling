
var core = require('mmirf/core');

var defaultConfig = {

  /** @memberOf mmir.require.config */
	baseUrl: './',

	//configurations for the modules:
	config: {

		/** @memberOf mmir.require.config.moduleConfig */
	    'mmirf/inputManager': {
	        scxmlDoc: 'config/statedef/inputDescriptionSCXML.xml',
	        // simple | extended
	        mode: 'extended'
			},
		/** @memberOf mmir.require.config.moduleConfig */
	    'mmirf/dialogManager': {
	        scxmlDoc: 'config/statedef/dialogDescriptionSCXML.xml',
	        // simple | extended
	        mode: 'extended'
	    },
	    'mmirf/simpleViewEngine': {
	    	//ID attribute when inserting simpleViewEngine style:
	    	cssId: 'simple-view',
	    	//the path to the css file for the simpleViewEngine style:
	    	cssUrl: 'mmirf/vendor/styles/simpleViewLayout.css'
	    }

	}
};

function setIndex(list, index, val){
	if(index > -1){
		list[index] = val;
	}
}

// console.log('modules: ', __webpack_modules__)//DEBUG

module.exports = {
	init: function(appConfig){

		if(appConfig){

			var configList = appConfig.configList;
			var csize = configList? configList.length : 0;
			if(csize > 0){
				for(var i = 0; i < csize; ++i){
					core.config(configList[i]);
				}
			} else if(configList){
				core.config(configList);
			}

		}

		core.applyConfig(defaultConfig);

		var isArray = require('mmirf/util/isArray');

		/**
		 * requirejs/AMD-like require implementation
		 *
		 * @param  {Array<string>|string} [deps] single or list of dependencies
		 * @param  {Function} [onSuccess] success callback for async require (the callback's arguments corresponds to deps list)
		 * @param  {Function} [onError] error callback
		 * @return {any} if non-async require, the requested module
		 */
		core.require = function(deps, onSuccess, onError){
			var result;
			try{

				if(isArray(deps)){
					result = deps.map(function(dep){ return __webpack_require__(dep); });
					if(onSuccess){
						//simulate async callback invocation
						setTimeout(function(){
							onSuccess.apply(null, result);
						}, 0);
					}
				} else {
				 	result = __webpack_require__(deps);
				}

			} catch(err){

				if(onError){

					//simulate async callback invocation
					setTimeout(function(){
						onError.apply(null, err);
					}, 0);

				} else {

					throw err;
				}
			}
			return result;
		};

		/**
		 * requirejs/AMD-like define implementation
		 *
		 * @param  {string} name the module name/ID
		 * @param  {Array<string>} [deps] list of dependencies
		 * @param  {Function} factory the factory method for creating the module (the factory's arguments corresponds to deps list)
		 */
		core._define = function(name, deps, factory){

			var resolved, modIndex, reqIndex, expIndex;
			if(typeof deps === 'function'){
				factory = deps;
				deps = void(0);
			}
			if(isArray(deps)){
				resolved = deps.map(function(dep, index){
					switch(dep){
						case 'exports':
							expIndex = index;
							return null;
						case 'module':
							modIndex = index;
							return null;
						case 'require':
							reqIndex = index;
							return null;
					}
					return __webpack_require__(dep);
				});
			} else {
				resolved = [];
			}

			__webpack_modules__[name] = function(mod, exp, req){
				setIndex(resolved, modIndex, mod);
				setIndex(resolved, reqIndex, req);
				setIndex(resolved, expIndex, exp);
				var result = factory.apply(null, resolved);
				if(typeof result !== 'undefined'){
					mod.exports = result;
				}
			};
		};
	}
};
