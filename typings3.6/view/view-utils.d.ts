import { ViewBuildOptions, ViewEntry, BuildAppConfig, ImplementationBuildEntry, ResourceConfig, RuntimeConfiguration, DirectoriesInfo, ViewBuildEntry } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';
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
    viewTemplatesFromDir: (dir: string, appRootDir: string, options?: ViewBuildOptions) => ViewBuildEntry[];
    /**
     * apply the "global" options from `options` or default values to the entries
     * from `viewList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {ViewOptions} options the view options
     * @param  {{Array<ViewEntry>}} viewList
     * @return {{Array<ViewEntry>}}
     */
    applyDefaultOptions: (options: ViewBuildOptions, viewList: ViewEntry[]) => ViewEntry[];
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
    addViewsToAppConfig: (views: ViewEntry[], ctrls: ImplementationBuildEntry[], appConfig: BuildAppConfig | WebpackAppConfig, directories: DirectoriesInfo, resources: ResourceConfig, _runtimeConfiguration: RuntimeConfiguration) => void;
};
export = _default;
