import React from 'react'
import { Form, Input, Button, Tabs, Icon, message } from 'antd'
import PropTypes from 'prop-types'
import AccountActions from '../../actions/AccountActions'
import { UserStore } from '../../stores'
import { WarningBanner } from '../../components'

const FormItem = Form.Item
const { TabPane } = Tabs
const { TextArea } = Input

class Settings extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object
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
      msg: '',
      changeUsername: false
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
    const authEvent = ['CHANGE_PASSWORD_SUCCESS', 'CHANGE_PASSWORD_FAILED', 'CHANGE_USER_INFO']
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
      if (actions.event === 'CHANGE_USER_INFO') {
        message.success('Save successfully')
        window.location.reload()
      }
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

  changeUserInfo(e) {
    e.preventDefault()
    const value = { name: this.props.form.getFieldValue('username') }
    value.user = this.state.user
    this.context.executeAction(AccountActions.ChangeUserInfo, value)
  }

  editUsername() {
    this.setState({ changeUsername: true })
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
      <div className="setting-page" style={{ padding: '24px', background: 'white' }}>
        <Tabs type="card">
          <TabPane tab="Basic Information" key="1">
            <Form onSubmit={(e) => this.changeUserInfo(e)}>
              <FormItem {...formItemLayout} label="user name">
                <span>{this.state.user.name}</span>
                {!this.state.changeUsername &&
                  <a className="editUsername" onClick={() => this.editUsername()}><Icon type="edit" />modify</a>
                }
                {this.state.changeUsername && getFieldDecorator('username')(<Input type="text" />) }
              </FormItem>
              <FormItem {...formItemLayout} label="personal signature">
                {getFieldDecorator('signature')(<TextArea autosize={{ minRows: 2, maxRows: 6 }} />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab="Account and Password" key="2">
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
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const SettingForm = Form.create()(Settings)

export default SettingForm

