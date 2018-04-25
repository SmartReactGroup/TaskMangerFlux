/* eslint-disable all, camelcase */
import del from 'del'
import gulp from 'gulp'
import fs from 'fs'
import open from 'open'
import http from 'http'
// import gulpLoadPlugins from 'gulp-load-plugins'
import nodemon from 'gulp-nodemon'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import gutil from 'gulp-util'
import runSequence from 'run-sequence'
import os from 'os'
import browserSync from 'browser-sync'

import makeWebpackConfig from './webpack.config'
import { development, server } from './configs'
import paths from './configs/paths'

// const plugins = gulpLoadPlugins()
const browserSyncServer = browserSync.create()
const { host, port } = development
// const devURI = `http://${host}:${port}`
const serURI = `http://${server.host}:${server.port}`

const browserSyncPort = 9000
const browserSyncURL = `http://${server.host}:${browserSyncPort}`
let firstStart = true

function checkAppReady(p, cb) {
  const options = {
    host,
    port: p
  }
  http
    .get(options, () => cb(true))
    .on('error', () => cb(false));
}

// Call page until first success
function whenServerReady(p, cb) {
  let serverReady = false
  const appReadyInterval = setInterval(() =>
    checkAppReady(p, (ready) => {
      if (!ready || serverReady) {
        return
      }
      clearInterval(appReadyInterval)
      serverReady = true
      cb()
    }), 500)
}

gulp.task('browser-sync', () => {
  browserSyncServer.init({
    proxy: serURI,
    port: browserSyncPort,
    open: false
  })
})

gulp.task('webpack-dev-server', () => {
  const configs = makeWebpackConfig('dev')
  const compiler = webpack(configs)
  const devOptions = {
    publicPath: configs.output.publicPath,
    contentBase: './client/',
    historyApiFallback: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false,
      children: false
    }
  }

  // Start a webpack-dev-server
  new WebpackDevServer(compiler, devOptions).listen(port, host, (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log('webpack-dev-server => address:', configs.output.publicPath)
    gutil.log('webpack-dev-server => process: building modules ...')
  })
})

gulp.task('clean', () => del(['dist/**/*'], { dot: true }))

gulp.task('env:dev', (cb) => {
  process.env.NODE_ENV = 'development'
  cb()
})

gulp.task('express:dev', () => {
  nodemon({
    script: paths.prod_server_path,
    ext: 'js',
    ignore: ['dist/', 'node_modules/', 'client/'],
    tasks: []
  })
    .on('start', () => {
      whenServerReady(browserSyncPort, () => {
        if (firstStart) {
          open(browserSyncURL)
        } else {
          browserSync.reload()
        }
      })
    })
})

gulp.task('express:prod', () => {
  // Node express server production mode
  // eslint-disable-next-line
  require(paths.prod_server_path)
})

gulp.task('open', () => {
  open(paths.express_server_address)
})

// Gulp development mode
gulp.task('dev', (cb) => {
  runSequence('clean', 'assets', 'env:dev', ['webpack-dev-server', 'express:dev'], 'browser-sync', cb)
})

gulp.task('assets', (cb) => {
  const eslintString = `/* eslint-disable */${os.EOL}`
  fs.writeFile(
    paths.assets_file_path,
    `${eslintString}module.exports = ${JSON.stringify(
      {
        style: paths.assets_style,
        main: paths.assets_main,
        common: paths.assets_common
      },
      null,
      2
    )}`,
    cb
  )
})
