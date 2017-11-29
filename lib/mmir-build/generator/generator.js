
var dust = require('../../nodejs-dust');
var mkdir = require('../nodejs/mkdir');
var fs = require('fs');
var path = require('path');

//convert to / normalize file-path (with system-dependent path-separators)
var toFilePath = function(uri, name){
	return uri.replace(/\//gm, path.sep);
};

var resolveToFilePath = function(value, config){
	
	var resolvedPath = value.replace(/\${([^}]+)}/g, function(match, varName, offset, string){
		return config[varName];
	});
	
	return toFilePath(resolvedPath);
};

//helper: convert all strings in a JSON object
var convertStringsIn = function(dict, toStringFunc){
	for(var p in dict){
		if(dict.hasOwnProperty(p)){
			
			if(typeof dict[p] === 'object'){
				if(dict[p] == null){
					continue;
				} else {
					convertStringsIn(dict[p], toStringFunc);
				}
			} else if(typeof dict[p] === 'string'){
				dict[p] = toStringFunc(dict[p], p);
			}
		}
	}
	return dict;
};

//helper: convert all strings in a JSON object using the path-normalizer
var convertToFilePath = function(dict){
	
	return convertStringsIn(dict, toFilePath);
};

//process DUST template
var processTemplate = function(err, templateStr, context, outputFile, cb, debug){

	if (err) {
		return console.error(err);
	}

	templateStr = templateStr.replace('\u00EF\u00BB\u00BF', '');//<- remove BOM
	templateStr = templateStr.replace(/\r?\n/igm, '\r\n');//<- normalize line-breaks
	
	//console.log('\nloaded template: '+JSON.stringify(templateStr));
	
	var compiled = dust.compile(templateStr, 'parseviews');
	
	//console.log('\ncompiled template: '+JSON.stringify(compiled));
	
	dust.loadSource(compiled);

	if(debug) console.log('\nloaded and compiled template... ');
	
	//dust.cache

	dust.render('parseviews', context, function onrendered(error, output){

		if(error){
			return console.error(error);
		}

		//preparing dir for template
		mkdir(outputFile, null, debug);

		if(debug) console.log('\nrendered template (length '+output.length+')...');
		fs.writeFile(outputFile, output, function(err){
			if(err){
				return console.error('ERROR: could not write file to "'+outputFile+'": ', err);
			}
			if(debug) console.log('\nwrote contents to file "'+outputFile+'".');
			cb && cb();
		});
	});
};

//load include-files:
var processIncludes = function(name, templateStr, dict, nameList, debug){
	
	name = name.replace(/\.js$/i, '').replace(/[.-]/g, '_');
	dict[name] = templateStr.replace(/\r?\n/igm, '\r\n');//<- normalize line-breaks to \r\n
	
	if(nameList){
		nameList.push(name);
	}

	if(debug) console.log('\tloaded script '+name+' as string (length: '+templateStr.length+').');
};

//////////////////////////// main processing //////////////////////////


//disable whitespace optimizer:
dust.optimizers.format = function(ctx, node) {
	return node;
};

//convert file-paths to URLs:
dust.filters.url = function(value) {
	return value? value.replace(/\\/gm, '/') : value;
};

var startProcessing = function(templateFile, targetFile, includeFiles, config, cb, options){
	
	var debug = options? options.debug : false;
	
	if(debug) console.log('start creating generator at '+targetFile+' using template file '+templateFile+' ...');
	
	var loaded = 0,
		count = 0,
		isLoopCompleted = false,
		includeNameList = [];
	
	if(!includeFiles){
		includeFiles = [];
	}
	
	var checkProcTemplate = function(){
		//console.log('loaded '+loaded+' scripts from '+count);
		if(isLoopCompleted === true && loaded === count){
			
			startProcessingTemplate(templateFile, targetFile, config, cb, debug);
		}
	};
	
	
	for(var f in includeFiles){

		++count;
		
		(function(){
		
			var fname = f;
			var fpath = resolveToFilePath(includeFiles[f], config);
			
			fs.readFile(fpath, 'utf8', function(error, content) {
				
				if(error){
					console.error('ERROR failed to load script '+f+' from '+fpath);
				} else {
					content = content.replace('\u00EF\u00BB\u00BF', '');//<- remove BOM
					processIncludes(fname, content, config, includeNameList, debug);
				}
				
				++loaded;
				checkProcTemplate();
				
			});
		})();
	}
	
	isLoopCompleted = true;
	checkProcTemplate();
	
};

var startProcessingTemplate = function(templateFile, targetFile, config, cb, debug){

	fs.readFile(templateFile, 'utf8', function(error, output) {
		processTemplate(error,output,config,targetFile, cb, debug);
	});
	
};

module.exports = {
	process: startProcessing,
	toFilePath: toFilePath,
	normalizeFilePaths: convertToFilePath
};
