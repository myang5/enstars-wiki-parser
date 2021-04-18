const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
// const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');

const CKEditorCSSRegex = /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/;
const excludeFilesRegex = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, './src/ckeditor5'),
];

// follow this guide for splitting:
// https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758

module.exports = {
  entry: {
    index: './src/index.js',
    // TODO: Code splitting throws duplicate modules error but page loads anyway
    // ckeditor: './src/components/TabContent/CKEditor.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'src/assets/'),
      Styles: path.resolve(__dirname, 'src/styles/'),
      Utils: path.resolve(__dirname, 'src/utils/'),
      Constants: path.resolve(__dirname, 'src/constants/'),
      'react-dom': '@hot-loader/react-dom',
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/assets/favicon.ico',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        exclude: excludeFilesRegex,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
      {
        test: /\.css$/i,
        exclude: [excludeFilesRegex, CKEditorCSSRegex],
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/i,
        exclude: [excludeFilesRegex, CKEditorCSSRegex],
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpg|ico)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
        },
      },
      // rules for CKEditor
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
        use: ['raw-loader'],
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
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
              },
              minify: true,
            }),
          },
        ],
      },
    ],
  },
};
