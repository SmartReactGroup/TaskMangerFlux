import BaseStore from 'fluxible/addons/BaseStore'

class UserStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher)
    this.user = null
    // this.errMsg = null
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

  loginFailed(msg) {
    this.user = null
    this.emitChange({
      status: 'LOGIN_FAILED',
      message: msg
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
  REGISTER_FAILED: 'registerFailed'
}

export default UserStore
