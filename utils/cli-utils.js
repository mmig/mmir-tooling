
var meow = require('meow');
var _ = require('lodash');

function init(opt, helpText){

	var help = helpText? helpText : `
	  Usage
	    <script>

	  Options
	    --help         show usage information
	    --verbose, -v  show additional information
	                    DEFAULT: false
	`;

	var options = {
		flags: {
	    verbose: {
				type: 'boolean',
				alias: 'v',
				default: false
			}
		}
	};

	if(opt){
		_.merge(options, opt);
	}

	var cli = meow(help, options);

	if(cli.flags.verbose){
		process.env.verbose = true;
	}
}

module.exports = {
	parseCli: init
}
