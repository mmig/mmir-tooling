"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const meow_1 = __importDefault(require("meow"));
const lodash_1 = __importDefault(require("lodash"));
function init(opt, helpText) {
    const help = helpText ? helpText : `
  Usage
    <script>

  Options
    --help         show usage information
    --verbose, -v  show additional information
                    DEFAULT: false
    `;
    const options = {
        flags: {
            verbose: {
                type: 'boolean',
                alias: 'v',
                default: false
            }
        }
    };
    if (opt) {
        lodash_1.default.merge(options, opt);
    }
    var cli = (0, meow_1.default)(help, options);
    if (cli.flags.verbose) {
        process.env.verbose = true.toString();
    }
}
module.exports = {
    parseCli: init
};
