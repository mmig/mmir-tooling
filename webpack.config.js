const path = require('path');
const webpack = require('webpack');

var webpackConfig = {
	mode: 'none',
	entry: './webpack-main.js', //'./main.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		library: "mmir",
		libraryTarget: "umd"
	}
};

//FIXME TEST
// const mmirAppConfig = void(0);//FIXME from commandline argument/env-var ...?

//FIXME TEST grammar options
var grammarOptions = {
	directory: './config/languages',
	engine: 'pegjs',
	grammars: {
		ja: {ignore: true},
		de: {exclude: true},
		en: {engine: 'jison', async: true},

		//specifying JSON grammar files directly
		testing: {engine: 'jscc', file: path.resolve('./config/languages/de/grammar.json')},
		testing2: {id: '!id warning!', engine: 'jison', file: path.resolve('./config/languages/de/grammar.json_large-example')}
		// testing_id_collision TODO : {engine: 'jison', file: path.resolve('./config/languages/de/grammar.json_large-example')}

	}
};
//FIXME TEST view options
var viewOptions = {
	directory: './views',
}
//FIXME TEST settings options:
var settingOptions = {
	directory: path.resolve('./config'),
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
	directory: './config/statedef_large',
	models: {
		input: {
			mode: 'simple',
			file: './config/statedef_minimal/inputDescriptionSCXML.xml'
		},
		dialog: {
			mode: 'extended'
		}
	}
};
//FIXME TEST controller options
var ctrlOptions = {
	directory: './implementations_rm-bom/controllers',
	// addModuleExport: true,
	controllers: {
		application: {
			addModuleExport: true
		},
		calendar: {
			file: path.resolve('./implementations/controllers/calendar.js')
		},
		application2: false,
		application3: {exclude: true},
	}
}
//FIXME TEST controller options
var helperOptions = {
	directory: './implementations_rm-bom/helpers',
	addModuleExport: true,
	helpers: {
		calendarHelper: {exclude: false}
	}
}
//FIXME TEST controller options
var modelOptions = {
	directory: './implementations_rm-bom/models',
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

// require('./webpack-worker-loader-config').apply(webpackConfig);
require('./webpack-config-apply').apply(webpack, webpackConfig, mmirAppConfig);

module.exports = webpackConfig;
