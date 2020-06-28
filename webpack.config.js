const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

//const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //can be used to make sure dist folder doesn't have unused files

module.exports = {
  entry: {
    index: './src/index.js',
    ckeditor: './ckeditor5/build/ckeditor.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'src/assets/'),
    }
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /(node_modules|ckeditor)/,
        loader: 'babel-loader',
        options: {
          "presets": ["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /\.css$/i,
        exclude: /(node_modules|ckeditor)/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|ico)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
        }
      },
    ]
  },
};