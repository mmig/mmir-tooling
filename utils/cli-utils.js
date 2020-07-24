"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var meow_1 = __importDefault(require("meow"));
var lodash_1 = __importDefault(require("lodash"));
function init(opt, helpText) {
    var help = helpText ? helpText : "\n  Usage\n    <script>\n\n  Options\n    --help         show usage information\n    --verbose, -v  show additional information\n                    DEFAULT: false\n    ";
    var options = {
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
    var cli = meow_1.default(help, options);
    if (cli.flags.verbose) {
        process.env.verbose = true.toString();
    }
}
module.exports = {
    parseCli: init
};
