import HttpClient from '../utils/httpClient'

const ACCOUNT_URI = {
  LOGIN: '/api/users/login',
  LOAD_SESSION: '/api/users/me'
}

export default {
  Login: (actionContext, payload, done) => {
    HttpClient.post(ACCOUNT_URI.LOGIN, payload).then(() => {
      HttpClient.post(ACCOUNT_URI.LOAD_SESSION).then((res) => {
        actionContext.dispatch('LOGIN_SUCCESS', res.data)
        done()
      })
    }).catch((err) => {
      actionContext.dispatch('LOGIN_FAILED', err.response.data)
      done()
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
