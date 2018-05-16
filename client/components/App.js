import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { Nav } from '../components'
// import { UserStore } from '../stores'

const { Header, Content, Footer } = Layout

class App extends React.Component {

  static propTypes = {
    children: PropTypes.object,
    location: PropTypes.object
  }

  render() {
    const appInitData = Object.assign({}, { name: 'TaskManger' })
    const childs = React.cloneElement(this.props.children, appInitData)
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Nav currentLocation={this.props.location} />
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

export default withRouter(App)
