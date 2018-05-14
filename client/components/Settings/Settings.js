import React from 'react'
import { Form, Input, Button } from 'antd'
import PropTypes from 'prop-types'
import AccountActions from '../../actions/AccountActions'
import { UserStore } from '../../stores'

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
      user: this.context.getStore(UserStore).getUser()
    }
  }

  changePassword(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
        values.user = this.state.user
        this.context.executeAction(AccountActions.ChangePassword, values)
      }
    })
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
    console.log(this.props)
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
        </Form>
      </div>
    )
  }
}

const SettingForm = Form.create()(Settings)

export default SettingForm

