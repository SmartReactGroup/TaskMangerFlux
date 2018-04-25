import { Form, Checkbox, Input, Button, Alert } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import AccountActions from '../../actions/AccountActions'
import { UserStore } from '../../stores'

const FormItem = Form.Item

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
      user: this.context.getStore(UserStore).getUser(),
      loginMsg: '',
      showMessage: 'false'
    }
  }

  componentDidMount() {
    this.context.getStore(UserStore).addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.context.getStore(UserStore).removeChangeListener(this._onStoreChange)
  }

  _onStoreChange(data) {
    if (data.data && data.data.message) {
      this.setState({ user: null, loginMsg: data.data.message, showMessage: 'true' })
    }
    else {
      this.setState({ user: this.context.getStore(UserStore).getUser(), showMessage: 'true' })
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
        <Form>
          <FormItem>
            <Input id="email" type="text" placeholder="Email" value={this.state.email} onChange={(e) => this.changeHandle(e)} />
          </FormItem>
          <FormItem>
            <Input id="password" type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.changeHandle(e)} />
          </FormItem>
          <FormItem>
            <Checkbox>Remember me</Checkbox>
            <a className="login-form-forgot" href=""> Forgot password </a>
            <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => this.handleSubmit()} >
              Log in
            </Button>
          </FormItem>
          <WarningBanner showMsg={this.state.showMessage} user={this.state.user} loginMsg={this.state.loginMsg} />
        </Form>
      </div>
    )
  }
}

function WarningBanner(props) {
  if (props.showMsg === 'false') {
    return null
  }

  return (
    <div className="messageAlert">
      {
        props.user ? <Alert message="Login Successfully" type="success" closable /> : <Alert message={props.loginMsg} type="error" closable />
      }
    </div>
  )
}

WarningBanner.propTypes = {
  showMsg: PropTypes.string,
  user: PropTypes.object,
  loginMsg: PropTypes.string
}

export default Login
