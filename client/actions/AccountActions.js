import HttpClient from '../utils/httpClient'

const ACCOUNT_URI = '/api/users'

export default {
  login: (actionContext, payload, done) => {
    console.log(payload)
    HttpClient.post(`${ACCOUNT_URI}/login`, { email: payload.email, password: payload.password })
      .then((res) => {
        // actionContext.dispatch('RECEIVED_SERVER_DATA', data)
        console.log('hello++++++++++')
        console.log(res.data)
        actionContext.dispatch('USER_LOGGED_IN', res.data.name)
        done()
      })
      .catch((err) => {
        console.log(err)
      })
  },

  getCurrentUser: () => {

  }
}
