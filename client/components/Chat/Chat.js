import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Layout, Menu, Icon, Button, Input, Avatar, Dropdown, Form } from 'antd'
import { UserStore, GroupStore } from '../../stores'
import GroupActions from '../../actions/GroupActions'

const { SubMenu } = Menu
const { Content, Sider, Header } = Layout
const FormItem = Form.Item

class Chat extends React.Component {
  static contextTypes = {
    getStore: PropTypes.func,
    executeAction: PropTypes.func
  }

  static propTypes = {
    form: PropTypes.object
  }

  static fetchData = (context) => {
    console.log('======fetch data=====')
    context.executeAction(GroupActions.getGroups)
  }

  constructor(props, context) {
    super(props)
    this.context = context
    const currentUser = this.context.getStore(UserStore).getCurrentUser()
    const chatGroups = this.context.getStore(GroupStore).getGroups()
    console.log('constructor')
    this.state = {
      currentUser,
      messages: [],
      selectedKey: ['1'],
      chatGroups
    }
  }

  componentWillMount() {
    console.log('componentWillMount')
  }

  componentDidMount() {
    Socket.on('receive:message', (msgObj) => {
      const messages = _.cloneDeep(this.state.messages)
      const { currentUser } = this.state
      console.log(msgObj)
      if (msgObj.message) {
        if (msgObj.to === currentUser._id) {
          messages.push({ message: msgObj.message, user: msgObj.user })
          this.setState({ messages }, () => {
            const element = document.querySelector('.messages')
            const shouldScroll = element.scrollTop + element.clientHeight === element.scrollHeight
            if (!shouldScroll) {
              this.scrollToBottom(element)
            }
          })
        }
      }
    })
  }

  scrollToBottom(element) {
    element.scrollTop = element.scrollHeight
  }

  sendMessage(e) {
    e.preventDefault()
    const { currentUser } = this.state
    const newMessage = this.props.form.getFieldValue('message')
    const messages = _.cloneDeep(this.state.messages)
    if (newMessage) {
      messages.push({ message: newMessage, user: currentUser._id })
      this.setState({ messages }, () => {
        this.props.form.setFieldsValue({ message: '' })
        const element1 = document.querySelector('.messages')
        const shouldScroll = element1.scrollTop + element1.clientHeight === element1.scrollHeight
        if (!shouldScroll) {
          this.scrollToBottom(element1)
        }
        Socket.emit('new:message', { message: newMessage, from: currentUser._id, to: '5b1b8e9d6912300663fb4915' })
      })
    }
  }

  renderMessages(messageObj, idx, currentUser) {
    let messagePostion = ''
    if (messageObj.user === currentUser._id) {
      messagePostion = 'message message-right'
    }
    else {
      messagePostion = 'message message-left'
    }
    return (
      <li className={messagePostion} key={idx}>
        <div className="message-chatbox">
          <span className="message-content">{messageObj.message}</span>
          <div className="triangle" />
        </div>
        <div className="message-user">
          {currentUser &&
            <Avatar size="large" src={`http://localhost:9000${currentUser.images.avatar}`} />
          }
        </div>
      </li>
    )
  }
  // selectSubMenu({ item, key, selectedKeys }) {
  //   Socket.emit('chat with a user', { roomId: key })
  // }

  render() {
    console.log('++++++++++render', this.state.chatGroups)
    const { currentUser, messages, selectedKey } = this.state
    const { getFieldDecorator } = this.props.form
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="">online</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="">Do not disturb</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="">offline</a>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="chat-container">
        <Layout style={{ background: '#fff' }}>
          <div className="left-box">
            <Header style={{ padding: '0' }}>
              <div className="chat-status">
                {currentUser &&
                  <Avatar size="large" src={`http://localhost:9000${currentUser.images.avatar}`} style={{ marginRight: '10px' }} />
                }
                <Dropdown overlay={menu} style={{ color: '#FFF' }}>
                  <a className="ant-dropdown-link" href="#">
                    <Icon type="bars" />
                  </a>
                </Dropdown>
              </div>
            </Header>
            <Sider width={200} style={{ background: '#fff' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={selectedKey}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%' }}
                onSelect={this.selectSubMenu}
              >
                <SubMenu key="sub1" title={<span><Icon type="user" />Group 1</span>}>
                  <Menu.Item key="1">jenny</Menu.Item>
                  <Menu.Item key="2">kenny</Menu.Item>
                  <Menu.Item key="3">test</Menu.Item>
                  <Menu.Item key="4">admin</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="user" />Group 2</span>}>
                  <Menu.Item key="5">user5</Menu.Item>
                  <Menu.Item key="6">user6</Menu.Item>
                  <Menu.Item key="7">user7</Menu.Item>
                  <Menu.Item key="8">user8</Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
          </div>
          <Content style={{ minHeight: 280 }}>
            <div className="chat-box">
              <div className="chat-message">
                <ul className="messages">
                  {messages.length > 0 && messages.map((messageObj, idx) => this.renderMessages(messageObj, idx, currentUser)
                  )}
                </ul>
              </div>
              <div className="chat-typing">
                <Form style={{ display: 'flex', alignItems: 'center' }} onSubmit={(e) => this.sendMessage(e)} >
                  <FormItem style={{ flexBasis: '87%' }}>
                    {getFieldDecorator('message')(
                      <Input placeholder="please type here" style={{ width: '95%' }} />
                    )}
                  </FormItem>
                  <FormItem>
                    <Button type="primary" htmlType="submit">Send</Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </Content>
        </Layout>
      </div>
    )
  }
}

const ChatForm = Form.create()(Chat)
export default ChatForm
