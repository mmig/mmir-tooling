

var path = require('path');
var fs = require('fs-extra');

var scxmlGen = require('../scxml/scxml-gen.js');

var checksumUtil = require('../utils/checksum-util.js');

var Promise = require('../utils/promise.js');

var logUtils = require('../utils/log-utils.js');
var log = logUtils.log;
var warn = logUtils.warn;

var getStateChartTargetPath = function(scxmlInfo){
	return path.join(scxmlInfo.targetDir, scxmlInfo.id + '.js');
}

var getStateChartChecksumPath = function(scxmlInfo){
	return path.join(scxmlInfo.targetDir, scxmlInfo.id + checksumUtil.getFileExt());
}

var getChecksumContent = function(content, type){
	return checksumUtil.createContent(content, type);
}

var checkUpToDate = function(scxmlInfo, jsonContent){

	return checksumUtil.upToDate(
		jsonContent,
		getStateChartChecksumPath(scxmlInfo),
		getStateChartTargetPath(scxmlInfo),
		void(0)// scxmlInfo.engine
	);
}


var writeStateChartModel = function(_err, scCode, _map, meta){

	var sc = meta && meta.info;
	var scPath =  getStateChartTargetPath(sc);
	var checksumContent = getChecksumContent(meta.json);
	var checksumPath = getStateChartChecksumPath(sc);

	log('###### writing compiled SCXML model to file (length '+scCode.length+') ', scPath, ' -> ', checksumContent);

	return Promise.all([
		fs.writeFile(scPath, scCode, 'utf8').catch(function(err){
			var msg = 'ERROR writing compiled SCXML model to '+ scPath+ ': ';
			warn(msg, err);
			return err.stack? err : new Error(msg+err)
		}),
		fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function(err){
			var msg = 'ERROR writing checksum file for compiled SCXML model to '+checksumPath+ ': ';
			warn(msg, err);
			return err.stack? err : new Error(msg+err);
		})
	]);
};

var prepareCompile = function(options){
	options.config.moduleType = options.config.moduleType? options.config.moduleType : 'amd';
	return fs.ensureDir(options.config.targetDir);
}

var compile = function(loadOptions){

	var tasks = [];
	loadOptions.mapping.forEach(sc => {

		sc.targetDir = loadOptions.config.targetDir;
		sc.force = typeof sc.force === 'boolean'? sc.force : loadOptions.config.force;

		var t = fs.readFile(sc.file, 'utf8').then(function(content){

			log('###### start processing SCXML model '+sc.id);

			var doCompile = function(){
				return new Promise(function(resolve, reject){
					scxmlGen.compile(content, sc.file, loadOptions, function(err, scCode, _map, meta){

						if(err){
							var msg = 'ERROR compiling SCXML model '+(sc? sc.file : '')+': ';
							warn(msg, err);
							return resolve(err.stack? err : new Error(msg+err));
						}

						return writeStateChartModel(err, scCode, _map, meta).then(function(){
							resolve();
						}).catch(function(err){reject(err)});

					}, null, {info: sc, json: content});

				});
			};

			if(!sc.force){

				return checkUpToDate(sc, content).then(function(isUpdateToDate){

					if(isUpdateToDate){
						log('compiled SCXML model is up-to-data at '+getStateChartTargetPath(sc));
					} else {
						return doCompile();
					}
				});

			} else {

				return doCompile();
			}

		}).catch(function(err){

			var msg = 'ERROR compiling SCXML model '+sc.file+': ';
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
