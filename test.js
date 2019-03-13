
var path = require('path');

//FIXME TEST
// const mmirAppConfig = void(0);//FIXME from commandline argument/env-var ...?

//FIXME TEST grammar options
var grammarOptions = {
	path: './test-data/config/languages',
	engine: 'pegjs',
	// asyncCompile: false,
	grammars: {
		ja: {ignore: true},
		de: {exclude: true},
		en: {engine: 'jscc', async: true},

		//specifying JSON grammar files directly
		testing: {engine: 'jscc', file: path.resolve('./test-data/config/languages/de/grammar.json')},
		testing2: {id: '!id warning!', asyncCompile: false, engine: 'jison', file: path.resolve('./test-data/config/languages/de/grammar.json_large-example')}
		// testing_id_collision TODO : {engine: 'jison', file: path.resolve('./test-data/config/languages/de/grammar.json_large-example')}

	}
};
//FIXME TEST view options
var viewOptions = {
	path: './test-data/views',
}
//FIXME TEST settings options:
var settingOptions = {
	path: path.resolve('./test-data/config'),
	// configuration: false,
	// speech: false,
	//TODO support "gobal" options for exclude, include:'file' (exepting grammars)
	grammar: {
		ja: {exclude: true}
	},
	// dictionary: true,
	speech: {
		de: {exclude: true},
		en: {include: 'file'}
	},
	dictionary: {
		ja: {include: 'file'}
	}
};
//FIXME TEST scxml options
var stateMachineOptions = {
	path: './test-data/config/statedef_large',
	ignoreErrors: true,
	models: {
		input: {
			mode: 'simple',
			file: './test-data/config/statedef_minimal/inputDescriptionSCXML.xml'
		},
		dialog: {
			// ignoreErrors: true,
			mode: 'extended'
		}
	}
};
//FIXME TEST controller options
var ctrlOptions = {
	path: './test-data/implementations_rm-bom/controllers',
	// addModuleExport: true,
	controllers: {
		application: {
			addModuleExport: true
		},
		calendar: {
			file: path.resolve('./test-data/implementations/controllers/calendar.js')
		},
		application2: false,
		application3: {exclude: true},
	}
}
//FIXME TEST controller options
var helperOptions = {
	path: './test-data/implementations_ORIG/helpers',
	addModuleExport: true,
	helpers: {
		calendarHelper: {exclude: false}
	}
}
//FIXME TEST controller options
var modelOptions = {
	path: './test-data/implementations_ORIG/models',
	// addModuleExport: true,
	models: {
		user: {addModuleExport: 'mmir.User'},
		calendarModel: {addModuleExport: 'mmir.CalendarModel'}
	}
}

//FIXME TEST app-configuratin
const mmirAppConfig = {

	grammars: grammarOptions,
	views: viewOptions,
	settings: settingOptions,
	stateMachines: stateMachineOptions,
	configuration: {language: 'en'},

	controllers: ctrlOptions,
	helpers: helperOptions,
	models: modelOptions,

	jquery: true,
	loadBeforeInit: ['mmirf/polyfill'],

	// //TEST parsing resource path & some custom settings:
	// resourcesPath: 'test-www',
	// resourcesPathOptions: {
	// 	addModuleExport: true,
	// 	// exclude: ['models', 'settings/grammar']
	// },
	// // models: false,
	// controllers: {
	// 	path: false,
	// 	controllers: {
	// 		application: {
	// 			addModuleExport: true
	// 		},
	// 		calendar: {
	// 			file: path.resolve('./test-data/implementations/controllers/calendar.js')
	// 		}
	// 	}
	// },
	//
	// includeModules: ['mmirf/jsccGen'],

// 	config: {
// 		'mmirf/inputManager': {
// 				scxmlDoc: 'mmirf/scxml/input',//'config/statedef/inputDescriptionSCXML.xml'
// 				// simple | mode
// 				mode: 'extended',
// 				//EXAMPLE: set module-specific log-level to 'info'
// //		  logLevel: 'info'
// 		},
// 		'mmirf/dialogManager': {
// 				scxmlDoc: 'mmirf/scxml/dialog',//'config/statedef/dialogDescriptionSCXML.xml'
// 				// simple | mode
// 				mode: 'extended',
// 				//EXAMPLE: set module-specific log-level to 'verbose'
// //		  logLevel: 'verbose'
// 		}
// 	}
};

// require('./utils/webpack-worker-loader-utils').apply(webpackConfig);
require('./index').apply(mmirAppConfig);
