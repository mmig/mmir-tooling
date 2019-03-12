
var fs = require('fs');
var path = require('path');

var getSubDirName = require('./get-sub-dir.js');
var minProc = require('./minify.js');

var devConfig = require('./config/requirejs-dev-config.js');

module.exports = {
  process: function(inputLibPath, outputDir){

    var baseUrl = inputLibPath;// ~~> .../mmirf/
    var buildUrl = outputDir;

    for(var name in devConfig.paths){

    	var uri = devConfig.paths[name];

    	var fileName = path.basename(uri);

    	var filePath = path.join(baseUrl, uri + '.js');
      var outSubDir = getSubDirName(uri);
    	var minFilename = path.join(buildUrl, outSubDir, fileName + '.min.js');

      console.log('writing minified module to '+minFilename);
      
    	var code = fs.readFileSync(filePath, 'utf-8');
      var result = minProc.minify(fileName + '.js', code);

      fs.writeFileSync(minFilename, result.code, 'utf-8');
      fs.writeFileSync(minFilename + '.map', result.map, 'utf-8');

    }
  }
}
