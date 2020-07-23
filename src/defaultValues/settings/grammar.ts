
import _ from 'lodash';

var defaultGrammar = {
  "stopwords": [],
  "tokens": {},
  "utterances": {}
};

function getDefault(_id){
	return _.cloneDeep(defaultGrammar);
}

export = {
	getDefault
};
