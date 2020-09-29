import { StateOptions, StateModelBuildEntry, StateModelEntry, StateBuildOptions, DirectoriesInfo, ResourceConfig, RuntimeConfiguration } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';
declare const _default: {
    /**
     * [description]
     * @param  {ScxmlOptions} options the SCXML model options where
     * 										options.path: REQUIRED the directory from which to add the scxml models, and has the following structure:
     * 																				<directory>/../dialog.xml
     * 																				<directory>/../input.xml
     * 																				...
     * 										options.models: OPTIONAL a map of SCXML model IDs, i.e. {[scxmlID: string]: ScxmlOption} with specific options for compiling the corresponding SCXML model:
     *														options.models[id].exclude {Boolean}: OPTIONAL if <code>true</code>, the corresponding SCXML model will be completely excluded, i.e. no executable state model will be compiled
     *																																				from the corresponding SCXML state model definition
     *														options.models[id].mode {"extended" | "simple"}: OPTIONAL run SCXML modle in "simple" or "extended" mode,
     *																																				DEFAULT: "extended"
     * @param {String} appRootDir the root directory of the app (against which relative paths will be resolved)
     * @param {Array<ScxmlEntry>} [stateModels] OPTIONAL list of ScxmlEntry objects, to which the new entries (read from the options.directory) will be added
     * 																					if omitted, a new list will be created and returned.
     * 										ScxmlEntry.id {String}: the SCXML engine ID (one of "input" or "dialog")
     * 										ScxmlEntry.file {String}: the path to the SCXML file (from which the executable state model will be created)
     * 										ScxmlEntry.mode {"extended" | "simple"}: run SCXML modle in "simple" or "extended" mode, DEFAULT: "extended"
     * @return {Array<ScxmlEntry>} the list of ScxmlEntry objects
     */
    scxmlFromDir: (options: StateOptions, appRootDir: string, stateModels: StateModelEntry[]) => StateModelBuildEntry[];
    scxmlFromOptions: (options: StateOptions, appRootDir: string, stateModels: StateModelEntry[]) => StateModelBuildEntry[];
    scxmlDefaults: (options: StateBuildOptions, appRootDir: string, stateModels: StateModelEntry[]) => StateModelBuildEntry[];
    /**
     * apply the "global" options from `options` or default values to the entries
     * from `stateModels` if its corresponding options-field is not explicitly specified.
     *
     * @param  {ScxmlOptions} options the state-models options
     * @param  {{Array<ScxmlEntry>}} stateModels
     * @return {{Array<ScxmlEntry>}}
     */
    applyDefaultOptions: (options: StateOptions, stateModels: StateModelEntry[]) => StateModelBuildEntry[];
    /**
     * add SCXML models to (webpack) app build configuration
     *
     * @param  {Array<ScxmlEntry>} stateModels list of ScxmlEntry objects:
     * 										stateModel.id {String}: the SCXML id ("dialog" | "input")
     * 										stateModel.file {String}: the path to the SCXML file (from which the executable SCXML model will be created)
     * @param  {[type]} appConfig the app configuration to which the SCXML models will be added
     * @param  {[type]} directories the directories.json representation
     * @param  {ResourcesConfig} resources the resources configuration
     * @param  {[type]} _runtimeConfiguration the configuration.json representation
     */
    addStatesToAppConfig: (stateModels: StateModelBuildEntry[], appConfig: WebpackAppConfig, directories: DirectoriesInfo, resources: ResourceConfig, _runtimeConfiguration: RuntimeConfiguration) => void;
};
export = _default;
