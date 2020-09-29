"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWebpackConfig = void 0;
function isWebpackConfig(config) {
    return config && config.paths !== undefined;
}
exports.isWebpackConfig = isWebpackConfig;
