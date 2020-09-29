"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isWebpackConfig(config) {
    return config && config.paths !== undefined;
}
exports.isWebpackConfig = isWebpackConfig;
