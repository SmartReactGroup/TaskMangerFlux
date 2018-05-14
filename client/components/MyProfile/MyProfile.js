import React from 'react'
import { Avatar } from 'antd'
import PropTypes from 'prop-types'
import { UserStore } from '../../stores'
import AccountActions from '../../actions/AccountActions'

class MyProfile extends React.Component {
  static contextTypes = {
    getStore: PropTypes.func,
    executeAction: PropTypes.func
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    this.userStore = this.context.getStore(UserStore)
    this.state = {
      user: this.context.getStore(UserStore).getUser(),
      imgUrl: '/imgs/avator.jpg',
      selectedFile: null
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
    result.user = this.userStore.getCurrentUser()
    this.setState(result)
  }

  fileUpload(e) {
    console.log(e.target.files[0])
    this.setState({ selectedFile: e.target.files[0] })
    this.context.executeAction(AccountActions.UploadAvator, this.state.selectedFile)
  }
  render() {
    const { imgUrl } = this.state
    return (
      <div>
        <div className="avatar">
          <img className="avatarBackgroundImg" alt="example" style={{ width: '100%', height: '35%' }} src="/imgs/backgroundimg.jpg" />
          {/* <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> */}
          <div className="personal-avator">
            <Avatar src={imgUrl} />
            <input type="file" onChange={(e) => this.fileUpload(e)} />
          </div>
        </div>
        <div className="userInfo">
          {
            this.state.user && this.state.user.name && <h2>{this.state.user.name}</h2>
          }
          <div className="userDescription">
            <p>this is the user description.....this is the user description.....this is the user description.....this is the user description.....</p>
          </div>
        </div>
        <div className="userContent">
          userContent
        </div>
      </div>
    )
  }
}

export default MyProfile
