import BaseStore from 'fluxible/addons/BaseStore'

class UserStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher)
    this.user = null
  }

  loadSession(user) {
    this.user = user
    this.emitChange()
  }

  loginSuccess(user) {
    this.user = user
    this.emitChange({
      event: 'LOGIN_SUCCESS',
      msg: 'Login successfully'
    })
  }

  loginFailed(msg) {
    this.user = null
    this.emitChange({
      event: 'LOGIN_FAILED',
      msg
    })
  }

  registerSuccess(user) {
    this.user = user
    this.emitChange({
      event: 'REGISTER_SUCCESS',
      msg: 'Register successfully'
    })
  }

  registerFailed(msg) {
    this.user = null
    this.emitChange({
      event: 'REGISTER_FAILED',
      msg: msg.message
    })
  }

  changePasswordSuccess(msg) {
    this.emitChange({
      event: 'CHANGE_PASSWORD_SUCCESS',
      msg: msg.message
    })
  }

  changePasswordFailed(msg) {
    this.emitChange({
      event: 'CHANGE_PASSWORD_FAILED',
      msg: msg.message
    })
  }

  changeUserInfo() {
    this.emitChange({
      event: 'CHANGE_USER_INFO'
    })
  }

  logout(msg) {
    this.user = null
    this.emitChange({
      event: 'LOGOUT',
      msg: msg.message
    })
  }
  setUser(user) {
    this.user = user
  }

  getCurrentUser() {
    return this.user
  }

  dehydrate() {
    return {
      user: this.user
    }
  }

  rehydrate(state) {
    this.user = state.user
  }
}

UserStore.storeName = 'UserStore'
UserStore.handlers = {
  LOGIN_SUCCESS: 'loginSuccess',
  LOAD_SESSION_SUCCESS: 'loadSession',
  LOGIN_FAILED: 'loginFailed',
  REGISTER_SUCCESS: 'registerSuccess',
  REGISTER_FAILED: 'registerFailed',
  CHANGE_PASSWORD_SUCCESS: 'changePasswordSuccess',
  CHANGE_PASSWORD_FAILED: 'changePasswordFailed',
  CHANGE_USER_INFO: 'changeUserInfo',
  LOGOUT: 'logout'
}

export default UserStore
