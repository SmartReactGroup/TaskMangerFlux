import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { Nav } from '../components'

const { Header, Content, Footer } = Layout
class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    location: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      currentLocation: props.location
    }
  }

  render() {
    const appInitData = Object.assign({}, { name: 'TaskManger' })
    const childs = React.cloneElement(this.props.children, appInitData)
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Nav />
        </Header>
        <Content style={{ padding: '10px 50px' }}>
          <div style={{ padding: '24px' }}>
            {childs}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
           TaskMangerFlux Design @2018
        </Footer>
      </Layout>
    )
  }
}

export default App
