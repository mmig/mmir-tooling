
const path = require('path');
const _ = require('lodash')

const base = {
  entry: {
    'md5': './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'CryptoJS'
  },
  resolve: {
    extensions: ['.js']
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
