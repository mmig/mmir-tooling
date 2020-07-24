declare const _default: {
    /**
     * add views from a base-directory that adheres to the structure:
     * <pre>
     * <dir>/<controller name 1>/view1.ehtml
     *                          /view2.ehtml
     *                          ...
     * <dir>/<controller name 2>/view1.ehtml
     *                          /view2.ehtml
     *                          ...
     * ...
     * <dir>/layouts/default.ehtml
     *              /<controller name 1>.ehtml
     *              ...
     * </pre>
     * @param  {String} dir the direcotry from which to parse/collect the views
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param  {ViewOptionMap} [options] OPTIONAL
     * 										unsupported TODO
     * @return {Array<ViewEntry>} a list of ViewEntry objects:
     * 									{
     * 										id: String
     * 										ctrlName: String,
     * 										viewName: String,
     * 										file: String,
     * 										viewImpl: 'mmirf/layout' | 'mmirf/partial' | 'mmirf/view',
     * 										isLayout: Boolean
     * 										isPartial: Boolean
     * 									}
     */
    viewTemplatesFromDir: (dir: any, appRootDir: any, options?: any) => any[];
    /**
     * apply the "global" options from `options` or default values to the entries
     * from `viewList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {ViewOptions} options the view options
     * @param  {{Array<ViewEntry>}} viewList
     * @return {{Array<ViewEntry>}}
     */
    applyDefaultOptions: (options: any, viewList: any) => any;
    /**
     * add views to (webpack) app build configuration
     *
     * @param  {Array<ViewEntry>} view list of ViewEntry objects:
     * 										view.id {String}: the view id
     * 										view.file {String}: the path to the eHTML view template (from which the executable view will be created)
     * @param  {Array<ControllerEntry>} ctrls list of ControllerEntry objects:
     * 										ctrl.id {String}: the controller id
     * @param  {[type]} appConfig the app configuration to which the views will be added
     * @param  {[type]} directories the directories.json representation
     * @param  {ResourcesConfig} resources the resources configuration
     * @param  {[type]} runtimeConfiguration the configuration.json representation
     */
    addViewsToAppConfig: (views: any, ctrls: any, appConfig: any, directories: any, resources: any, _runtimeConfiguration: any) => void;
};
export = _default;
