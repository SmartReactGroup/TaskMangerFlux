import React from 'react'
import { Icon, Modal } from 'antd'
import PropTypes from 'prop-types'
import { UserStore } from '../../stores'
import UserActions from '../../actions/UserActions'

class MyProfile extends React.Component {

  static contextTypes = {
    getStore: PropTypes.func,
    executeAction: PropTypes.func
  }

  constructor(props, context) {
    super(props)
    this.context = context
    this._onStoreChange = this._onStoreChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
    this.userStore = this.context.getStore(UserStore)
    this.state = {
      user: this.userStore.getCurrentUser(),
      avatar: null,
      visible: false,
      msg: ''
    }
  }
  componentDidMount() {
    this.context.getStore(UserStore).addChangeListener(this._onStoreChange)
  }

  componentWillUnmount() {
    this.context.getStore(UserStore).removeChangeListener(this._onStoreChange)
  }

  _onStoreChange(actions) {
    const result = {}
    const authEvents = ['CHANGE_AVATAR_SUCCESS']
    if (authEvents.includes(actions.event)) {
      result.msg = actions.msg
      result.user = this.context.getStore(UserStore).getCurrentUser()
      result.visible = false
    }

    if (Object.keys(result).length) {
      this.setState(result, () => {
        const inputDom = document.querySelector('input[type=file]')
        inputDom.value = ''
      })
    }
  }

  handleOk() {
    this.fileUpload()
  }

  handleCancel() {
    this.setState({
      visible: false
    }, () => {
      const inputDom = document.querySelector('input[type=file]')
      inputDom.value = ''
    })
  }

  previewAvatar(e) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.addEventListener('load', function () {
      const preview = document.querySelector('.previewAvator')
      preview.src = reader.result
    }, false)
    if (file) {
      this.setState({
        avatar: file,
        visible: true
      }, () => {
        reader.readAsDataURL(file)
      })
    }
  }

  fileUpload() {
    const { avatar, user } = this.state
    const formData = new FormData()
    formData.append('avatar', avatar, avatar.name)
    this.context.executeAction(UserActions.UploadAvator, {
      content: formData,
      user
    })
  }

  render() {
    const { user, visible } = this.state
    const timeStamp = new Date().getTime()
    return (
      <div>
        <div className="userInfo">
          <div className="profile-img">
            <img className="backgroundImg" src="/imgs/timg.jpeg" alt="" />
          </div>
          <div className="userAvator">
            <div className="overlay">
              <div className="text"><Icon type="camera-o" /><br /> Change Avator</div>
              <a><input className="avatorUpload" name="avatar" type="file" onChange={(e) => this.previewAvatar(e)} /></a>
            </div>
            {user &&
              <img className="avatorImg" src={`http://localhost:9000${user.images.avatar}?timeStamp=${timeStamp}`} alt="" />
            }
          </div>
          <div className="userDescription">
            <h1 style={{ marginBottom: 0 }}>{user && user.name}</h1>
            <p>Here is user description</p>
          </div>
        </div>
        <div className="userContent">
          userContent
        </div>
        <Modal
          visible={visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
        >
          <div className="cutOff-avator">
            <img className="previewAvator" src="" alt="" style={{ width: '100%', maxHeight: '400px' }} />
            <span>{this.state.msg}</span>
          </div>
        </Modal>
      </div>
    )
  }
}

export default MyProfile
