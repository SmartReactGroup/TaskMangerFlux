import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { NavLink } from 'react-router-dom'
import { UserStore } from '../../stores'
import { AccountActions } from '../../actions'

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
        { path: '/', name: 'Home' },
        { path: '/about', name: 'About' }
      ],
      dynamicNavItems: [
        { path: '/login', name: 'Login', hide: currentUser }
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
    const authEvents = ['LOGIN_FAILED', 'LOGIN_SUCCESS', 'LOGOUT']
    if (authEvents.includes(actions.event)) {
      const dynamicNavItems = _.cloneDeep(this.state.dynamicNavItems)
      result.currentUser = this.context.getStore(UserStore).getCurrentUser()
      result.dynamicNavItems = dynamicNavItems.map((item) => {
        item.hide = result.currentUser
        return item
      })
    }

    if (Object.keys(result).length) {
      this.setState(result, () => {
        if (actions.event === 'LOGOUT') {
          this.props.history.push('/')
        }
      })
    }
  }

  filterNavItems() {
    const activeDynamicNavItems = this.state.dynamicNavItems.filter((item) => !item.hide)
    return this.state.staticNavItems.concat(activeDynamicNavItems)
  }

  logout() {
    this.context.executeAction(AccountActions.Logout)
  }

  render() {
    const { currentUser } = this.state
    const { pathname } = this.props.currentLocation
    const activeNavItems = this.filterNavItems()

    return (
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[pathname]}
        style={{ lineHeight: '64px' }}
      >
        {activeNavItems.map((navItem) =>
          <Menu.Item key={navItem.path}><NavLink to={navItem.path}>{navItem.name}</NavLink></Menu.Item>
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
