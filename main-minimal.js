/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 *
 * 	Permission is hereby granted, free of charge, to any person obtaining a
 * 	copy of this software and associated documentation files (the
 * 	"Software"), to deal in the Software without restriction, including
 * 	without limitation the rights to use, copy, modify, merge, publish,
 * 	distribute, sublicense, and/or sell copies of the Software, and to
 * 	permit persons to whom the Software is furnished to do so, subject to
 * 	the following conditions:
 *
 * 	The above copyright notice and this permission notice shall be included
 * 	in all copies or substantial portions of the Software.
 *
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

define(['mmirf/core', 'mmirf/env', 'mmirf/util/deferred', 'mmirf/resources', 'mmirf/commonUtils', 'mmirf/configurationManager', 'mmirf/languageManager'
        , 'mmirf/semanticInterpreter',  'module'
    ],
    /**
     * Initializes the MMIR framework:
     * triggers {@link mmir.ready} when initialization has finished.
     *
     * @class
     * @name main
     * @memberof mmir
     * @private
     *
     * @requires require.config
     * @requires util/deferred
     *
     */
    function(mmir, env, deferred, res, commonUtils, configurationManager, languageManager
        , semanticInterpreter, module
){

    //export framework functions/objects:

    /** @memberOf mmir */
    mmir.res = res;
    /** @memberOf mmir */
    mmir.util = commonUtils;
    /** @memberOf mmir */
    mmir.conf = configurationManager;
    /** @memberOf mmir */
    mmir.semantic = semanticInterpreter;
    /** @memberOf mmir */
    mmir.notifier = void(0);
    /** @memberOf mmir */
    mmir.media = void(0);
    /** @memberOf mmir */
    mmir.dialog = void(0);
    /** @memberOf mmir */
    mmir.input = void(0);
    /** @memberOf mmir */
    mmir.dialogEngine = void(0);
    /** @memberOf mmir */
    mmir.inputEngine = void(0);
    /** @memberOf mmir */
    mmir.present = void(0);
    /** @memberOf mmir */
    mmir.ctrl = void(0);
    /** @memberOf mmir */
    mmir.model = void(0);

    /**
     * Main Initialization:
     * initializes mmir and exports its functions/modules to (gobal) mmir namespace
     *
     * @memberOf main
     */
    var mainInit = function(){

        //initialize the common-utils:
        commonUtils.init()//<- load directory structure

            .then(function() {

                return languageManager.init().then(function(langMng){
                    mmir.lang = langMng;
                });

            })

            .then(function(){

                /**
                 * Additional configuration for requirejs
                 * from configuration.json:
                 *  -> if property "config" is set, apply it as requirejs-config
                 *     before signaling READY
                 *  EXAMPLE:
                 *  the following entry (in config/configuration.json) would add
                 *  the dependency information for www/appjs/test.js as module "testConf"
                 *
                 * 	, "config": {
                 *     	"paths": {
                 *     		"testConf": "../appjs/test"
                 *     	}
                 *     }
                 *
                 * @type PlainObject
                 * @memberOf main
                 */
                var requireConfig = configurationManager.get('config');
                if(requireConfig){
                    mmir.require = require.config(requireConfig);
                }

                //"give signal" that the framework is now initialized / ready
                mmir.setInitialized();

            });


    };//END: mainInit(){...

    mainInit();

    return mmir;

});//END: define(...
