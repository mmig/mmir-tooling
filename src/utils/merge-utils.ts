
import _ from 'lodash';

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
export function customMerge<TObject, TSource>(target: TObject, source: TSource): TObject & TSource {
    const mergedLists = mergeLists(target, source);
    if(mergedLists){
        return mergedLists;
    }
    return _.mergeWith(target, source, mergeLists);
}

export function mergeLists(objValue: any, srcValue: any): any {
    if(Array.isArray(objValue) && Array.isArray(srcValue)){
        const dupe = new Set(objValue);
        for(const e of srcValue){
            if(!dupe.has(e)){
                objValue.push(e);
            }
        }
        return objValue;
    }
}
