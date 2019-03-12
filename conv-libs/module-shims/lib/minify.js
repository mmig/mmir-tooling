
var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');

module.exports = {
  minify: function(filename, content){

    var code = {};
    code[filename] = content;

    console.log('  minifying '+filename+'...');
    var minFilename = filename.replace(/\.js$/, '.min.js');
    return uglify.minify(code, {
      sourceMap: {
        filename: minFilename,
        url: minFilename + '.map'
      }
    });
  }
}
