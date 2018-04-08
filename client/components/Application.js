import React from 'react'
import PropTypes from 'prop-types'
import { connectToStores, provideContext } from 'fluxible-addons-react'
import { handleHistory } from 'fluxible-router'
import { Nav } from '../components'
import pages from '../../configs/routes'
import ApplicationStore from '../stores/ApplicationStore'

class Application extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    const newProps = this.props
    if (newProps.pageTitle === prevProps.pageTitle) {
      return
    }
    document.title = newProps.pageTitle
  }

  render() {
    const Handler = this.props.currentRoute.handler
    return (
      <div>
        <Nav currentRoute={this.props.currentRoute} links={pages} />
        <Handler />
      </div>
    )
  }
}

Application.contextTypes = {
  executeAction: PropTypes.func
}

export default provideContext(
  handleHistory(
    connectToStores(Application, [ApplicationStore], function (context, props) {
      const appStore = context.getStore(ApplicationStore)
      return {
        pageTitle: appStore.getPageTitle()
      }
    })
  )
)
