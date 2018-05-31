import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Layout } from 'antd'
import { Nav } from '../components'
import { UserStore } from '../stores'
import { Message } from '../utils'

const { Header, Content, Footer } = Layout

class App extends React.Component {

  static propTypes = {
    children: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object
  }

  static contextTypes = {
    getStore: PropTypes.func,
    executeAction: PropTypes.func
  }

  constructor(props, context) {
    super(props)
    this.context = context
  }

  _onStoreChange(action) {
    if (action.event === 'AUTHORIZATION_FAILED') {
      Message.warning(action.msg, () => this.props.history.push('/'))
    }
  }

  componentDidMount() {
    this.context.getStore(UserStore).addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.context.getStore(UserStore).removeChangeListener(this._onStoreChange)
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
