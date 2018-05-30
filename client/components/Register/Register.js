import React from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import PropTypes from 'prop-types'
import UserActions from '../../actions/UserActions'
import { UserStore } from '../../stores'
import { WarningBanner } from '../../components'

const FormItem = Form.Item

class RegistrationForm extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object
  }

  static contextTypes = {
    executeAction: PropTypes.func,
    getStore: PropTypes.func
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this.userStore = this.context.getStore(UserStore)
    this.state = {
      confirmDirty: false,
      msg: '',
      showMsg: false,
      warningBarType: ''
    }
    this._onStoreChange = this._onStoreChange.bind(this)
  }

  componentDidMount() {
    this.context.getStore(UserStore).addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.context.getStore(UserStore).removeChangeListener(this._onStoreChange)
  }

  _onStoreChange(actions) {
    const result = {}
    const authEvent = ['REGISTER_SUCCESS', 'REGISTER_FAILED']
    if (authEvent.includes(actions.event)) {
      result.user = this.userStore.getCurrentUser()
      result.msg = actions.msg
      if (actions.event === 'REGISTER_FAILED') {
        result.warningBarType = 'error'
        result.showMsg = true
      }
    }
    if (Object.keys(result).length) {
      this.setState(result, () => {
        if (actions.event === 'REGISTER_SUCCESS') {
          this.props.history.push('/')
          message.success('Register successfully')
        }
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.context.executeAction(UserActions.Register, values)
      }
    })
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    }
    callback()
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  onClose() {
    this.setState({ showMsg: false })
  }

  render() {
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
      <div className="register-page" style={{ padding: '24px', background: 'white' }}>
        <h2>Register Form</h2>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="Name">
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: 'Please input your name!'
              }]
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="E-mail">
            {getFieldDecorator('email', {
              rules: [{
                type: 'email',
                message: 'The input is not valid E-mail!'
              }, {
                required: true,
                message: 'Please input your E-mail!'
              }]
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Password">
            {getFieldDecorator('password', {
              rules: [{
                required: true,
                message: 'Please input your password!'
              }, {
                validator: this.validateToNextPassword
              }]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="Confirm Password">
            {getFieldDecorator('confirm', {
              rules: [{
                required: true,
                message: 'Please confirm your password!'
              }, {
                validator: this.compareToFirstPassword
              }]
            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <span> Have registered, </span><Link to="/login">please login now</Link>
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </FormItem>
          {this.state.showMsg && <WarningBanner msg={this.state.msg} onClose={() => this.onClose()} type={this.state.warningBarType} />}
        </Form>
      </div>
    )
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm)

export default WrappedRegistrationForm
