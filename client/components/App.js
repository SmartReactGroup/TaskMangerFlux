import React from 'react'
import PropTypes from 'prop-types'
import { Nav } from '../components'

class App extends React.Component {

  static propTypes = {
    children: PropTypes.object
  }

  render() {
    const appInitData = Object.assign({}, { name: 'TaskManger' })
    const childs = React.cloneElement(this.props.children, appInitData)
    return (
      <div>
        <Nav />
        {childs}
      </div>
    )
  }
}

export default App
