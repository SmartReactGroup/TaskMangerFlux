import React from 'react'
import _ from 'loadsh'
import { Menu, Icon } from 'antd'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { UserStore } from '../../stores'

class Nav extends React.Component {

  static propTypes = {
    currentLocation: PropTypes.object
  }

  static contextTypes = {
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

  _onStoreChange() {
    const result = {}
    const dynamicNavItems = _.cloneDeep(this.state.dynamicNavItems)
    result.currentUser = this.context.getStore(UserStore).getCurrentUser()
    result.dynamicNavItems = dynamicNavItems.map((item) => {
      item.hide = result.currentUser
      return item
    })
    this.setState(result)
  }

  filterNavItems() {
    const activeDynamicNavItems = this.state.dynamicNavItems.filter((item) => !item.hide)
    return this.state.staticNavItems.concat(activeDynamicNavItems)
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
            <Menu.Item key="/logout"><NavLink to="/me/logout">Log out</NavLink></Menu.Item>
          </Menu.ItemGroup>
        </Menu.SubMenu>}
      </Menu>
    )
  }
}

export default Nav
