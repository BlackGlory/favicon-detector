const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  target: 'web'
, node: {
    fs: 'empty'
  }
, entry: {
    'background': './src/background/index.ts'
  , 'popup': './src/popup/index.tsx'
  }
, output: {
    path: path.join(__dirname, 'dist')
  , filename: '[name].js'
  }
, resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  , plugins: [new TsconfigPathsPlugin()]
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
    new CopyPlugin({
      patterns: [
        {
          from: './src'
        , globOptions: {
            ignore: ['**/*.ts', '**/*.tsx', '**/*.html']
          }
        }
      , { from: './src/popup/index.html', to: 'popup.html' }
      , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js' }
      , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map' }
      ]
    })
  ]
}
