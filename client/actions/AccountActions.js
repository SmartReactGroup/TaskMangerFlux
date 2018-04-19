import HttpClient from '../utils/httpClient'

const ACCOUNT_URI = {
  LOGIN: '/api/users/login',
  LOAD_SESSION: '/api/users/me'
}

export default {
  Login: async (actionContext, payload, done) => {
    HttpClient.post(ACCOUNT_URI.LOGIN, payload).then(() => {
      HttpClient.post(ACCOUNT_URI.LOAD_SESSION).then((res) => {
        actionContext.dispatch('LOGIN_SUCCESS', res.data)
        done()
      })
    }).catch((err) => {
      console.error(err)
      done(0)
    })
  },

  LoadSession: (actionContext, payload, done) => {
    HttpClient.post(ACCOUNT_URI.LOAD_SESSION).then((res) => {
      if (res) {
        actionContext.dispatch('LOAD_SESSION_SUCCESS', res.data)
      }
      done()
    }).catch((err) => {
      console.error(err)
      done()
    })
  }
}
