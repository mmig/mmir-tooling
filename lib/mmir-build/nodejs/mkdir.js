
var FILE_SYSTEM = require('fs');
var PATH = require('path');

module.exports = function(path, callback, isDebugOutput, pathSep){

	if(pathSep === 'default'){
		pathSep = PATH.sep;
	} else {
		pathSep = pathSep || '/';
	}

	var mkDirList = [];
	var lastIndex = path.lastIndexOf('/');
	if(lastIndex !== -1){
		var dirPath = path.substring(0,lastIndex);
		var isDirExisting = FILE_SYSTEM.existsSync(dirPath);
		if(isDebugOutput) console.log('    ensure that dir "'+dirPath+'" for file exists? -> '+isDirExisting);
		if( ! isDirExisting){

			mkDirList.push(dirPath);

			lastIndex = dirPath.lastIndexOf('/');
			while(lastIndex !== -1){
				dirPath = path.substring(0,lastIndex);

				if( ! FILE_SYSTEM.existsSync(dirPath)){
					mkDirList.push(dirPath);
					lastIndex = dirPath.lastIndexOf('/');
				}
				else {
					lastIndex = -1;
				}
			}
		}
	}

	if(mkDirList.length > 0){

		var count = 0, size = mkDirList.length, check = !callback? void(0) : function(){
			if(++count === size){
				callback();
			}
		};

		for(var i=size-1; i >= 0; --i){
			var dirPath = mkDirList[i];
			if(isDebugOutput) console.log('    creating directory '+dirPath);
			if(!callback){
				FILE_SYSTEM.mkdirSync(dirPath);
			} else {
				FILE_SYSTEM.mkdir(dirPath, check);
			}
		}
	}
};
