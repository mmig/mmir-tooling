mmir-tooling
============

[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![GitHub package.json version](https://img.shields.io/github/package-json/v/mmig/mmir-lib)


The [mmir-tooling][1] repository holds files, resources etc. for
building [mmir][2]-based applications.

----

### API Documentation

See generated [API documentation][9] (or more detailed [HTML][10] documentation) and details below.

### Dependencies

The current build process requires the **[mmir-lib][3] version 5.0.0 or later**

By default the build process will assume that the `mmir`-based application is
located at `www/`:

    www/config/
              configuration.json
              languages/
                        <lang1>/grammar.json
                                speech.json
                                dictionary.json
                        <lang2>/grammar.json
                                speech.json
                                dictionary.json
              states/
                     dialog.xml
                     input.xml
    www/controller/*
    www/views/*
    ...

If the `mmir` resources are located in different directories/files, they need
to be specified in the build configuration.

### Prerequisites

 * Node.js

### Installation

Install `mmir-tooling` via `npm`.

See sections below for integrating `mmir-lib` into
various frameworks / build-systems.

For a setup without a (supported) build-system or framework,
see section ["Bare-bones" `mmir-lib` Integration](#bare-bones-mmir-lib-integration).


### Webpack Build Integration

For [webpack][5]-based applications, [mmir-webpack][4] can be used.


### Cordova Build Integration

__NOTE__ if the `cordova` app is packaged by `webpack`, the `mmir-webpack`
         integration should be used instead (see section above).

For automatically building the `mmir` resources in a [cordova][7]-based app, the
build-script `mmir-tooling/utils/cordova-build-tool.js` can be included as
`prepare hook`, i.e. in `config.xml`:
```xml
<hook type="before_prepare" src="node_modules/mmir-tooling/utils/cordova-build-tool.js" />
```

This will by default parse the `www/` directory for `mmir` resources
(grammars, dictionaries, view templates, etc)  and compile them if necessary.
Note, this would be the same build configuration as using
`{resourcesPath: projectRootDir + '/www'}`.

Optionally, additional build configuration for `mmir` can be specified by creating
the file `mmir.build.config.js` (in the project root) in which the `mmir` build
configuration is exported via `module.exports`, e.g. something like

```javascript
var path = require('path');

//custom options for grammars
const grammarOptions = {

  // parse directory test-data/grammars/ for JSON grammar definitions
  //  (instead of default (see below) <resourcesPath>/config/languages/)
  path: path.resolve(__dirname, 'test-data/grammars'),
  // use grammar engine 'pegjs' for compiling grammars (instead of default 'jscc')
  engine: 'pegjs',
  // set some custom per-grammar options:
  //  the grammar IDs are derived from the directory name when parsing the path, i.e.
  //  test-data/grammars/<grammar ID>/grammar.json
  grammars: {
    //do ignore grammar for "ja" (i.e. not load when app starts)
    ja: {ignore: true},
    //do completly exclude (i.e. not compile) grammar for "de"
    de: {exclude: true},
    //use grammar engine 'jscc' for grammar "en" (instead of general configured 'pegjs')
    en: {engine: 'jscc'},
    //for grammar "testing": specify JSON grammar file directly & use grammar engine 'jison'
    testing: {engine: 'jison', file: path.resolve(__dirname, 'custom/my-testing-grammar.json')}
  }
};

//custom options for state models
var stateOptions = {
  models: {
    //compile custom state machine calendarStates from SCXML definition at
    // test-data/states/calendarDescriptionSCXML.xml
    calendarStates: {
      file: path.resolve(__dirname, 'test-data/states/calendarDescriptionSCXML.xml')
    }
  }
};

const mmirAppConfig = {

  //instead of parsing 'www/', parse directory 'mmir-res/' for mmir resources
  resourcesPath: path.resolve(__dirname, 'mmir-res'),

  //set custom options for grammars in build configuration
  grammars: grammarOptions,

  //set custom options for state machines in build configuration
  states: stateOptions
};

module.exports = mmirAppConfig;
```

NOTE: if the `cordova` app is built with `webpack`, the [mmir-webpack][4]
      integration should be used instead.

### "Bare-bones" `mmir-lib` Integration

If the application does not use a build-system like `webpack`, and cannot
utilize the `node` / `npm` package directly, the `mmir-lib` library files
can be simply copied into the application directory:  
copy the `mmir-lib/lib/` directory into a sub-directory `mmirf/` of the
application directory.

Alternatively, `mmir-tooling` provides the simple command line tool
`mmirinstall` for this:  
the following steps would install the `mmir-lib` library files
into the application directory `www/mmirf/`

 1. install `mmir` and `mmir-lib` via `npm`
    ```bash
    # install mmir-lib
    npm install git+https://github.com/mmig/mmir-lib.git --save
    # install mmir-tooling
    npm install git+https://github.com/mmig/mmir-tooling.git --save-dev
    ```
 2. copy `mmir-lib` library files using `mmir-tooling`'s helper `mmirinstall`
    1. using command line  
       _(if used in an npm script, the relative path to `mmirinstall` can be omitted)_
       * on Windows
         ```cmd
         node_modules\.bin\mmirinstall www/mmirf
         ```
       * on *nix
         ```bash
         node_modules/.bin/mmirinstall www/mmirf
         ```
    2. as `npm` script
       * add `scripts` entry  in the `package.json` of the application:
         ```json
         "scripts": {
           "install-mmir-lib": "mmirinstall www/mmirf"
         },
         ```
       * run script via `npm`
         ```bash
         npm run install-mmir-lib
         ```


_NOTE_ if `mmir-lib` is included in a web page "as is", using its built-in
      [requirejs][6] mechanism, the library files are expected in
      the sub-directory/path `mmirf/` (w.r.t. to the including web page).
      If the library files are located somewhere different, the
      `mmir-lib` configuration needs explicitly specifiy the corresponding
      location.


### Manual Build Script

 * install [mmir-tooling][1] via `npm`:  
  (re-)build resources like grammars after creation/modification, e.g. with simple script
  ```javascript
  var path = require('path');
  var buildTools = require('mmir-tooling');

  var buildConfig = {
    //parses path src/mmir-res/ for mmir resources
    resourcesPath: path.join(__dirname, 'src/mmir-res'),
    //stores the compiled resources into dist/
    //NOTE: this will create corresponding sub directories if necessary,
    //      e.g for compiled grammars etc
    targetDir: path.join(__dirname, 'dist')
  };

  buildTools.apply(buildConfig).then(function(errors){
    var errMsg = errors.join('\n');
    console.log('Finished compiling resources'+(errMsg? ', with errors: ' +errMsg : ''));
  });
  ```

  The `resourcePath` will be searched for `mmir` resources that need to be built
  (see [documentation][9] for more details).

  By default, the built resources will be stored in `/www/gen/**`, or you can use
  `targetDir` in the build configuration for specifying a different directory
  ```javascript
  var buildConfig = {
    targetDir: path.join(__dirname, 'dist')
    resourcesPath: path.join(__dirname, 'www')
  };
  ```
  which would store the built resources into `/dist/gen/**`.


### Development

For including new libraries to [mmir-lib][3] (or updating/modifying existing vendor/generated libraries),
see [mmir-lib-dev][8]


[1]: https://github.com/mmig/mmir-tooling
[2]: https://github.com/mmig/mmir
[3]: https://github.com/mmig/mmir-lib
[4]: https://github.com/mmig/mmir-webpack
[5]: https://webpack.js.org/
[6]: https://requirejs.org
[7]: https://cordova.apache.org/
[8]: https://github.com/mmig/mmir-lib-dev
[9]: https://github.com/mmig/mmir-tooling/tree/master/docs/modules
[10]: https://mmig.github.io/mmir/api-ts/modules/mmir_tooling.html
