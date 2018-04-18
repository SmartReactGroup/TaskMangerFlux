import React from 'react'
import { Link } from 'react-router-dom'

class Nav extends React.Component {

  render() {
    return (
      <ul>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
      </ul>
    )
  }
}

export default Nav
