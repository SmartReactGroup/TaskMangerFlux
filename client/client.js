import React from 'react'
import { Router } from 'react-router'

import ReactDOM from 'react-dom'
import debug from 'debug'
import concurrent from 'contra/concurrent'
import openSocket from 'socket.io-client'
import CustomFluxibleComponent from './components/CustomFluxibleComponent'


import app from './app'
import './components/app.scss'
import { createRoutes, extractRoutesMetadata } from '../server/routes'
import { browserHistory } from './utils/historyUtils'


const debugClient = debug('taskmangerflux')
const dehydratedState = window.__DATA__

// https://github.com/visionmedia/debug#browser-support
window.fluxibleDebug = debug
window.React = ReactDOM // For chrome dev tool support
window.Socket = openSocket.connect()


debugClient('rehydrating app')

app.getPlugin('ReactRouterPlugin').setHistory(browserHistory)

app.rehydrate(dehydratedState, (err, context) => {
  if (err) {
    throw err
  }
  window.context = context
  const routes = createRoutes(context)
  const _context = context.getComponentContext()

  ReactDOM.hydrate(
    <CustomFluxibleComponent context={_context}>
      <Router history={browserHistory}>{routes}</Router>
    </CustomFluxibleComponent>,
    document.getElementById('main')
  )

  browserHistory.listen((location) => {
    // console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
    // console.log(`The last navigation action was ${action}`)
    const { promises: fetchDataPromises } = extractRoutesMetadata(context, location.pathname)
    concurrent(fetchDataPromises, (fetchErr) => {
      if (fetchErr) {
        console.error(`fetchData on route change err: ${fetchErr}`)
      }
    })
  })
})
