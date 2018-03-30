const webpack = require('webpack')
const path = require('path')

const webpackConfig = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: ['webpack-dev-server/client?http://localhost:3000', 'webpack/hot/only-dev-server', './client.js'],
  output: {
    path: path.resolve('./build/js'),
    publicPath: '/public/js/',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      { test: /\.json$/, use: 'json-loader' }
    ]
  },
  node: {
    setImmediate: false
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = webpackConfig
