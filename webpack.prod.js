const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production'
, devtool: 'source-map'
, optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      , sourceMap: true
      , extractComments: false
      })
    ]
  }
})
