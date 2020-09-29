import { ImplementationType, ImplementationBuildEntry, AnyImplementationOptions, DirectoriesInfo, ResourceConfig, RuntimeConfiguration, BuildAppConfig, ViewBuildEntry } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';
declare const _default: {
    /**
     * [description]
     * @param  {"controller" | "helper" | "model"} mode the kind of implementation (modules) that the directory contains
     * @param  {ImplOptions} options the implementation options where
     * 										options.path: REQUIRED the directory from which to add the implementations, and has the following structure:
     * 																				<directory>/<module-id-1>.js
     * 																				<directory>/<module-id-2>.js
     * 																				...
     * 										options["controllers" | "helpers" | "models"]: OPTIONAL a map of impl. IDs, i.e. {[implID: string]: ImplOption} with specific options for processing the corresponding implementation:
     *														options[types][id].exclude {Boolean}: OPTIONAL if <code>true</code>, the corresponding implementation will be excluded
     *														options[types][id].addModuleExport {Boolean|String}: OPTIONAL if <code>true</code>, the implementation will be exported,
     *																																				i.e. will be made a "requireable module"; the exported variable will be the impl. name,
     *																																				or, if addModuleExport is a String, this String will be used.
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param {Array<ImplEntry>} [implList] OPTIONAL list of ImplEntry objects, to which the new entries (read from the options.directory) will be added
     * 																					if omitted, a new list will be created and returned.
     * 										ImplEntry.id {String}: the implementation ID
     * 										ImplEntry.name {String}: the implementation's name (usually the ID with capitalized first letter)
     * 										ImplEntry.type {"controller" | "helper" | "model"}: the implementation's type
     * 										ImplEntry.file {String}: the path to the implementation's file
     *										ImplEntry.addModuleExport {Boolean|String}: OPTIONAL if <code>true</code>, the implementation will be exported,
     *																																				i.e. will be made a "requireable module"; the exported variable will be the impl. name,
     *																																				or, if addModuleExport is a String, this String will be used.
     * @return {Array<ImplEntry>} the list of ImplEntry objects
     */
    implFromDir: (mode: ImplementationType, options: AnyImplementationOptions, appRootDir: string, implList: ImplementationBuildEntry[]) => ImplementationBuildEntry[];
    /**
     * add implementations form options[mode+'s'] map {[implID: string]: ImplOption}, if the ImplOption has a <code>file</code> field set.
     * @param  {"controller" | "helper" | "model"} mode the kind of implementation (modules) that the directory contains
     * @param  {ImplOptions} options the implementation options with field options[mode+'s'], e.g. option.controllers for mode "controller"
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param  {{Array<ImplEntry>}} [implList] OPTIONAL
     * @return {{Array<ImplEntry>}}
     */
    implFromOptions: (mode: ImplementationType, options: AnyImplementationOptions, appRootDir: string, implList: ImplementationBuildEntry[]) => ImplementationBuildEntry[];
    /**
     * apply the "global" options from `options` or default values to the entries
     * from `implList` if its corresponding options-field is not explicitly specified.
     *
     * @param  {ImplOptions} options the implementation options
     * @param  {{Array<ImplEntry>}} implList
     * @return {{Array<ImplEntry>}}
     */
    applyDefaultOptions: (options: AnyImplementationOptions, implList: ImplementationBuildEntry[] | ViewBuildEntry[]) => ImplementationBuildEntry[] | ViewBuildEntry[];
    /**
     * add implementations to (webpack) app build configuration
     *
     * @param  {Array<ImplEntry>} implList list of ImplEntry objects:
     * 										impl.id {String}: the impl id (usually the language code, e.g. "en" or "de")
     * 										impl.file {String}: the path to the JSON impl (from which the executable impl will be created)
     * @param  {[type]} appConfig the app configuration to which the implementations will be added
     * @param  {[type]} directories the directories.json representation
     * @param  {ResourcesConfig} _resources the resources configuration
     * @param  {[type]} runtimeConfiguration the configuration.json representation
     */
    addImplementationsToAppConfig: (implList: ImplementationBuildEntry[], appConfig: BuildAppConfig | WebpackAppConfig, directories: DirectoriesInfo, _resources: ResourceConfig, _runtimeConfiguration: RuntimeConfiguration) => void;
};
export = _default;
