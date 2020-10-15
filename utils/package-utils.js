"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const warn = log_utils_1.default.warn;
function saveRequire(pkg) {
    try {
        return require(pkg);
    }
    catch (err) {
        warn('mmir-webpack: could not initialize ' + pkg + ', may need to install it  ' + err, err);
    }
}
var readUp;
function initPackageReader() {
    if (!readUp) {
        readUp = saveRequire('read-pkg-up');
    }
    return readUp;
}
var semVer;
function initSemVer() {
    if (!semVer) {
        semVer = saveRequire('semver');
    }
    return semVer;
}
function getPackageVersion(packageId) {
    initPackageReader();
    if (!readUp) {
        warn('mmir-webpack: could not load package ' + packageId + ', because of missing dependencies!');
        return void (0);
    }
    const workerLoaderPkg = readUp.sync({ cwd: require.resolve(packageId) });
    return workerLoaderPkg && (workerLoaderPkg.packageJson || workerLoaderPkg.pkg);
}
function checkPackageVersion(packageId, versionRequirement) {
    const packageJson = getPackageVersion(packageId);
    initSemVer();
    if (!packageJson || !semVer) {
        warn('mmir-webpack: could not determine version of package ' + packageId + ', because of missing dependencies!');
        return void (0);
    }
    try {
        return semVer.satisfies(packageJson.version, versionRequirement);
    }
    catch (err) {
        warn('mmir-webpack: could not determine version of ' + packageId + '! ' + err, err);
    }
}
/**
 * HELPER set backwards compatible options, depending on the version of a (webpack) plugin/module
 *
 * @param  options the options object
 * @param  optionNameIfTrue the option (name) that should be set in case packageVersionRequirement evaluate to true
 * @param  optionNameIfFalse the option (name) that should be set in case packageVersionRequirement evaluate to false
 * @param  value the option value to set
 * @param  useIfNone the fallback evaluation value that should be used in case the packageVersionRequirement could not be processed (most likely due to opitional/not installed dependencies)
 * @param  packageId the package ID which's version shoulb be checked
 * @param  packageVersionRequirement the requirement for the package's version, e.g. ">= 3.0.0" (uses `semver.satisfies()` if available)
 * @return the modified options object
 */
function setOptionIf(options, optionNameIfTrue, optionNameIfFalse, value, useIfNone, packageId, packageVersionRequirement) {
    let isReqTrue = checkPackageVersion(packageId, packageVersionRequirement);
    if (typeof isReqTrue !== 'boolean') {
        isReqTrue = useIfNone;
    }
    options[isReqTrue ? optionNameIfTrue : optionNameIfFalse] = value;
    return options;
}
module.exports = {
    getPackageVersion: getPackageVersion,
    checkPackageVersion: checkPackageVersion,
    setOptionIf: setOptionIf
};
