import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { Nav } from '../components'
import { UserStore } from '../stores'

const { Header, Content, Footer } = Layout

class App extends React.Component {

  static propTypes = {
    children: PropTypes.object,
    location: PropTypes.object
  }

  static contextTypes = {
    getStore: PropTypes.func
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    this.userStore = this.context.getStore(UserStore)
    this.state = {
      user: this.context.getStore(UserStore).getUser()
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
    result.user = this.userStore.getUser()
    this.setState(result)
  }

  render() {
    console.log(this.state.user)
    const appInitData = Object.assign({}, { name: 'TaskManger' })
    const childs = React.cloneElement(this.props.children, appInitData)
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Nav currentLocation={this.props.location} user={this.state.user} />
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
