import React from 'react'
import { Form, Input, Button, Icon } from 'antd'
import PropTypes from 'prop-types'
import UserActions from '../../actions/UserActions'
import { UserStore } from '../../stores'
import { Message } from '../../utils'

const FormItem = Form.Item
const { TextArea } = Input

class EditProfile extends React.Component {
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
    const authEvent = ['CHANGE_USER_INFO']
    if (authEvent.includes(actions.event)) {
      result.showMsg = true
      result.msg = actions.msg
      result.user = this.context.getStore(UserStore).getCurrentUser()
    }
    if (Object.keys(result).length) {
      this.setState(result, () => {
        if (actions.event === 'CHANGE_USER_INFO') {
          Message.success('Save successfully')
        }
      })
    }
  }

  changeUserInfo(e) {
    e.preventDefault()
    this.context.executeAction(UserActions.ChangeUserInfo, {
      name: this.props.form.getFieldValue('username'),
      user: this.state.user
    })
  }

  editUsername() {
    this.setState({ changeUsername: true })
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
        <h2>Edit My Profile</h2>
        <Form onSubmit={(e) => this.changeUserInfo(e)}>
          <FormItem {...formItemLayout} label="user name">
            <span style={{ paddingRight: '10px' }}>{this.state.user.name}</span>
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
      </div>
    )
  }
}

const EditProfileForm = Form.create()(EditProfile)

export default EditProfileForm

