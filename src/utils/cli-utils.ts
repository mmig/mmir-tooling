
import meow from 'meow';
import _ from 'lodash';

function init(opt?, helpText?: string){

    const help = helpText? helpText : `
  Usage
    <script>

  Options
    --help         show usage information
    --verbose, -v  show additional information
                    DEFAULT: false
    `;

    const options: {flags: meow.AnyFlags} = {
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
        process.env.verbose = true.toString();
    }
}

export = {
    parseCli: init
}
