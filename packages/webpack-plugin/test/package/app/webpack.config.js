const webpack = require('webpack');
const { BundleStatsWebpackPlugin } = require('../../../');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {},
  plugins: [
    new BundleStatsWebpackPlugin(),
    new webpack.container.ModuleFederationPlugin({
      name: 'app',
      filename: 'remoteEntry.js',
      exposes: {
          'Index': './src/index.js'
      },
    })
  ],
};
