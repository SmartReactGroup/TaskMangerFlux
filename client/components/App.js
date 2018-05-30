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
    location: PropTypes.object,
    history: PropTypes.object
  }

  render() {
    const appInitData = Object.assign({}, { name: 'TaskManger' })
    const childs = React.cloneElement(this.props.children, appInitData)
    return (
      <Layout className="layout">
        <Header style={{ background: 'white', borderBottom: '1px solid #e8e8e8', boxShadow: '1px 3px 5px #e8e8e8' }}>
          <div className="logo" />
          <Nav currentLocation={this.props.location} history={this.props.history} />
        </Header>
        <Content style={{ padding: '10px 50px', background: '#f0f2f5', marginTop: '10px' }}>
          {childs}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
           TaskMangerFlux Design @2018
        </Footer>
      </Layout>
    )
  }
}

export default withRouter(App)
