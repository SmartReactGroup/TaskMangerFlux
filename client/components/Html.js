import React from 'react'
import PropTypes from 'prop-types'
import ApplicationStore from '../stores/ApplicationStore'

export default function Html(props) {
  const { style, main, common, essentials } = props.assets
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{props.context.getStore(ApplicationStore).getPageTitle()}</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.5.0/pure-min.css" />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: props.markup }} />
        <script dangerouslySetInnerHTML={{ __html: props.state }} />

        <script src={common} />
        <script src={main} />
        {essentials && <script src={essentials} />}
      </body>
    </html>
  )
}
