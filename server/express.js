/**
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the App is rendered via React.
 */

import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import path from 'path'
import serialize from 'serialize-javascript'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import chalk from 'chalk'
// import debugLib from 'debug'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import axios from 'axios'
import concurrent from 'contra/concurrent'

import CustomFluxibleComponent from '../client/components/CustomFluxibleComponent'
import assets from '../configs/assets'
import app from '../client/app'
import HtmlComponent from '../client/components/Html'
import serverConfig from '../configs/server'
import { user } from './api'
import { createRoutes, extractRoutesMetadata } from './routes'

const { StaticRouter } = require('react-router')

// const env = process.env.NODE_ENV
// const debug = debugLib('task-manager')
const server = express()

// eslint-disable-next-line
server.use('/public', express['static'](path.join(__dirname, '/dist')))
server.use(compression())
server.use(bodyParser.json())

const MongoStore = connectMongo(session)
server.use(
  session({
    secret: 'secret',
    store: new MongoStore(serverConfig.session),
    resave: false,
    saveUninitialized: false
  })
)

// apis
server.use(user.url, user.controller)
server.use((req, res) => {
  const context = app.createContext({ req, res })
  const serverRender = () => {
    // todo
    // 1. convert all fetchData function to promise
    // 2. remove the useless routerComponents from the return value of extractRoutesMetadata()
    const {
      promises: fetchDataPromises
      // components: routerComponents
    } = extractRoutesMetadata(context, req.url)

    concurrent(fetchDataPromises, (err) => {
      if (err) console.error(err)
      const routes = createRoutes(context, req)
      const routeContext = context.getComponentContext()
      const appHTML = ReactDOMServer.renderToString(
        <CustomFluxibleComponent context={routeContext}>
          <StaticRouter location={req.url} context={{}}>
            {routes}
          </StaticRouter>
        </CustomFluxibleComponent>
      )

      const exposed = `window.__DATA__=${serialize(app.dehydrate(context))}`
      const wrapperHTML = ReactDOMServer.renderToString(
        <HtmlComponent assets={assets} markup={appHTML} exposed={exposed} />
      )

      const { stateCode, url } = routeContext
      if (url) {
        res.redirect(stateCode, routeContext.url)
      } else {
        // disable the page cache to preventing the security issue
        // a unauthorized user shouldn't access last page with the browser back/forward
        res.set({
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        })

        res.write(wrapperHTML)
        res.end()
      }
    })
  }

  if (req.session && req.session.token) {
    const options = { headers: { Authorization: `Bearer ${req.session.token}` } }
    axios
      .get(user.apis.GET_CURRENT_USER, options)
      .then((response) => {
        context.getStore('UserStore').loadSession(response.data)
        serverRender()
      })
      .catch((err) => {
        console.error(err.toString())
      })
  } else {
    serverRender()
  }
})

const port = process.env.PORT || serverConfig.port || 3000
server.listen(port, () => {
  const dateNow = new Date()
  const dateString = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
  console.log(`[${chalk.gray(dateString)}] App listening on port: ${chalk.blue(port)}`)
})

export default server
