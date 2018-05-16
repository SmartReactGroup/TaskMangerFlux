import React from 'react'
import { Form, Input, Button } from 'antd'
import PropTypes from 'prop-types'
import AccountActions from '../../actions/AccountActions'
import { UserStore } from '../../stores'
import { WarningBanner } from '../../components'

const FormItem = Form.Item

class Settings extends React.Component {
  static propTypes = {
    form: PropTypes.object
  }

  static contextTypes = {
    executeAction: PropTypes.func,
    getStore: PropTypes.func
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this.state = {
      user: this.context.getStore(UserStore).getCurrentUser(),
      showMsg: false,
      warningBarType: '',
      msg: ''
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
    const authEvent = ['CHANGE_PASSWORD_SUCCESS', 'CHANGE_PASSWORD_FAILED']
    if (authEvent.includes(actions.event)) {
      result.showMsg = true
      result.msg = actions.msg
      if (actions.event === 'CHANGE_PASSWORD_SUCCESS') {
        result.warningBarType = 'success'
      }
      if (actions.event === 'CHANGE_PASSWORD_FAILED') {
        result.warningBarType = 'error'
      }
    }
    if (Object.keys(result).length) {
      this.setState(result)
    }
  }

  changePassword(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.user = this.state.user
        this.context.executeAction(AccountActions.ChangePassword, values)
      }
    })
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
      <div className="setting-page">
        <h2>Change password</h2>
        <Form onSubmit={(e) => this.changePassword(e)}>
          <FormItem {...formItemLayout} label="Old password">
            {getFieldDecorator('oldPassword', {
              rules: [{
                required: true,
                message: 'Please input your password!'
              }]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="New password">
            {getFieldDecorator('newPassword', {
              rules: [{
                required: true,
                message: 'Please input your password!'
              }]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Change
            </Button>
          </FormItem>
          {this.state.showMsg && <WarningBanner msg={this.state.msg} type={this.state.warningBarType} onClose={() => this.onClose()} />}
        </Form>
      </div>
    )
  }
}

const SettingForm = Form.create()(Settings)

export default SettingForm

