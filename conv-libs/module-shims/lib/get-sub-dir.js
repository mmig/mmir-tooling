
var path = require('path');

var isVendor = function(uripath){
  return /vendor/.test(path.dirname(uripath));
};

var getSubDirName = function(uri){
  return isVendor(uri)? 'vendor' : 'gen';
};

module.exports = getSubDirName;
