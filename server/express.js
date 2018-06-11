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
import http from 'http'
import serialize from 'serialize-javascript'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import chalk from 'chalk'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import axios from 'axios'
import concurrent from 'contra/concurrent'
import socketio from 'socket.io'
import { StaticRouter } from 'react-router'
import CustomFluxibleComponent from '../client/components/CustomFluxibleComponent'
import assets from '../configs/assets'
import clientApp from '../client/app'
import HtmlComponent from '../client/components/Html'
import serverConfig from '../configs/server'
import errors from './components/errors'
import { API } from './api/user/service'
import { createRoutes, extractRoutesMetadata } from './routes'

const env = process.env.NODE_ENV
const app = express()

app.use(express.static(path.join(__dirname, '..', 'client', 'assets')))
app.use(compression())
app.use(bodyParser.json())

const MongoStore = connectMongo(session)
app.use(session({
  secret: 'secret',
  name: 'tmfcs', // taks manager client session
  store: new MongoStore(serverConfig.session),
  resave: false,
  saveUninitialized: false
}))

// eslint-disable-next-line
app.use('/api/users', require('./api/user'))
app.use('/api/groups', require('./api/group'))

app.route('/:url(api|auth|components|app|assets)/*').get(errors[404])
app.use((req, res) => {
  const context = clientApp.createContext({ req, res })
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

      const exposed = `window.__DATA__=${serialize(clientApp.dehydrate(context))}`
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
    const headers = { Authorization: `Bearer ${req.session.token}` }
    axios.get(API.GET_CURRENT_USER, { headers })
      .then((response) => {
        context.getStore('UserStore').loadSession(response.data)
        serverRender()
      })
      .catch((err) => {
        console.error(err.toString())
        context.getStore('UserStore').authFailed()
        serverRender()
      })
  } else {
    serverRender()
  }
})

const port = process.env.PORT || serverConfig.port || 3000
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
  socket.on('new:message', (msgObj) => {
    console.log(msgObj)
    socket.join(msgObj.user)
    socket.broadcast.emit('receive:message', msgObj)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => {
  const dateNow = new Date()
  const dateString = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
  console.log(`[${chalk.gray(dateString)}] App listening on port: ${chalk.blue(port)}, environment: ${env}`)
})

export default server
