import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import PropTypes from 'prop-types'
import AccountActions from '../../actions/AccountActions'
import { UserStore } from '../../stores'
import { WarningBanner } from '../../components'

const FormItem = Form.Item

class RegistrationForm extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    location: PropTypes.object
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
      user: this.userStore.getUser(),
      showMsg: false,
      warningBarType: '',
      redirectToReferrer: false
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
      result.user = this.userStore.getUser()
      result.msg = actions.msg
      if (actions.event === 'REGISTER_SUCCESS') {
        result.redirectToReferrer = true
      }
      if (actions.event === 'REGISTER_FAILED') {
        result.showMsg = true
        result.warningBarType = 'error'
      }
    }
    if (Object.keys(result).length) {
      this.setState(result)
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.context.executeAction(AccountActions.Register, values)
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
    console.log(this.state.confirmDirty)

  }

  onClose() {
    this.setState({ showMsg: false })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state
    const { getFieldDecorator } = this.props.form
    if (redirectToReferrer) {
      return <Redirect to={from} />
    }
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
      <div className="register-page">
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
