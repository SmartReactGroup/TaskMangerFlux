import React from 'react'
import PropTypes from 'prop-types'
import { connectToStores, provideContext } from 'fluxible-addons-react'
import { handleHistory } from 'fluxible-router'
import { Nav } from '../components'
import pages from '../../configs/routes'
import ApplicationStore from '../stores/ApplicationStore'
import UserStore from '../stores/UserStore'
// import AccountActions from '../actions/AccountActions'

class Application extends React.Component {

  // componentDidMount() {
  //   this.context.executeAction(AccountActions.login, 'hello')
  // }

  componentDidUpdate(prevProps, nextProps) {
    console.log(prevProps, nextProps)
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
        <Nav currentRoute={this.props.currentRoute} links={pages} username={this.props.loggedUser} />
        <Handler />
      </div>
    )
  }
}

Application.contextTypes = {
  executeAction: PropTypes.func
}

Application.propTypes = {
  loggedUser: PropTypes.string,
  currentRoute: PropTypes.object
}

export default provideContext(
  handleHistory(
    connectToStores(Application, [ApplicationStore, UserStore], function (context, props) {
      const appStore = context.getStore(ApplicationStore)
      const userStore = context.getStore(UserStore)
      return {
        pageTitle: appStore.getPageTitle(),
        loggedUser: userStore.getUser()
      }
    })
  )
)
