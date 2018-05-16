import React from 'react'
import PropTypes from 'prop-types'
import AccountActions from '../../actions/AccountActions'
import { UserStore } from '../../stores'

class Logout extends React.Component {
  static contextTypes = {
    executeAction: PropTypes.func,
    getStore: PropTypes.func
  }

  constructor(props, context) {
    super(props)
    console.log(context)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    this.userStore = this.context.getStore(UserStore)
    this.state = {
      msg: ''
    }
  }
  componentDidMount() {
    this.context.executeAction(AccountActions.Logout)
    this.context.getStore(UserStore).addChangeListener(this._onStoreChange)
  }
  componentWillUnmount() {
    this.context.getStore(UserStore).removeChangeListener(this._onStoreChange)
  }

  _onStoreChange(action) {
    const result = {}
    result.msg = action.msg
    result.user = this.userStore.getCurrentUser()
    result.redirectToReferrer = true
    if (Object.keys(result).length) {
      this.setState(result)
    }
  }

  render() {
    return (
      <h2 className="loading-text">
        {this.state.msg}
      </h2>
    )
  }
}

export default Logout
