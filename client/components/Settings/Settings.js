import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const FormItem = Form.Item

class Settings extends React.Component {
  static propTypes = {
    form: PropTypes.object
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
    console.log(this.props)
    return (
      <div className="setting-page">
        <h2>Change password</h2>
        <Form>
          <FormItem {...formItemLayout} label="Old password">
            {getFieldDecorator('old-password', {
              rules: [{
                required: true,
                message: 'Please input your password!'
              }]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="New password">
            {getFieldDecorator('new-password', {
              rules: [{
                required: true,
                message: 'Please input your password!'
              }]
            })(<Input type="password" />)}
          </FormItem>
        </Form>
      </div>
    )
  }
}

const SettingForm = Form.create()(Settings)

export default SettingForm

