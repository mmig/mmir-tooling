
var _ = require('lodash');

var defaultGrammar = {
  "stopwords": [],
  "tokens": {},
  "utterances": {}
};

function getDefault(_id){
	return _.cloneDeep(defaultGrammar);
}

module.exports = {
	getDefault
};
