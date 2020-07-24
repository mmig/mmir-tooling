
import { Grammar } from 'mmir-lib';

import _ from 'lodash';

var defaultGrammar = {
  "stopwords": [],
  "tokens": {},
  "utterances": {}
};

function getDefault(_id: string): Grammar {
    return _.cloneDeep(defaultGrammar);
}

export = {
    getDefault
};
