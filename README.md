[mmir-tooling][1]
============

This repository holds files, resources etc. for building MMIR-based applications.

----

### Dependencies

The current build process requires the **[MMIR-lib][4] version 5.0.0 or later**

By default the build process will assume that the MMIR-based application is
located at `www/`:

    www/config/
               configuration.json
               languages/
                        <lang1>/grammar.json
                               /speech.json
                               /dictionary.json
                        <lang2>/grammar.json
                               /speech.json
                               /dictionary.json
               states/
                      dialog.xml
                      input.xml
    www/controller/*
    www/views/*
    ...

If the `mmir` resources are located in different directories/files, they need
to be specified in the build configuration.

### Installation Prerequisites

These prerequisites are required for automatically installing/setting-up the _mmir-tooling_
in a MMIR project (see section _Installation_ below)

 * Node.js

### Installation

Install `mmir-tooling` via `npm`.

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

TODO update this section

NOTE this section is only relevant for working/developing the MMIR library (or its tooling) itself
     (e.g. modifying contents of `www/mmirf/*`), i.e. it can be safely ignored, if the MMIR
     library is only used.


In general, the build process will load/extract the "raw" requirejs configuration-object (i.e. the JSON-like
object containing the paths, shims etc.) from `mainConfig.js` and do some additional initialization that
is specific to the execution environment (e.g. nodejs).
Changes in `mainConfig.js` that are not contained in the JSON-like configuration object probably require
changes in the build scripts `build/lib/mmir-build/templates/generate-[grammars|views].template`.


#### Prerequisites

TODO update this section

The following sections/descripts assume that the build-scripts have been installed as described in the
section [Installation](#installation), where the contents of this directory (i.e. the mmir-tooling sources)
have been placed in the directory `/build` and the mmir-library has been placed in the directory `/www/mmirf`:

    ...
    /build/<contents of this directory>
    /www/mmirf/<contents of mmir-library>
    ...

and `gulp` has been executed in `/build/`.

#### Adding New Libraries

After adding new libraries and/or modules, the build process may need to be updated too.

This will probably be necessary, if there are changes in `mainConfig.js`, especially if the
new library is not nodejs compatible (may need to add/implement a dummy-module that is used during build)
or is not an AMD module and needs a requirejs shim configuration (see also section below).


##### Adding New Vendor Libraries

Vendor libraries should be "requirejs compatible" (i.e. an AMD module):
This can be achieved either by the library itself being an AMD module, or by adding
a requirejs shim configuration in `mainConfig.js` (see documentation of requirejs for more details).

If a vendor library is added with a shim configuration, then the helper script(*)

    node build/lib/mmir-build/scripts/processRequirejsShimConfig.js

must be executed which will create an AMD module for the library in `build/lib/mmir-build/mod/`.
This AMD library will then be used during build (i.e. `cordova prepare`) in the nodejs environment
(since requirejs shims do not work in nodejs).

NOTE: if the license of the added libraries allow it, you could also use the AMD modules instead
      of the original library and remove the shim configuration

> (*): if the web-app root directory is different than `<project dir>/www`, then the direcotry needs
>    to be added as an argument, e.g. if its located in `<project dir>/src/assets`, then run the script with
>
>     node build/lib/mmir-build/scripts/processRequirejsShimConfig.js src/assets

--
### License

If not stated otherwise, the files, resources etc. are provided under the MIT license (see also details in
[library_origins.txt](lib/library_origins.txt))


[1]: https://github.com/mmig/mmir-tooling
[2]: https://github.com/mmig/mmir-cordova
[3]: https://github.com/mmig/mmir-starter-kit
[4]: https://github.com/mmig/mmir-lib
[5]: https://webpack.js.org/
[6]: https://github.com/mmig/mmir-webpack
[7]: https://cordova.apache.org/
