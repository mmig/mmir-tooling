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
export declare function customMerge<TObject, TSource>(target: TObject, source: TSource): TObject & TSource;
export declare function mergeLists(objValue: any, srcValue: any): any;
