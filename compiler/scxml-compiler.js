

var path = require('path');
var fs = require('fs');

const mkdir = require('make-dir');

var scxmlGen = require('../scxml/scxml-gen.js');

var checksumUtil = require('../utils/checksum-util.js');

var getStateChartTargetPath = function(scxmlInfo){
	return path.join(scxmlInfo.targetDir, scxmlInfo.id + '.js');
}

var getStateChartChecksumPath = function(scxmlInfo){
	return path.join(scxmlInfo.targetDir, scxmlInfo.id + checksumUtil.getFileExt());
}

var getChecksumContent = function(content, type){
	return checksumUtil.createContent(content, type);
}

var checkUpToDate = function(scxmlInfo, jsonContent,callback){

	return checksumUtil.upToDate(
		jsonContent,
		getStateChartChecksumPath(scxmlInfo),
		getStateChartTargetPath(scxmlInfo),
		void(0),// scxmlInfo.engine
		callback
	);
}


var writeStateChartModel = function(err, scCode, _map, meta){

	var sc = meta && meta.info;
	if(err){
		console.log('ERROR compiling SCXML model '+(sc? sc.file : '')+': ', err);
		return;
	}

	var scPath =  getStateChartTargetPath(sc);
	var checksumContent = getChecksumContent(meta.json);
	var checksumPath = getStateChartChecksumPath(sc);
	console.log('###### writing compiled SCXML model to file (length '+scCode.length+') ', scPath, ' -> ', checksumContent);

	fs.writeFile(scPath, scCode, 'utf8', function(err){
		if(err){
			console.log('ERROR writing compiled SCXML model to '+ scPath+ ': ', err);
		}
	});
	fs.writeFile(checksumPath, checksumContent, 'utf8', function(err){
		if(err){
			console.log('ERROR writing checksum file for compiled SCXML model to '+checksumPath+ ': ', err);
		}
	});
};


var prepareCompile = function(options){
	mkdir.sync(options.config.targetDir);
}

var compile = function(loadOptions){

	loadOptions.mapping.forEach(sc => {

		sc.targetDir = loadOptions.config.targetDir;
		sc.force = typeof sc.force === 'boolean'? sc.force : loadOptions.config.force;

		fs.readFile(sc.file, 'utf8', function(err, content){

			console.log('###### start processing SCXML model '+sc.id);

			if(err){
				console.log('ERROR compiling SCXML model '+sc.file+': ', err);
				return;
			}

			var doCompile = function(){
				scxmlGen.compile(content, sc.file, loadOptions, writeStateChartModel, null, {info: sc, json: content});
			};

			if(!sc.force){

				checkUpToDate(sc, content, function(isUpdateToDate){

					if(isUpdateToDate){
						console.log('compiled SCXML model is up-to-data at '+getStateChartTargetPath(sc));
					} else {
						doCompile();
					}
				});

			} else {

				doCompile();
			}

		});
	});
}

module.exports = {
	prepareCompile: prepareCompile,
	compile: compile
}
