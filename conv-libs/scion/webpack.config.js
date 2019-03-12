
const path = require('path');
const _ = require('lodash')

const base = {
  entry: {
    'scion-core-lib': './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'scionCoreLib'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};

var dev = _.merge(_.cloneDeep(base), {
  name: 'dev',
  mode: 'development',
  devtool: false
});

var prod = _.merge(_.cloneDeep(base), {
  name: 'prod',
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].min.js'
  }
});

module.exports = [dev, prod];
