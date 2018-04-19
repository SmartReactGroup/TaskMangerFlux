import React from 'react'
import PropTypes from 'prop-types'
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
    this.state = this.getStoreState()
  }

  getStoreState() {
    return {
      email: '',
      password: '',
      user: this.context.getStore(UserStore).getUser()
    }
  }

  componentDidMount() {
    this.context.getStore(UserStore).addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.context.getStore(UserStore).removeChangeListener(this._onStoreChange)
  }

  _onStoreChange() {
    this.setState(this.getStoreState())
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
      <div>
        <h2>Login - {this.state.user && this.state.user.name}</h2>
        <form>
          <label htmlFor="email">
            email:
            <input id="email" type="text" value={this.state.email} onChange={(e) => this.changeHandle(e)} />
          </label>
          <label htmlFor="password">
            password:
            <input id="password" type="password" value={this.state.password} onChange={(e) => this.changeHandle(e)} />
          </label>
          <button type="button" onClick={() => this.handleSubmit()}>
            Submit
          </button>
        </form>
      </div>
    )
  }
}

export default Login
