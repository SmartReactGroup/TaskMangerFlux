import { Form, Checkbox, Input, Button } from 'antd'
import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import AccountActions from '../../actions/AccountActions'
import { UserStore } from '../../stores'
import { WarningBanner } from '../../components'

const FormItem = Form.Item

class Login extends React.Component {

  static contextTypes = {
    executeAction: PropTypes.func,
    getStore: PropTypes.func
  }

  static propTypes = {
    location: PropTypes.object
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    this.userStore = this.context.getStore(UserStore)
    this.state = this.getStoreState()
  }

  getStoreState() {
    return {
      email: '',
      password: '',
      user: this.context.getStore(UserStore).getUser(),
      responseMsg: '',
      showMsg: false,
      warningBarType: '',
      redirectToReferrer: false
    }
  }

  componentDidMount() {
    this.context.getStore(UserStore).addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.context.getStore(UserStore).removeChangeListener(this._onStoreChange)
  }

  _onStoreChange(actions) {
    const result = {}
    const authEvents = ['LOGIN_FAILED', 'LOGIN_SUCCESS']
    if (authEvents.includes(actions.event)) {
      result.user = this.userStore.getUser()
      result.responseMsg = actions.msg
      result.showMsg = true
      if (actions.event === 'LOGIN_FAILED') {
        result.warningBarType = 'error'
      }
      else {
        result.warningBarType = 'success'
        result.redirectToReferrer = true
      }
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

  onClose() {
    this.setState({ showMsg: false })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state
    if (redirectToReferrer) {
      return <Redirect to={from} />
    }
    return (
      <div className="login-page">
        <Form>
          <FormItem>
            <Input id="email" type="text" placeholder="Email" value={this.state.email} onChange={(e) => this.changeHandle(e)} />
          </FormItem>
          <FormItem>
            <Input id="password" type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.changeHandle(e)} />
          </FormItem>
          <FormItem>
            <Checkbox>Remember me</Checkbox>
            <a className="login-form-forgot" href=""> Forgot password</a><span> or </span><Link to="/register">register now</Link>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => this.handleSubmit()} >
              Log in
            </Button>
          </FormItem>
          {this.state.showMsg && <WarningBanner msg={this.state.responseMsg} onClose={() => this.onClose()} type={this.state.warningBarType} />}
        </Form>
      </div>
    )
  }
}

export default Login
