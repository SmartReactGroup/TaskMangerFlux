import HttpClient from '../utils/httpClient'

export default {
  getGroups: (actionContext, payload, done) => {
    HttpClient.get('api/groups').then((res) => {
      actionContext.dispatch('GET_GROUP_SUCCESS', res.data)
      done()
    }).catch((err) => {
      console.error(err)
      done()
    })
  }
}
