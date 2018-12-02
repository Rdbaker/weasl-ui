const merge = require('webpack-merge');
const path = require('path');

const common = require('./base.config.js');

module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '..', '..', 'dist'),
    filename: 'app.[chunkhash].js',
    sourceMapFilename: 'app.[chunkhash].js.map',
  },
});
