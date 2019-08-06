mmir-tooling
============

The [mmir-tooling][1] repository holds files, resources etc. for
building MMIR-based applications.

----

### API Documentation

See generated [API documentation][9] (or more detailed [HTML][10] documentation) and details below.

### Dependencies

The current build process requires the **[mmir-lib][4] version 5.0.0 or later**

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

#### Simple `mmir-lib` Installation

If the application does not use a build-system like `webpack`, and cannot
utilize the `node` / `npm` package directly, the `mmir-lib` library files
can be simply copied into the application directory.

`mmir-tooling` provides to a simple command line tool for accomplishing this, e.g.
the following steps would be one way for installing the `mmir-lib` library files
into the application directory `www/mmirf`
```bash

# install mmir-lib
npm install git+https://github.com/mmig/mmir-lib.git --save
# install mmir-tooling
npm install git+https://github.com/mmig/mmir-tooling.git --save-dev

# copy mmir-lib library files using mmir-tooling's helper mmirinstall
# (if used in an npm script, the relative path can be omitted)
# on Windows
node_modules\.bin\mmirinstall www/mmirf
# on *nix
node_modules/.bin/mmirinstall www/mmirf
```

_NOTE_ if `mmir-lib` is included in a web page "as is", using its built-in
      [requirejs][11] mechanism, the library files are expected in
      the sub-directory/path `mmirf/` (w.r.t. to the including web page).
      If the library files are located somewhere different, the
      `mmir-lib` configuration needs explicitly specifiy the corresponding
      location.

### Webpack Build Integration

For [webpack][5]-based applications, [mmir-webpack][6] can be used.


### Cordova Build Integration

For automatically building the `mmir` resources in a [cordova][7]-based app, the
build-script can be included as `prepare hook`, i.e. in `config.xml`:
```xml
<hook type="before_prepare" src="resources/mmir5_before_prepare.js" />
```

Then create the script at `resources/mmir5_before_prepare.js` (or whatever path was specified in `config.xml`):
```javascript
var path = require('path');
var buildTools = require('mmir-tooling');

var doBuild = function(mmirBuildConfig){
  buildTools.apply(mmirBuildConfig).then(function(errors){
    var errMsg = errors.join('\n');
    var msg = '\n## Finished compiling resources'+(errMsg? ', with errors: ' +errMsg : '');
    console.log(msg);
    if(errMsg){
      process.exit(1);
    }
  });
};

module.exports = function(ctx){
  var root = ctx.opts.projectRoot;
  var mmirBuildConfig = {
    resourcesPath: path.join(root, 'www')
  };
  doBuild(mmirBuildConfig);
};

```

NOTE: if the `cordova` app is built with `webpack`, the [mmir-webpack][6]
      integration should be used instead.


### Manual Build Script

 * install [mmir-tooling][3] via `npm`:  
  (re-)build resources like grammars after creation/modification, e.g. with simple script
  ```javascript
  var path = require('path');
  var buildTools = require('mmir-tooling');

  var buildConfig = {
    resourcesPath: path.join(__dirname, 'www')
  };

  buildTools.apply(buildConfig).then(function(errors){
    var errMsg = errors.join('\n');
    console.log('Finished compiling resources'+(errMsg? ', with errors: ' +errMsg : ''));
  });
  ```

  The `resourcePath` will be searched for `mmir` resources that need to be built
  (see [documentation][6] for more details).

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

For including new libraries to [mmir-lib][4] (or updating/modifying existing vendor/generated libraries),
see [mmir-lib-dev][8]


[1]: https://github.com/mmig/mmir-tooling
[2]: https://github.com/mmig/mmir-cordova
[3]: https://github.com/mmig/mmir-starter-kit
[4]: https://github.com/mmig/mmir-lib
[5]: https://webpack.js.org/
[6]: https://github.com/mmig/mmir-webpack
[7]: https://cordova.apache.org/
[8]: https://github.com/mmig/mmir-lib-dev
[9]: https://github.com/mmig/mmir-tooling/tree/master/docs/modules
[10]: https://mmig.github.io/mmir/api-ts/modules/mmir_tooling.html
[11]: https://requirejs.org
