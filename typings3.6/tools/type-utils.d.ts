import { BuildAppConfig } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';
export declare function isWebpackConfig(config: BuildAppConfig | WebpackAppConfig): config is WebpackAppConfig;
