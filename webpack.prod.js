const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // can be used to make sure dist folder doesn't have unused files

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].bundle.js'
  },
  plugins: [ new CleanWebpackPlugin() ]
});