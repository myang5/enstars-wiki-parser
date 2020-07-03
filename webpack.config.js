const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');

//const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //can be used to make sure dist folder doesn't have unused files

const CKEditorCSSRegex = /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/;
const excludeFilesRegex = [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, './src/ckeditor5')];

module.exports = {
  entry: {
    index: './src/index.js',
    //ckeditor: './src/components/build/ckeditor.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'src/assets/'),
      Styles: path.resolve(__dirname, 'src/styles/')
    }
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css'}),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin(),
    new CKEditorWebpackPlugin({
      language: 'en',
      //additionalLanguages: 'all'
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: excludeFilesRegex,
        loader: 'babel-loader',
        options: {
          "presets": ["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /\.css$/i,
        exclude: [excludeFilesRegex, CKEditorCSSRegex],
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|ico)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
        }
      },
      //rules for CKEditor
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader']
      },
      {
        test: CKEditorCSSRegex,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
              },
              minify: true
            })
          },
        ]
      }
    ]
  },
};