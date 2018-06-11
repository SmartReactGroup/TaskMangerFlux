import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { NavLink } from 'react-router-dom'
import { UserStore } from '../../stores'
import { UserActions } from '../../actions'
import { Message } from '../../utils'

class Nav extends React.Component {

  static propTypes = {
    currentLocation: PropTypes.object,
    history: PropTypes.object
  }

  static contextTypes = {
    executeAction: PropTypes.func,
    getStore: PropTypes.func
  }


  constructor(props, context) {
    super(props)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    const currentUser = this.context.getStore(UserStore).getCurrentUser()
    this.state = {
      staticNavItems: [
        { path: '/', name: 'TaskManager', icon: 'fa-home' },
        { path: '/tasks', name: 'Tasks', icon: 'fa-tasks' },
        { path: '/documents', name: 'Docs', icon: 'fa-file-alt' }
      ],
      dynamicNavItems: [
        { path: '/login', name: 'Login', hide: currentUser, icon: 'fa-user-alt' },
        { path: '/chat', name: 'Chats', hide: !currentUser, icon: 'fa-comments' }
      ],
      currentUser
    }
  }

  componentDidMount() {
    this.context.getStore(UserStore).addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.context.getStore(UserStore).removeChangeListener(this._onStoreChange)
  }

  _onStoreChange(actions) {
    const result = {}
    const authEvents = [
      'LOGIN_FAILED',
      'LOGIN_SUCCESS',
      'LOGOUT',
      'REGISTER_FAILED',
      'REGISTER_SUCCESS',
      'CHANGE_USER_INFO'
    ]
    if (authEvents.includes(actions.event)) {
      const dynamicNavItems = _.cloneDeep(this.state.dynamicNavItems)
      result.currentUser = this.context.getStore(UserStore).getCurrentUser()
      result.dynamicNavItems = dynamicNavItems.map((item) => {
        if (item.name === 'Login') {
          item.hide = result.currentUser
        }
        if (item.name === 'Chats') {
          item.hide = !result.currentUser
        }
        return item
      })
    }

    if (Object.keys(result).length) {
      this.setState(result, () => {
        if (actions.event === 'LOGOUT') {
          this.props.history.push('/')
          Message.success('Logout successfully')
        }
      })
    }
  }

  filterNavItems() {
    const activeDynamicNavItems = this.state.dynamicNavItems.filter((item) => !item.hide)
    return this.state.staticNavItems.concat(activeDynamicNavItems)
  }

  logout() {
    this.context.executeAction(UserActions.Logout)
  }

  render() {
    const { currentUser } = this.state
    const { pathname } = this.props.currentLocation
    const activeNavItems = this.filterNavItems()

    return (
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[pathname]}
        style={{ lineHeight: '63px', borderBottom: 'none', background: 'none' }}
      >
        {activeNavItems.map((navItem) =>
          <Menu.Item className={navItem.name} key={navItem.path}><NavLink to={navItem.path}><i className={`fas ${navItem.icon}`} />{navItem.name}</NavLink></Menu.Item>
        )}

        {currentUser &&
          <Menu.SubMenu title={<span>{`welcome, ${currentUser.name} `}<Icon type="down" /></span>} key="" style={{ float: 'right' }} >
            <Menu.ItemGroup>
              <Menu.Item key="/myprofile"><NavLink to="/me/myprofile">My Profile</NavLink></Menu.Item>
              <Menu.Item key="/settings"><NavLink to="/me/settings">Settings</NavLink></Menu.Item>
              <Menu.Item key="/logout"><span onClick={() => this.logout()}>Log out</span></Menu.Item>
            </Menu.ItemGroup>
          </Menu.SubMenu>
        }
      </Menu>
    )
  }
}

export default Nav
