const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require( 'path' );

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');


const common = require('./webpack.common.js')


module.exports = merge(common, {
  // Set the mode to development or production
  mode: 'development',
  // watch: true,
  // watchOptions: {
  //   ignored: '**/node_modules/',
  // },

  devServer: {
    // watchOptions: {
    //   ignored: '**/node_modules/'
    // },
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    },
    allowedHosts: [
        'seed.aharoni-lab.com']


  },

  // Control how source maps are generated
  devtool: 'inline-source-map',

  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test:/\.(s[ac]ss)$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
    ],
  },

  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin()
  ],
})
