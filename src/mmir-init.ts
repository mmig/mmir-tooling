
import { MmirModule, NodeMmirModule } from 'mmir-lib';

import path from 'path';
import mmirLib from 'mmir-lib';

// log('########################## mmir-loader: set start module ', mmirLib.mmir.startModule);//, ', config-paths: ', mmirLib.config.paths);

var mmir = (mmirLib as MmirModule as NodeMmirModule).init(function(mmir){

    mmir.startModule = 'mmirf/main-minimal';
    ((mmirLib as any)._config || mmirLib.config).paths['mmirf/main-minimal'] = path.join(__dirname, 'main-minimal');

    mmir.config({
        config: {
            'mmirf/configurationManager': {
                configuration: {}
            },
            'mmirf/commonUtils': {
                directories: {}
            }
        }
    });

});

//TODO detect debug/log-level setting when running in webpack ... for now statically set to 'warn'
mmir.require('mmirf/logger').setDefaultLogLevel('warn');

module.exports = mmir;
