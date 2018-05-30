import React from 'react'
import { Icon, Modal } from 'antd'
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
      user: this.context.getStore(UserStore).getCurrentUser(),
      selectedFile: null,
      visible: false
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

  handleOk() {
    this.fileUpload()
    this.setState({
      visible: false
    }, () => {
      const inputDom = document.querySelector('input[type=file]')
      inputDom.value = ''
    })
  }

  handleCancel() {
    this.setState({
      visible: false
    }, () => {
      const inputDom = document.querySelector('input[type=file]')
      inputDom.value = ''
    })
  }

  changeFile(e) {
    const file = e.target.files[0]
    const preview = document.querySelector('.previewAvator')
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      this.setState({
        selectedFile: file,
        visible: true
      }, () => {
        preview.src = reader.result
      })
    }, false)
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  previewFile(e) {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.addEventListener('load', function () {
      const preview = document.querySelector('.previewAvator')
      preview.src = reader.result
    }, false)
    if (file) {
      this.setState({
        selectedFile: file,
        visible: true
      }, () => {
        reader.readAsDataURL(file)
      })
    }
  }

  fileUpload() {
    const formData = new FormData()
    formData.append('avatar', this.state.selectedFile, this.state.selectedFile.name)
    const options = {
      content: formData,
      user: this.state.user
    }
    this.context.executeAction(AccountActions.UploadAvator, options)
  }

  render() {
    const { user, visible } = this.state
    console.log('visible ========', visible)
    return (
      <div>
        <div className="userInfo">
          <div className="profile-img">
            <img className="backgroundImg" src="/imgs/timg.jpeg" alt="" />
          </div>
          <div className="userAvator">
            <div className="overlay">
              <div className="text"><Icon type="camera-o" /><br /> Change Avator</div>
              <a><input className="avatorUpload" type="file" onChange={(e) => this.previewFile(e)} /></a>
            </div>
            <img className="avatorImg" src="/imgs/avator.jpg" alt="" />
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
          visible={this.state.visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
        >
          <div className="cutOff-avator">
            <img className="previewAvator" src="" alt="" style={{ width: '100%', maxHeight: '400px' }} />
          </div>
        </Modal>
      </div>
    )
  }
}

export default MyProfile
