
var path = require('path');
var fs = require('fs');

const mkdir = require('make-dir');

var grammarGen = require('../grammar/grammar-gen.js');

var checksumUtil = require('../utils/checksum-util.js');

var getGrammarTargetPath = function(grammarInfo){
	return path.join(grammarInfo.targetDir, grammarInfo.id + '_grammar.js');
}

var getGrammarChecksumPath = function(grammarInfo){
	return path.join(grammarInfo.targetDir, grammarInfo.id + checksumUtil.getFileExt());
}

var getChecksumContent = function(content, type){
	return checksumUtil.createContent(content, type);
}

var checkUpToDate = function(grammarInfo, jsonContent, callback){

	return checksumUtil.upToDate(
		jsonContent,
		getGrammarChecksumPath(grammarInfo),
		getGrammarTargetPath(grammarInfo),
		grammarInfo.engine,
		callback
	);
}

var setPendingAsyncGrammarFinished = function(g){
	if(!g.asyncCompile){
		console.log('did not update pending grammar count for '+g.id+' with engine '+g.engine+', since it would have been sync-compiled.');
		return;
	}
	grammarGen.updatePendingAsyncGrammarFinished(g, {});
}

var writeGrammar = function(err, grammarCode, _map, meta){

	var g = meta && meta.info;
	if(err){
		console.log('ERROR compiling grammar '+(g? g.file : '')+': ', err);
		return;
	}

	var grammarPath =  getGrammarTargetPath(g);
	var checksumContent = getChecksumContent(meta.json, g.engine);
	var checksumPath = getGrammarChecksumPath(g);
	console.log('###### writing compiled grammar to file (length '+grammarCode.length+') ', grammarPath, ' -> ', checksumContent);

	fs.writeFile(grammarPath, grammarCode, 'utf8', function(err){
		if(err){
			console.log('ERROR writing compiled grammar to '+ viewPath+ ': ', err);
		}
	});
	fs.writeFile(checksumPath, checksumContent, 'utf8', function(err){
		if(err){
			console.log('ERROR writing checksum file for compiled grammar to '+checksumPath+ ': ', err);
		}
	});
};


var prepareCompile = function(options){
	mkdir.sync(options.config.targetDir);
	grammarGen.initPendingAsyncGrammarInfo(options);
}

var compile = function(grammarLoadOptions){

	grammarLoadOptions.mapping.forEach(g => {

		g.targetDir = grammarLoadOptions.config.targetDir;
		if(!g.engine){
			g.engine = grammarGen.getEngine(g, grammarLoadOptions);
		}
		if(typeof g.asyncCompile !== 'boolean'){
			g.asyncCompile = grammarGen.isAsyncCompile(g, grammarLoadOptions);
		}

		g.force = typeof g.force === 'boolean'? g.force : grammarLoadOptions.config.force;

		fs.readFile(g.file, 'utf8', function(err, content){

			console.log('###### start processing grammar '+g.id+' (engine '+g.engine+', asyncCompile '+g.asyncCompile+')...');

			if(err){
				console.log('ERROR compiling grammar '+g.file+': ', err);
				setPendingAsyncGrammarFinished(g);
				return;
			}

			var doCompile = function(){
				grammarGen.compile(content, g.file, grammarLoadOptions, writeGrammar, null, {info: g, json: content});
			};

			if(!g.force){

				checkUpToDate(g, content, function(isUpToDate){

					if(isUpToDate){

						console.log('compiled grammar is up-to-data at '+getGrammarTargetPath(g));
						setPendingAsyncGrammarFinished(g);

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
