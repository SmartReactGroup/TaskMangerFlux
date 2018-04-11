import BaseStore from 'fluxible/addons/BaseStore'

class UserStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher)
    this.username = ''
  }
  handleUserLogIn(user) {
    console.log(this.username)
    console.log(user)
    this.username = user
    this.emitChange()
  }
  getUser() {
    return this.username
  }
  dehydrate() {
    return {
      username: this.username
    }
  }
  rehydrate(state) {
    this.username = state.username
  }
}

UserStore.storeName = 'UserStore'
UserStore.handlers = {
  USER_LOGGED_IN: 'handleUserLogIn'
}
export default UserStore
