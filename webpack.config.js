const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const devConfigs = require('./configs/development')

module.exports = function makeWebpackConfig(mode) {
  /**
   * Environment type
   * BUILD is for generating minified builds
   * TEST is for generating test builds
   */
  const BUILD = mode === 'build'
  const TEST = mode === 'test'
  const DEV = mode === 'dev'
  const DEV_PUBLIC_PATH = `http://${devConfigs.host}:${devConfigs.port}/`

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  const config = {
    mode: DEV ? 'development' : 'production',
    cache: DEV
  }

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  if (!TEST) {
    config.entry = ['./client/client.js']
  }

  if (DEV) {
    config.entry.unshift(`webpack-dev-server/client?${DEV_PUBLIC_PATH}`, 'webpack/hot/dev-server')
  }

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  if (TEST) {
    config.output = {}
  } else {
    config.output = {
      // Absolute output directory
      path: path.join(__dirname, '/dist/'),

      // Output path from the view of the page
      // Uses webpack-dev-server in development
      publicPath: BUILD ? '/' : DEV_PUBLIC_PATH,

      // Filename for entry points
      // Only adds hash in build mode
      filename: BUILD ? '[name].[hash].js' : '[name].js',

      // Filename for non-entry points
      // Only adds hash in build mode
      chunkFilename: BUILD ? '[name].[hash].js' : '[name].js'
    }
  }

  config.resolve = {
    extensions: ['.js']
    // alias: {
    //   primus: path.resolve(__dirname, 'client/components/socket/primus.js')
    // }
  }

  if (TEST) {
    config.resolve = {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx']
      // alias: {
      //   // for some reason the primus client and webpack don't get along in test
      //   primus: path.resolve(__dirname, 'client/components/socket/primus.mock.js')
      // }
    }
  }

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (TEST) {
    config.devtool = 'inline-source-map'
  } else if (BUILD || DEV) {
    config.devtool = 'source-map'
  } else {
    config.devtool = 'eval'
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */
  // Initialize module
  config.module = {
    rules: [
      {
        // Reference: https://github.com/babel/babel-loader
        // Transpile .js files using babel-loader
        // Compiles ES6 and ES7 into ES5 code
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // This is a feature of `babel-loader` for Webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              plugins: ['react-hot-loader/babel']
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        // Reference: https://github.com/webpack/file-loader
        // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
        // Rename the file using the asset hash
        // Pass along the updated reference to your code
        // You can add here any file extension you want to get copied to your output
        // eslint-disable-next-line
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)([\?]?.*)$/,
        use: 'file-loader'
      },
      {
        // Reference: https://github.com/webpack/raw-loader
        // Allow loading html through js
        test: /\.html$/,
        use: 'raw-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['extracted-loader'].concat(
          ExtractTextPlugin.extract({
            use: [
              'babel-loader',
              {
                loader: 'css-loader',
                options: {
                  url: true,
                  minimize: !DEV,
                  sourceMap: DEV,
                  importLoaders: 2
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: DEV,
                  plugins: [
                    require('autoprefixer')
                  ]
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: DEV
                }
              }
            ]
          })
        )
      }
    ]
  }

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin({
      filename: DEV ? '[name].css' : '[name].[hash].css',
      disable: false
      // allChunks: !DEV
    }),

    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      },
      sassLoader: {
        outputStyle: 'compressed',
        precision: 10,
        sourceComments: false
      },
      babel: {
        comments: false
      }
    })
  ]

  if (!TEST) {
    config.optimization = {
      minimizer: [],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'common',
            chunks: 'all'
          }
        }
      }
    }
  }

  // Add build specific plugins
  if (BUILD) {
    config.optimization.minimizer.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new UglifyJSPlugin({
        uglifyOptions: {
          mangle: false,
          output: {
            comments: false
          },
          compress: {
            warnings: false
          }
        }
      })
    )
  }

  if (DEV) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if (TEST) {
    config.stats = {
      colors: true,
      reasons: true
    }
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:9000',
    //     secure: false
    //   },
    //   '/auth': {
    //     target: 'http://localhost:9000',
    //     secure: false
    //   },
    //   '/primus': {
    //     target: 'http://localhost:9000',
    //     secure: false,
    //     ws: true
    //   }
    // }
  }

  config.node = {
    global: true,
    process: true,
    crypto: false,
    clearImmediate: false,
    setImmediate: false
  }

  return config
}
