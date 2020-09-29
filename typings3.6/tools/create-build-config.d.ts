import { BuildAppConfig, ResourceConfig, BuildConfig } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';
export declare function createBuildConfig(mmirAppConfig: BuildAppConfig | WebpackAppConfig, resourcesConfig: ResourceConfig): BuildConfig | string;
