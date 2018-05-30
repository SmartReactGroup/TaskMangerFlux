import { Form, Checkbox, Input, Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import UserActions from '../../actions/UserActions'
import { UserStore } from '../../stores'
import { WarningBanner } from '../../components'
import { Message } from '../../utils'

const FormItem = Form.Item

class Login extends React.Component {

  static contextTypes = {
    executeAction: PropTypes.func,
    getStore: PropTypes.func
  }

  static propTypes = {
    history: PropTypes.object,
    form: PropTypes.object
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    this.userStore = this.context.getStore(UserStore)
    this.state = {
      responseMsg: '',
      showMsg: false,
      warningBarType: ''
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
      result.warningBarType = actions.event === 'LOGIN_FAILED' ? 'error' : 'success'
    }

    if (Object.keys(result).length) {
      this.setState(result, () => {
        if (actions.event === 'LOGIN_SUCCESS') {
          Message.success('Login successfully', () => this.props.history.push('/'))
        }
      })
    }
  }

  // handleSubmit() {
  //   this.context.executeAction(UserActions.Login, this.state)
  // }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.context.executeAction(UserActions.Login, values)
      }
    })
  }

  onClose() {
    this.setState({ showMsg: false })
  }

  render() {
    const { showMsg, responseMsg, warningBarType } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    }
    return (
      <div className="login-page" style={{ padding: '24px', background: 'white' }}>
        <h2>Login Form</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Email">
            {getFieldDecorator('email', {
              rule: [{
                type: 'email',
                message: 'The input is not valid E-mail!'
              }, {
                required: true,
                message: 'Please input your email!'
              }]
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Password">
            {getFieldDecorator('password', {
              rule: [{
                required: true,
                message: 'Please input your email!'
              }]
            })(<Input />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )}
            <a className="login-form-forgot" href=""> Forgot password</a>
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
            Log in
            </Button>
            <span> or </span><Link to="/register">Register now</Link>
          </FormItem>
          {showMsg && <WarningBanner msg={responseMsg} onClose={() => this.onClose()} type={warningBarType} />}
        </Form>
      </div>
    )
  }
}

const WrappedLoginForm = Form.create()(Login)
export default WrappedLoginForm

