
import logUtils from '../utils/log-utils';
const warn = logUtils.warn;

export type PackageJson = {[field: string]: any};
/** simplified interface for read-pkg-up (with backwards compatibility for result) */
export interface ReadPkgUp {
    sync({cwd: string}): {packageJson?: PackageJson, pkg?: PackageJson};
}
/** simplified interface for semver */
export interface SemVer {
    satisfies(versionString: string, requirementString: string): boolean;
}

function saveRequire(pkg: string) {
    try {
        return require(pkg);
    } catch(err){
        warn('mmir-webpack: could not initialize '+pkg+', may need to install it  '+err, err);
    }
}

var readUp: ReadPkgUp;
function initPackageReader(): undefined | ReadPkgUp {
    if(!readUp){
        readUp = saveRequire('read-pkg-up');
    }
    return readUp;
}

var semVer: SemVer;
function initSemVer(): undefined | SemVer {
    if(!semVer){
        semVer = saveRequire('semver');
    }
    return semVer;
}

function getPackageVersion(packageId: string): undefined | PackageJson {
    initPackageReader();
    if(!readUp){
        warn('mmir-webpack: could not load package '+packageId+', because of missing dependencies!');
        return void(0);
    }
    const workerLoaderPkg = readUp.sync({cwd: require.resolve(packageId)});
    return workerLoaderPkg && (workerLoaderPkg.packageJson || workerLoaderPkg.pkg);
}

function checkPackageVersion(packageId: string, versionRequirement: string): undefined | boolean {
    const packageJson = getPackageVersion(packageId);
    initSemVer();
    if(!packageJson || !semVer){
        warn('mmir-webpack: could not determine version of package '+packageId+', because of missing dependencies!');
        return void(0);
    }
    try {
        return semVer.satisfies(packageJson.version, versionRequirement)
    } catch(err){
        warn('mmir-webpack: could not determine version of '+packageId+'! '+err, err);
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
function setOptionIf(options: any, optionNameIfTrue: string, optionNameIfFalse: string, value: any, useIfNone: boolean, packageId: string, packageVersionRequirement: string): any {

    let isReqTrue = checkPackageVersion(packageId, packageVersionRequirement);
    if(typeof isReqTrue !== 'boolean'){
        isReqTrue = useIfNone;
    }
    options[isReqTrue? optionNameIfTrue : optionNameIfFalse] = value;
    return options;
}

module.exports = {
    getPackageVersion: getPackageVersion,
    checkPackageVersion: checkPackageVersion,
    setOptionIf: setOptionIf
}
