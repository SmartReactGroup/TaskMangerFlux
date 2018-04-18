import React from 'react'
import PropTypes from 'prop-types'
import { Nav } from '../components'

class App extends React.Component {
  render() {
    const appInitData = Object.assign({}, { name: 'TaskManger' })
    const child = React.cloneElement(this.props.children, appInitData)
    return (
      <div>
        <Nav />

        {child}

      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object
}

export default App
