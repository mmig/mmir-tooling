"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
// import _ from '.lodash';
const settings_utils_1 = __importDefault(require("../tools/settings-utils"));
const promise_1 = __importDefault(require("../utils/promise"));
const log_utils_1 = __importDefault(require("../utils/log-utils"));
const log = log_utils_1.default.log;
const warn = log_utils_1.default.warn;
function writeDirectoriesJson(directories, targetDir) {
    return __awaiter(this, void 0, void 0, function* () {
        return fs_extra_1.default.ensureDir(targetDir).then(function () {
            return __awaiter(this, void 0, void 0, function* () {
                return fs_extra_1.default.writeFile(path_1.default.join(targetDir, 'directories.json'), JSON.stringify(directories), 'utf8').catch(function (err) {
                    var msg = 'ERROR writing directories.json to ' + targetDir + ': ';
                    warn(msg, err);
                    return err.stack ? err : new Error(msg + err);
                });
            });
        });
    });
}
function getSettingTargetPath(setting, targetDir) {
    if (setting.type === 'configuration') {
        return path_1.default.join(targetDir, 'configuration.json');
    }
    let fileName;
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
        return path_1.default.join(targetDir, 'languages', setting.id, fileName);
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
        var t = fs_extra_1.default.pathExists(targetPath).then(function (exists) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!exists || setting.force) {
                    return fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath)).then(function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (setting.include === 'file' && !setting.value) {
                                return fs_extra_1.default.copyFile(setting.file, targetPath).catch(function (err) {
                                    var msg = 'ERROR copying file to ' + targetPath + ': ';
                                    warn(msg, err);
                                    return err.stack ? err : new Error(msg + err);
                                });
                            }
                            else {
                                return fs_extra_1.default.writeFile(targetPath, JSON.stringify(setting.value), 'utf8').catch(function (err) {
                                    var msg = 'ERROR writing ' + targetPath + ': ';
                                    warn(msg, err);
                                    return err.stack ? err : new Error(msg + err);
                                });
                            }
                        });
                    });
                }
                else {
                    log('omit writing ' + setting.type + ' to ' + targetPath + ', since it already exists'); //: ', setting);
                }
            });
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
