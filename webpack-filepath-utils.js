var _fs = require('fs');
var _path = require('path');
var reNormalize = _path.sep !== '/' ? new RegExp(_path.sep.replace(/\\/g, '\\\\'), 'g') : null;

var normalizePath = function(path) {
	if (reNormalize) {
		path = path.replace(reNormalize, '/');
	}
	return path;
}

var createFileTestFunc = function(absolutePaths, debugStr){

	debugStr = debugStr || '';

	var reTest = absolutePaths.map(function(absolutePath) {
		return new RegExp('^' + absolutePath.replace(/\./g, '\\.') + '$');
	});

	return function(path) {
		path = normalizePath(path);
		for (var i = 0, size = reTest.length; i < size; ++i) {
			var re = reTest[i];
			if (re.test(path)) {
				console.log('\ttest'+debugStr+': ', path); //DEBUG
				return true;
			};
		}
		return false;
	};
}

var isDirectory = function(path){
	return _fs.lstatSync(path).isDirectory();
}

module.exports = {
	normalizePath: normalizePath,
	createFileTestFunc: createFileTestFunc,
	isDirectory: isDirectory
};
