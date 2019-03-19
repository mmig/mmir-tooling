

var path = require('path');
var fs = require('fs-extra');

var viewGen = require('../view/view-gen.js');

var checksumUtil = require('../utils/checksum-util.js');

var Promise = require('../utils/promise.js');

var logUtils = require('../utils/log-utils.js');
var log = logUtils.log;
var warn = logUtils.warn;

var getViewTargetPath = function(viewInfo){
	return path.join(viewInfo.targetDir, viewInfo.id + '.js');
}

var getViewChecksumPath = function(viewInfo){
	return path.join(viewInfo.targetDir, viewInfo.id + checksumUtil.getFileExt());
}

var getChecksumContent = function(content, type){
	return checksumUtil.createContent(content, type);
}

var checkUpToDate = function(viewInfo, jsonContent){

	return checksumUtil.upToDate(
		jsonContent,
		getViewChecksumPath(viewInfo),
		getViewTargetPath(viewInfo),
		void(0)// viewInfo.engine
	);
}


var writeView = function(err, viewCode, _map, meta){

	var v = meta && meta.info;
	if(err){
		var msg = 'ERROR compiling view '+(v? v.file : '')+': ';
		warn(msg, err);
		return Promise.revole(err.stack? err : new Error(msg+err));
	}

	var viewPath =  getViewTargetPath(v);
	var checksumContent = getChecksumContent(meta.json, v.engine);
	var checksumPath = getViewChecksumPath(v);
	log('###### writing compiled view to file (length '+viewCode.length+') ', viewPath, ' -> ', checksumContent);

	var viewDir = path.dirname(viewPath);
	return fs.ensureDir(viewDir).then(function(){

		var p1 = fs.writeFile(viewPath, viewCode, 'utf8').catch(function(err){
			var msg = 'ERROR writing compiled view to '+ viewPath+ ': ';
			warn(msg, err);
			return err.stack? err : new Error(msg+err);
		});

		var p2 = fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function(err){
			var msg = 'ERROR writing checksum file for compiled view to '+checksumPath+ ': ';
			warn(msg, err);
			return err.stack? err : new Error(msg+err);
		});

		return Promise.all([p1, p2]);
	});

};

var prepareCompile = function(options){
	return fs.ensureDir(options.config.targetDir);
}

var compile = function(loadOptions){

	var tasks = [];
	loadOptions.mapping.forEach(v => {

		v.targetDir = loadOptions.config.targetDir;
		v.force = typeof v.force === 'boolean'? v.force : loadOptions.config.force;

		var t = fs.readFile(v.file, 'utf8').then(function(content){

			var doCompile = function(){
				return new Promise(function(resolve, reject){

					viewGen.compile(content, v.file, loadOptions, function(err, viewCode, _map, meta){

						if(err){
							var msg = 'ERROR compiling view '+(v? v.file : '')+': ';
							warn(msg, err);
							return resolve(err.stack? err : new Error(msg+err));
						}

						return writeView(err, viewCode, _map, meta).then(function(){
							resolve();
						}).catch(function(err){reject(err)});

					}, null, {info: v, json: content});
				});
			};

			if(!v.force){

				return checkUpToDate(v, content).then(function(isUpdateToDate){

					if(isUpdateToDate){
						log('compiled view is up-to-data at '+getViewTargetPath(v));
					} else {
						return doCompile();
					}

				}).catch(function(err){

					var msg = 'ERROR compiling view '+v.file+': ';
					warn(msg, err);
					return err.stack? err : new Error(msg+err);
				});

			} else {

				return doCompile();
			}

		}).catch(function(err){

			var msg = 'ERROR compiling view '+v.file+': ';
			warn(msg, err);
			return err.stack? err : new Error(msg+err);
		});

		tasks.push(t);
	});

	return Promise.all(tasks);
}

module.exports = {
	prepareCompile: prepareCompile,
	compile: compile
}
