import React from 'react'
import { handleHistory } from 'fluxible-router'
import { connectToStores, provideContext } from 'fluxible-addons-react'
import Nav from './Nav'
import ApplicationStore from '../stores/ApplicationStore'

import pages from '../../configs/routes'

class Application extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props
    if (newProps.pageTitle === prevProps.pageTitle) {
      return
    }
    document.title = newProps.pageTitle
  }

  render() {
    const { Handler } = this.props.currentRoute
    return (
      <div>
        <Nav currentRoute={this.props.currentRoute} links={pages} />
        <Handler />
      </div>
    )
  }
}

export default provideContext(
  handleHistory(
    connectToStores(Application, [ApplicationStore], (context, props) => {
      const appStore = context.getStore(ApplicationStore)
      return {
        pageTitle: appStore.getPageTitle()
      }
    })
  )
)
