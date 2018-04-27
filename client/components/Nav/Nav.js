import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Nav extends React.Component {
  static propTypes = {
    history: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.state = {
      currentLocation: props.history
    }
  }

  render() {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key=""><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="about"><Link to="/about">About</Link></Menu.Item>
        <Menu.Item key="login"><Link to="/login">Login</Link></Menu.Item>
      </Menu>
    )
  }
}

export default Nav
