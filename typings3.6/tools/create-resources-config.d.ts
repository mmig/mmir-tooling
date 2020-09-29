import { ResourceConfig } from '../index.d';
/**
 * create config for mmir resources:
 *
 *  * paths: the mapping moduleID -> resourcePath (combined default mmir paths & removePathsList & customPaths)
 *  * workers: list of resourcePaths that are entry points for WebWorkers
 *  * fileResources: list of resourcePaths that refer to "raw"/binary files (e.g. mp3 audio, css stylesheets)
 *  * textResources: list of resourcePaths that refer to plain text files
 *  * resourcesPaths: mapping for resourcePaths {[sourcePath: string]: TargetPath}, i.e. specifies replacement of source-file by the traget-file
 *
 * @param  {Array<string>} [removePathsList] list of module IDs that will be removed from the mmir paths mapping
 * @param  {{[moduleId: string]: string}} [customPaths] mapping of additional/overriding module IDs to URI/paths
 * @return {ResourcesConfig} the resource config object
 */
declare function createResourcesConfig(removePathsList?: string[], customPaths?: {
    [id: string]: string;
}): ResourceConfig;
export = createResourcesConfig;
