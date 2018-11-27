
var core = require('mmirf/core');

var defaultConfig = {

  /** @memberOf mmir.require.config */
	baseUrl: './'

	//configurations for the modules:
	, config: {

		/** @memberOf mmir.require.config.moduleConfig */
	    'mmirf/inputManager': {
	        scxmlDoc: 'config/statedef/inputDescriptionSCXML.xml'
	        // simple | mode
	        , mode: 'extended'
	        //EXAMPLE: set module-specific log-level to 'info'
//		    , logLevel: 'info'
	    }
		/** @memberOf mmir.require.config.moduleConfig */
	    , 'mmirf/dialogManager': {
	        scxmlDoc: 'config/statedef/dialogDescriptionSCXML.xml'
	        // simple | mode
	        , mode: 'extended'
	        //EXAMPLE: set module-specific log-level to 'verbose'
//		    , logLevel: 'verbose'
	    }
	    , 'mmirf/simpleViewEngine': {
	    	//ID attribute when inserting simpleViewEngine style:
	    	cssId: 'simple-view'
	    	//the path to the css file for the simpleViewEngine style:
	    	, cssUrl: 'mmirf/vendor/styles/simpleViewLayout.css'
	    }

        //EXAMPLE: set module-specific log-level to 'warn'
	    //         log-levels: 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled'
	    //         or number:     0           1        2        3         4           5           6
//	    , 'mmirf/view': { logLevel: 'warn' }

	}
};

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

		core.require = function(module){
			return __webpack_require__(module);
		};
	}
};
