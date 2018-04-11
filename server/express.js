/**
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */

import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import path from 'path'
import serialize from 'serialize-javascript'
import { navigateAction } from 'fluxible-router'
import debugLib from 'debug'
import React from 'react'
import ReactDOM from 'react-dom/server'
import { createElementWithContext } from 'fluxible-addons-react'

import serverConfig from '../configs/server'
import assets from '../configs/assets'
import app from '../client/app'
import HtmlComponent from '../client/components/Html'
import APIS from './api'

// const env = process.env.NODE_ENV
const debug = debugLib('task-manager')
const server = express()

// eslint-disable-next-line
server.use('/public', express['static'](path.join(__dirname, '/dist')))
server.use(compression())
server.use(bodyParser.json())

// apis
server.use(APIS.user.url, APIS.user.controller)

server.use((req, res, next) => {
  const context = app.createContext()

  debug('Executing navigate action')
  context.getActionContext().executeAction(navigateAction, {
    url: req.url
  }, (err) => {
    if (err) {
      if (err.statusCode && err.statusCode === 404) {
        // Pass through to next middleware
        next()
      } else {
        next(err)
      }
      return
    }

    debug('Exposing context state')
    const exposed = `window.App=${serialize(app.dehydrate(context))}`

    debug('Rendering Application component into html')
    const markup = ReactDOM.renderToString(createElementWithContext(context))
    const htmlElement = React.createElement(HtmlComponent, {
      context: context.getComponentContext(),
      state: exposed,
      markup,
      assets
    })
    const html = ReactDOM.renderToStaticMarkup(htmlElement)
    debug('Sending markup')
    res.type('html')
    res.write(`<!DOCTYPE html>${html}`)
    res.end()
  })
})

const port = process.env.PORT || serverConfig.port || 3000
server.listen(port)
console.log(`Application listening on port: ${port}`)

export default server
