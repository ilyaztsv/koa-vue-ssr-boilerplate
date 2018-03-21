const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const resolve = dir => path.join(__dirname, './', dir);
const isProd = process.env.NODE_ENV === 'production';

const webpackConfig = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [resolve('src'), resolve('node_modules')]
  },
  target: 'node', // important in order not to bundle built-in modules like path, fs, etc.
  externals: [
    nodeExternals({
      // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
      whitelist: ['bluebird']
    })
  ],
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

if (isProd) {
  webpackConfig.plugins
    .push
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: true
    // })
    ();
}

module.exports = webpackConfig;
