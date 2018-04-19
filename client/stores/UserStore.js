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
    this.emitChange('LOGIN_SUCCESS')
  }

  setUser(user) {
    this.user = user
  }

  getUser() {
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
  LOAD_SESSION_SUCCESS: 'loadSession'
}

export default UserStore
