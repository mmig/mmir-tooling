

var path = require('path');
var fs = require('fs');

const mkdir = require('make-dir');

var viewGen = require('../view/view-gen.js');

var checksumUtil = require('../utils/checksum-util.js');

var getViewTargetPath = function(viewInfo){
	return path.join(viewInfo.targetDir, viewInfo.id + '.js');
}

var getViewChecksumPath = function(viewInfo){
	return path.join(viewInfo.targetDir, viewInfo.id + checksumUtil.getFileExt());
}

var getChecksumContent = function(content, type){
	return checksumUtil.createContent(content, type);
}

var checkUpToDate = function(viewInfo, jsonContent,callback){

	return checksumUtil.upToDate(
		jsonContent,
		getViewChecksumPath(viewInfo),
		getViewTargetPath(viewInfo),
		void(0),// viewInfo.engine
		callback
	);
}


var writeView = function(err, viewCode, _map, meta){

	var v = meta && meta.info;
	if(err){
		console.log('ERROR compiling view '+(v? v.file : '')+': ', err);
		return;
	}

	var viewPath =  getViewTargetPath(v);
	var checksumContent = getChecksumContent(meta.json, v.engine);
	var checksumPath = getViewChecksumPath(v);
	console.log('###### writing compiled view to file (length '+viewCode.length+') ', viewPath, ' -> ', checksumContent);

	var viewDir = path.dirname(viewPath);
	if(!fs.existsSync(viewDir)){
		mkdir.sync(viewDir);
	}
	fs.writeFile(viewPath, viewCode, 'utf8', function(err){
		if(err){
			console.log('ERROR writing compiled view to '+ viewPath+ ': ', err);
		}
	});
	fs.writeFile(checksumPath, checksumContent, 'utf8', function(err){
		if(err){
			console.log('ERROR writing checksum file for compiled view to '+checksumPath+ ': ', err);
		}
	});
};


var prepareCompile = function(options){
	mkdir.sync(options.config.targetDir);
}

var compile = function(loadOptions){

	loadOptions.mapping.forEach(v => {

		v.targetDir = loadOptions.config.targetDir;
		v.force = typeof v.force === 'boolean'? v.force : loadOptions.config.force;

		fs.readFile(v.file, 'utf8', function(err, content){

			console.log('###### start processing view '+v.id);

			if(err){
				console.log('ERROR compiling view '+v.file+': ', err);
				return;
			}

			var doCompile = function(){
				viewGen.compile(content, v.file, loadOptions, writeView, null, {info: v, json: content});
			};

			if(!v.force){

				checkUpToDate(v, content, function(isUpdateToDate){

					if(isUpdateToDate){
						console.log('compiled view is up-to-data at '+getViewTargetPath(v));
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
