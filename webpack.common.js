const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { ProvidePlugin } = require('webpack')

module.exports = {
  target: 'web'
, entry: {
    'popup': './src/popup/index.tsx'
  }
, output: {
    path: path.join(__dirname, 'dist')
  , filename: '[name].js'
  }
, resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  , plugins: [new TsconfigPathsPlugin()]
  , fallback: {
      'util': require.resolve('util/')
    , 'path': require.resolve('path-browserify')
    , 'assert': require.resolve('assert/')
    , 'buffer': require.resolve('buffer/')
    , 'process': require.resolve('process/browser')
    , 'events': require.resolve('events/')
    , 'fs': false
    }
  }
, module: {
    rules: [
      {
        test: /\.tsx?$/
      , exclude: /node_module/
      , use: 'ts-loader'
      }
    , {
        test: /\.css$/i
      , use: ['style-loader', 'css-loader']
      }
    ]
  }
, plugins: [
    new ProvidePlugin({
      process: 'process'
    , Buffer: ['buffer', 'Buffer']
    })
  , new CopyPlugin({
      patterns: [
        { from: './src', globOptions: { ignore: ['**/*.ts', '**/*.tsx', '**/*.html'] }}
      , { from: './src/popup/index.html', to: 'popup.html' }
      , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js' }
      , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map' }
      ]
    })
  ]
}
