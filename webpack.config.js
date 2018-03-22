const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const resolve = dir => path.join(__dirname, './', dir);
const isProd = process.env.NODE_ENV === 'production';

const webpackConfig = {
  devtool: isProd ? 'source-map' : 'eval',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'lib/index.js',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [resolve('src'), resolve('node_modules')]
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },
  plugins: []
};

module.exports = webpackConfig;
