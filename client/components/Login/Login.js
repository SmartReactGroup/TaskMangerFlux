import React from 'react'
import PropTypes from 'prop-types'
import AccountAction from '../../actions/AccountActions'

class Login extends React.Component {
  static contextTypes = {
    executeAction: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
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
    this.context.executeAction(AccountAction.login, this.state)
  }

  render() {
    return (
      <div>
        <h2>Login</h2>
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
        {this.loggedUser}
      </div>
    )
  }
}

export default Login
