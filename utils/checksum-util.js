
var fs = require('fs');

var mmir = require('../mmir-init.js');
var checksumUtil = mmir.require('mmirf/checksumUtils').init();

var checkUpToDate = function(jsonContent, checksumPath, targetPath, additionalInfo, callback){

	if(!fs.existsSync(targetPath)){
		console.log('no compiled resource at '+targetPath);
		callback(false);
		return;
	}

	if(fs.existsSync(checksumPath)){

		fs.readFile(checksumPath, 'utf8', function(err, checksumContent){

			if(err){
				console.log('ERROR reading checksum file at '+checksumPath+': ', err);
				callback(false);
				return
			}

			console.log('verifying checksum file at '+checksumPath+' -> ', checksumUtil.isSame(jsonContent, checksumUtil.parseContent(checksumContent), additionalInfo));
			console.log('  checksum info -> ', checksumUtil.parseContent(checksumContent));
			console.log('  json info -> ', checksumUtil.parseContent(checksumUtil.createContent(jsonContent, additionalInfo)));

			var res = checksumUtil.isSame(jsonContent, checksumUtil.parseContent(checksumContent), additionalInfo);
			callback(res);
		});
		return;

	} else {
		console.log('no checksum file at '+checksumPath);
	}

	return callback(false);
}

module.exports = {
	upToDate: checkUpToDate,
	createContent: function(content, type){
		return checksumUtil.createContent(content, type);
	},
	getFileExt: function(){
		return checksumUtil.getFileExt();
	}
}
