
var path = require('path');
var fs = require('fs-extra');

var grammarGen = require('../grammar/grammar-gen.js');

var checksumUtil = require('../utils/checksum-util.js');

var Promise = require('../utils/promise.js');


var logUtils = require('../utils/log-utils.js');
var log = logUtils.log;
var warn = logUtils.warn;

var getGrammarTargetPath = function(grammarInfo){
	return path.join(grammarInfo.targetDir, grammarInfo.id + '.js');
}

var getGrammarChecksumPath = function(grammarInfo){
	return path.join(grammarInfo.targetDir, grammarInfo.id + checksumUtil.getFileExt());
}

var getChecksumContent = function(content, type){
	return checksumUtil.createContent(content, type);
}

var getAdditionalChecksumInfo = function(grammarInfo){
	return grammarInfo.engine + ' ' + grammarGen.fileVersion;
}

var checkUpToDate = function(grammarInfo, jsonContent){

	return checksumUtil.upToDate(
		jsonContent,
		getGrammarChecksumPath(grammarInfo),
		getGrammarTargetPath(grammarInfo),
		getAdditionalChecksumInfo(grammarInfo)
	);
}

var setPendingAsyncGrammarFinished = function(g){
	if(!g.asyncCompile){
		log('did not update pending grammar count for '+g.id+' with engine '+g.engine+', since it would have been sync-compiled.');
		return;
	}
	grammarGen.updatePendingAsyncGrammarFinished(g, {});
}

var writeGrammar = function(_err, grammarCode, _map, meta){

	var g = meta && meta.info;

	var grammarPath =  getGrammarTargetPath(g);
	var checksumContent = getChecksumContent(meta.json, getAdditionalChecksumInfo(g));
	var checksumPath = getGrammarChecksumPath(g);
	log('###### writing compiled grammar to file (length '+grammarCode.length+') ', grammarPath, ' -> ', checksumContent);

	return Promise.all([
		fs.writeFile(grammarPath, grammarCode, 'utf8').catch(function(err){
			var msg = 'ERROR writing compiled grammar to '+ viewPath+ ': ';
			warn(msg, err);
			return err.stack? err : new Error(msg+err);
		}),
		fs.writeFile(checksumPath, checksumContent, 'utf8').catch(function(err){
			var msg = 'ERROR writing checksum file for compiled grammar to '+checksumPath+ ': ';
			warn(msg, err);
			return err.stack? err : new Error(msg+err);
		})
	]);
};

var prepareCompile = function(options){
	grammarGen.initPendingAsyncGrammarInfo(options);
	return fs.ensureDir(options.config.targetDir);
}

var compile = function(grammarLoadOptions){

	var tasks = [];

	grammarLoadOptions.mapping.forEach(g => {

		g.targetDir = grammarLoadOptions.config.targetDir;
		if(!g.engine){
			g.engine = grammarGen.getEngine(g, grammarLoadOptions);
		}
		if(typeof g.asyncCompile !== 'boolean'){
			g.asyncCompile = grammarGen.isAsyncCompile(g, grammarLoadOptions);
		}

		g.force = typeof g.force === 'boolean'? g.force : grammarLoadOptions.config.force;

		var t = fs.readFile(g.file, 'utf8').then(function(content){

			log('###### start processing grammar '+g.id+' (engine '+g.engine+', asyncCompile '+g.asyncCompile+')...');

			var doCompile = function(){
				return new Promise(function(resolve, reject){
					grammarGen.compile(content, g.file, grammarLoadOptions, function(err, grammarCode, _map, meta){

						if(err){
							var msg = 'ERROR compiling grammar '+(g? g.file : '')+': ';
							warn(msg, err);
							return resolve(err.stack? err : new Error(msg+err));
						}
						writeGrammar(err, grammarCode, _map, meta).then(function(){
							resolve();
						}).catch(function(err){reject(err)});

					}, null, {info: g, json: content});
				});
			};

			if(!g.force){

				return checkUpToDate(g, content).then(function(isUpToDate){

					if(isUpToDate){

						log('compiled grammar is up-to-date at '+getGrammarTargetPath(g));
						setPendingAsyncGrammarFinished(g);

					} else {
						return doCompile();
					}
				});

			} else {

				return doCompile();
			}

		}).catch(function(err){

			var msg = 'ERROR compiling grammar '+g.file+': ';
			warn(msg, err);

			setPendingAsyncGrammarFinished(g);

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