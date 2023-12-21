const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const { ProvidePlugin, NormalModuleReplacementPlugin } = require('webpack')

module.exports = {
  target: 'web'
, entry: {
    'popup': './src/popup/index.tsx'
  }
, output: {
    path: path.join(__dirname, 'dist')
  , chunkFilename: 'chunk.[name].js' // 防止生成以`_`开头的文件名, 因为Chrome保留了这些文件名.
  , filename: '[name].js'
  }
, resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  , plugins: [new TsconfigPathsPlugin()]
  , fallback: {
      'util': require.resolve('util')
    , 'path': require.resolve('path-browserify')
    , 'assert': require.resolve('assert')
    , 'buffer': require.resolve('buffer')
    , 'stream': require.resolve('stream-browserify')
    , 'process': require.resolve('process/browser')
    , 'events': require.resolve('events')
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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }
    ]
  }
, plugins: [
    new NormalModuleReplacementPlugin(/^node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, '')

      switch (mod) {
        case 'buffer': {
          resource.request = 'buffer'
          break
        }
        case 'stream': {
          resource.request = 'stream'
          break
        }
        default: throw new Error(`Not found ${mod}`)
      }
    })
  , new ProvidePlugin({
      process: 'process'
    , Buffer: ['buffer', 'Buffer']
    })
  , new CopyPlugin({
      patterns: [
        {
          from: './src'
        , globOptions: {
            ignore: ['**/*.ts', '**/*.tsx', '**/*.html', '**/manifest.*.json']
          }
        }
      , { from: './src/popup/index.html', to: 'popup.html' }
      ]
    })
  ]
}
