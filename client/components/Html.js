import React from 'react'
import PropTypes from 'prop-types'

export default class Html extends React.Component {
  static displayName = 'Html'

  static propTypes = {
    assets: PropTypes.object,
    exposed: PropTypes.string,
    markup: PropTypes.string
  }

  render() {
    const { assets, markup, exposed } = this.props
    const { style, main, common, essentials } = assets
    const markupHtml = { __html: markup }
    const exposedHtml = { __html: exposed }

    return (
      <html lang="en" className="no-js">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <title>Task Manager</title>
          <meta name="author" content="Kenny" />
          <meta
            name="viewport"
            content="width=device-width,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, initial-scale=1"
          />
          <link href="/antd/antd.css" rel="stylesheet" />
          {/* <link href="/font/fontawesome-all.css" rel="stylesheet" /> */}
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossOrigin="anonymous" />
          <link href={style} rel="stylesheet" />
        </head>
        <body>
          <div id="main" dangerouslySetInnerHTML={markupHtml} />
          <script dangerouslySetInnerHTML={exposedHtml} />
          <script src={common} />
          <script src={main} />
          {essentials && <script src={essentials} />}
        </body>
      </html>
    )
  }
}
