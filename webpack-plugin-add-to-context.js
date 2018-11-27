'use strict';

//from https://stackoverflow.com/a/33290812/4278324

class AddToContextPlugin {
  constructor(extras) {
    this.extras = extras || [];
  }

  apply(compiler) {
    // compiler.plugin('context-module-factory', (cmf) => {
    //   cmf.plugin('after-resolve', (result, callback) => {
    //     this.newContext = true;
    //     return callback(null, result);
    //   });
	//
    //   // this method is called for every path in the ctx
    //   // we just add our extras the first call
    //   cmf.plugin('alternatives', (result, callback) => {
    //     if (this.newContext) {
    //       this.newContext = false;
	//
    //       const extras = this.extras.map((ext) => {
    //         return {
    //           context: result[0].context,
    //           request: ext
    //         };
    //       });
	//
	// 	  console.log('AddToContextPlugin: adding extras ', extras)
    //       result.push.apply(result, extras);
    //     }
    //     return callback(null, result);
    //   });
    // });

	// ------------------------------------
	// Specify the event hook to attach to
    compiler.hooks.contextModuleFactory.tap(
      'AddToContextPlugin',
      (cmf) => {
        // console.log('This is an example plugin!');
        // console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);
		//
        // // Manipulate the build using the plugin API provided by webpack
        // compilation.addModule(/* ... */);
		//
        // callback();

		// compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
	    //     console.log('Assets are being optimized.');
	    // });

		cmf.hooks.afterResolve.tapAsync('AddToContextPlugin', (result, callback) => {
          this.newContext = true;
			// console.log('AddToContextPlugin.contextModuleFactory.afterResolve -> ', result)
          return callback(null, result);
        });

		cmf.hooks.alternatives.tapAsync('AddToContextPlugin', (result, callback) => {
			console.log('AddToContextPlugin.contextModuleFactory.alternatives -> ', result, callback)
		   if (this.newContext) {
			 this.newContext = false;

			 const extras = this.extras.map((ext) => {
			   return {
				 context: result[0].context,
				 request: ext
			   };
			 });

			 console.log('AddToContextPlugin: adding extras ', extras)
			 result.push.apply(result, extras);
		   }
		   return callback(null, result);
		 });
		// console.log('AddToContextPlugin.contextModuleFactory -> ', cmf)
      }
    );
  }
}

module.exports = AddToContextPlugin;
