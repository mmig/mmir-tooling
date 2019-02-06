
var scionInterpreter = require('@scion-scxml/core');

var getModel = function(url, callback){
	setTimeout(function(){//<- simulate async
		try {
			var scxmlModel = __webpack_require__(url);
			callback(null, scxmlModel);
		} catch(err){
			callback(err);
		}
	}, 0);
};

module.exports = {
	scion: scionInterpreter,
	core: scionInterpreter,
	pathToModel: getModel,
	urlToModel: getModel
};
