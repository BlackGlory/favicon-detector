const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const ExtensionReloader = require('webpack-extension-reloader')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = merge(common, {
  mode: 'development'
, devtool: 'inline-source-map'
, plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static' })
  , new ExtensionReloader({
      manifest: path.resolve(__dirname, './src/manifest.json')
    })
  ]
})
