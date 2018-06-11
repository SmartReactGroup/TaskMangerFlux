import BaseStore from 'fluxible/addons/BaseStore'

class GroupStore extends BaseStore {
  constructor(dispatcher) {
    super(dispatcher)
    this.group = null
  }

  getGroups(group) {
    this.group = group
    this.emitChange({
      event: 'GET_GROUP_SUCCESS'
    })
  }

  dehydrate() {
    return {
      group: this.group
    }
  }

  rehydrate(state) {
    this.group = state.group
  }

}

GroupStore.storeName = 'GroupStore'
GroupStore.handlers = {
  GET_GROUP_SUCCESS: 'getGroups'
}
export default GroupStore
