"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeLists = exports.customMerge = void 0;
const lodash_1 = __importDefault(require("lodash"));
/**
 * merge with custom handling for lists/arrays:
 *
 * if both objects are lists, do append (non-duplicate) entries from source to target,
 * otherwise use lodash.merge()
 *
 * @param  target target for merging
 * @param  source source for merging
 * @return the merged (target) object
 */
function customMerge(target, source) {
    const mergedLists = mergeLists(target, source);
    if (mergedLists) {
        return mergedLists;
    }
    return lodash_1.default.mergeWith(target, source, mergeLists);
}
exports.customMerge = customMerge;
function mergeLists(objValue, srcValue) {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        const dupe = new Set(objValue);
        for (const e of srcValue) {
            if (!dupe.has(e)) {
                objValue.push(e);
            }
        }
        return objValue;
    }
}
exports.mergeLists = mergeLists;
