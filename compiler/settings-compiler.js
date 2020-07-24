"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
// import _ from '.lodash';
var settings_utils_1 = __importDefault(require("../tools/settings-utils"));
var promise_1 = __importDefault(require("../utils/promise"));
var log_utils_1 = __importDefault(require("../utils/log-utils"));
var log = log_utils_1.default.log;
var warn = log_utils_1.default.warn;
function writeDirectoriesJson(directories, targetDir) {
    return fs.ensureDir(targetDir).then(function () {
        return fs.writeFile(path.join(targetDir, 'directories.json'), JSON.stringify(directories), 'utf8').catch(function (err) {
            var msg = 'ERROR writing directories.json to ' + targetDir + ': ';
            warn(msg, err);
            return err.stack ? err : new Error(msg + err);
        });
    });
}
function getSettingTargetPath(setting, targetDir) {
    if (setting.type === 'configuration') {
        return path.join(targetDir, 'configuration.json');
    }
    var fileName;
    switch (setting.type) {
        case 'dictionary':
            fileName = 'dictionary.json';
            break;
        case 'grammar':
            fileName = 'grammar.json';
            break;
        case 'speech':
            fileName = 'speech.json';
            break;
        default:
            warn('settingsCompiler: cannot determine target file path for settings with unknown type ' + setting.type);
    }
    if (fileName) {
        return path.join(targetDir, 'languages', setting.id, fileName);
    }
}
function prepareWriteSettings(settings, settingsOptions) {
    settings_utils_1.default.applyDefaultOptions(settingsOptions, settings);
    return promise_1.default.resolve();
}
/**
 * HELPER write settings files to config/* (for configuration settings) and
 *        to config/languages/<id>/* (for dictionary, grammar, and speech settings),
 *        if settings options specify that files should be written.
 *
 * @param  {Array<SettingsEntry>} settings the list of settings
 * @param  {SettingsOptions} settingsOptions the settings options
 */
function writeSettings(settings, settingsOptions) {
    // include all settings that
    // (1) do not match the exclude-type pattern
    // (2) are not specifically excluded
    // (3) have include-type 'file'
    var excludeTypePattern = settingsOptions.excludeTypePattern;
    var procSettings = settings.filter(function (item) {
        if (settings_utils_1.default.isExcludeType(item.type, excludeTypePattern)) {
            return false;
        }
        return !item.exclude && item.include === 'file';
    });
    //log('processing settings: ', settings, settingsOptions, ' -> writing ', procSettings);
    var tasks = [];
    procSettings.forEach(function (setting) {
        var targetPath = getSettingTargetPath(setting, settingsOptions.targetDir);
        if (!targetPath) {
            return;
        }
        var t = fs.pathExists(targetPath).then(function (exists) {
            if (!exists || setting.force) {
                return fs.ensureDir(path.dirname(targetPath)).then(function () {
                    if (setting.include === 'file' && !setting.value) {
                        return fs.copyFile(setting.file, targetPath).catch(function (err) {
                            var msg = 'ERROR copying file to ' + targetPath + ': ';
                            warn(msg, err);
                            return err.stack ? err : new Error(msg + err);
                        });
                    }
                    else {
                        return fs.writeFile(targetPath, JSON.stringify(setting.value), 'utf8').catch(function (err) {
                            var msg = 'ERROR writing ' + targetPath + ': ';
                            warn(msg, err);
                            return err.stack ? err : new Error(msg + err);
                        });
                    }
                });
            }
            else {
                log('omit writing ' + setting.type + ' to ' + targetPath + ', since it already exists'); //: ', setting);
            }
        });
        tasks.push(t);
    });
    return promise_1.default.all(tasks);
}
module.exports = {
    writeDirectoriesJson: writeDirectoriesJson,
    writeSettings: writeSettings,
    prepareWriteSettings: prepareWriteSettings
};
