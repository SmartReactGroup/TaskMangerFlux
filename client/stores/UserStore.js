import BaseStore from 'fluxible/addons/BaseStore'

class UserStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher)
    this.user = ''
  }

  handleUserLogIn(user) {
    this.user = user
    this.emitChange()
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
  USER_LOGGED_IN: 'handleUserLogIn'
}

export default UserStore
