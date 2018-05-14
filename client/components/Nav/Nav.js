import React from 'react'
import { Menu, Icon } from 'antd'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

class Nav extends React.Component {

  static propTypes = {
    currentLocation: PropTypes.object,
    user: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      navItems: [
        { path: '/', name: 'Home' },
        { path: '/about', name: 'About' },
        { path: '/login', name: 'Login' }
      ]
    }
  }

  render() {
    const { navItems } = this.state
    const { pathname } = this.props.currentLocation
    if (this.props.user && this.props.user.name) {
      const userMenu = { path: '/me', name: this.props.user.name }
      navItems.splice(navItems.length - 1, 1, userMenu)
    }
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[pathname]}
        style={{ lineHeight: '64px' }}
      >
        {navItems.map((navItem) => {
          if (navItem.path === '/me') {
            return (
              <Menu.SubMenu title={<span>{`welcome, ${navItem.name} `}<Icon type="down" /></span>} key={navItem.path} >
                <Menu.ItemGroup>
                  <Menu.Item key="/myprofile"><NavLink to={`${navItem.path}/myprofile`}>My Profile</NavLink></Menu.Item>
                  <Menu.Item key="/settings"><NavLink to={`${navItem.path}/settings`}>Settings</NavLink></Menu.Item>
                  <Menu.Item key="/logout">Log out</Menu.Item>
                </Menu.ItemGroup>
              </Menu.SubMenu>
            )
          }
          return <Menu.Item key={navItem.path}><NavLink to={navItem.path}>{navItem.name}</NavLink></Menu.Item>
        })}
      </Menu>
    )
  }
}

export default Nav
