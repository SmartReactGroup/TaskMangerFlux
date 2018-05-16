import { Form, Checkbox, Input, Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
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
    history: PropTypes.object
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    this.userStore = this.context.getStore(UserStore)
    this.state = {
      email: '',
      password: '',
      responseMsg: '',
      showMsg: false,
      warningBarType: '',
      redirectToReferrer: false
    }

    this.state.user = this.userStore.getCurrentUser()
  }

  componentDidMount() {
    this.userStore.addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.userStore.removeChangeListener(this._onStoreChange)
  }

  _onStoreChange(actions) {
    const result = {}
    const authEvents = ['LOGIN_FAILED', 'LOGIN_SUCCESS']
    if (authEvents.includes(actions.event)) {
      result.user = this.userStore.getCurrentUser()
      result.responseMsg = actions.msg
      result.showMsg = true

      // actions.event === 'LOGIN_FAILED' ? result.warningBarType = 'error' : result.warningBarType = 'success'
      result.warningBarType = actions.event === 'LOGIN_FAILED' ? 'error' : 'success'
    }

    if (Object.keys(result).length) {
      this.setState(result, () => {
        if (actions.event === 'LOGIN_SUCCESS') {
          this.props.history.push('/')
        }
      })
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
    const { email, password, showMsg, responseMsg, warningBarType } = this.state
    return (
      <div className="login-page">
        <Form>
          <FormItem>
            <Input id="email" type="text" placeholder="Email" value={email} onChange={(e) => this.changeHandle(e)} />
          </FormItem>
          <FormItem>
            <Input id="password" type="password" placeholder="Password" value={password} onChange={(e) => this.changeHandle(e)} />
          </FormItem>
          <FormItem>
            <Checkbox>Remember me</Checkbox>
            <a className="login-form-forgot" href=""> Forgot password</a><span> or </span><Link to="/register">Register now</Link>
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => this.handleSubmit()} >
              Log in
            </Button>
          </FormItem>
          {showMsg && <WarningBanner msg={responseMsg} onClose={() => this.onClose()} type={warningBarType} />}
        </Form>
      </div>
    )
  }
}

export default Login
