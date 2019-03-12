
var path = require('path');
var proc = require('./lib/process-requirejs-shims.js');

var inp = path.resolve(__dirname, './');
var outp = path.resolve(__dirname, './dist');

proc.process(inp, outp);


////////// TEST
var minProc = require('./lib/process-min.js');
minProc.process(inp, outp);
