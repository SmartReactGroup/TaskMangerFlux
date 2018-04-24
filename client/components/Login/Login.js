import React from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'antd'

import AccountActions from '../../actions/AccountActions'
import { UserStore } from '../../stores'

class Login extends React.Component {

  static contextTypes = {
    executeAction: PropTypes.func,
    getStore: PropTypes.func
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    this.userStore = this.context.getStore(UserStore)
    this.state = this.getStoreState()
  }

  getStoreState = () => ({
    email: '',
    password: '',
    errorMessage: '',
    user: this.userStore.getCurrentUser()
  })

  componentDidMount() {
    this.userStore.addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.userStore.removeChangeListener(this._onStoreChange)
  }

  _onStoreChange(action) {
    const result = {}
    const userStore = this.context.getStore(UserStore)
    if (action.status === 'LOGIN_FAILED') {
      result.errorMessage = action.message
      result.user = userStore.getCurrentUser()
    }

    if (Object.keys(result).length) {
      this.setState(result)
    }
  }

  changeHandle(event) {
    const labelId = event.target.id
    if (labelId === 'email') {
      this.setState({ email: event.target.value })
    } else {
      this.setState({ password: event.target.value })
    }
  }

  handleSubmit() {
    this.context.executeAction(AccountActions.Login, this.state)
  }

  render() {
    return (
      <div className="login-page">
        <h2>Login - {this.state.user && this.state.user.name}</h2>
        <form>
          <label htmlFor="email">
            email:
            <Input id="email" type="text" value={this.state.email} onChange={(e) => this.changeHandle(e)} />
          </label>
          <label htmlFor="password">
            password:
            <Input id="password" type="password" value={this.state.password} onChange={(e) => this.changeHandle(e)} />
          </label>
          <Button type="button" onClick={() => this.handleSubmit()}>
            Login
          </Button>
          <h3>{this.state.errorMessage}</h3>
        </form>
      </div>
    )
  }
}

export default Login
