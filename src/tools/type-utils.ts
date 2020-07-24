
import { BuildAppConfig } from '../index.d';
import { WebpackAppConfig } from '../index-webpack.d';

export function isWebpackConfig(config: BuildAppConfig | WebpackAppConfig): config is WebpackAppConfig {
    return config && (config as WebpackAppConfig).paths !== undefined;
}
