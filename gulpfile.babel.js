/* eslint-disable all, camelcase */
import del from 'del'
import gulp from 'gulp'
import fs from 'fs'
// import gulpLoadPlugins from 'gulp-load-plugins'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import gutil from 'gulp-util'
import runSequence from 'run-sequence'
import os from 'os'

import makeWebpackConfig from './webpack.config'
import devConfigs from './configs/development'
import paths from './configs/paths'

// const plugins = gulpLoadPlugins()
const { host, port } = devConfigs

gulp.task('webpack-dev-server', () => {
  const configs = makeWebpackConfig('dev')
  const compiler = webpack(configs)

  // Start a webpack-dev-server
  new WebpackDevServer(compiler, {
    publicPath: configs.output.publicPath,
    contentBase: './client/',
    historyApiFallback: true,
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false,
      children: false
    }
  }).listen(port, host, (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log('webpack-dev-server => address:', configs.output.publicPath)
    gutil.log('webpack-dev-server => process: building modules ...')
  })
})

gulp.task('clean', () => del(['dist/**/*'], { dot: true }))

// Gulp development mode
gulp.task('dev', (cb) => {
  runSequence(
    'clean',
    'assets',
    'webpack-dev-server',
    cb
  )
})

gulp.task('assets', (cb) => {
  const eslintString = `/* eslint-disable */${os.EOL}`
  fs.writeFile(paths.assets_file_path, `${eslintString}module.exports = ${JSON.stringify({
    assets: {
      style: paths.assets_style,
      main: paths.assets_main,
      common: paths.assets_common
    }
  }, null, 2)}`, cb)
})

