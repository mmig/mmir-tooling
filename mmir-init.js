
var path = require('path');
var mmirLib = require('mmir-lib');

mmirLib.mmir.startModule = 'mmirf/main-minimal';
mmirLib.config.paths['mmirf/main-minimal'] = path.join(__dirname, 'main-minimal');

// console.log('########################## mmir-loader: set start module ', mmirLib.mmir.startModule);//, ', config-paths: ', mmirLib.config.paths);

var mmir = mmirLib.init();

//TODO detect debug/log-level setting when running in webpack ... for now statically set to 'warn'

mmir.require('mmirf/logger').setDefaultLogLevel('warn');

module.exports = mmir;
