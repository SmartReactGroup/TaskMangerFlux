import HttpClient from '../utils/httpClient'

const ACCOUNT_URI = {
  LOGIN: '/api/users/login',
  LOAD_SESSION: '/api/users/me',
  REGISTER: '/api/users/register'
}

export default {
  Login: async (actionContext, payload, done) => {
    HttpClient.post(ACCOUNT_URI.LOGIN, payload).then(() => {
      HttpClient.post(ACCOUNT_URI.LOAD_SESSION).then((res) => {
        actionContext.dispatch('LOGIN_SUCCESS', res.data)
        done()
      })
    }).catch((err) => {
      const errResponse = err.response.data
      actionContext.dispatch('LOGIN_FAILED', errResponse)
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
  },

  Register: (actionContext, payload, done) => {
    HttpClient.post(ACCOUNT_URI.REGISTER, payload).then(() => {
      HttpClient.post(ACCOUNT_URI.LOAD_SESSION).then((res) => {
        actionContext.dispatch('REGISTER_SUCCESS', res.data)
        done()
      })
    }).catch((err) => {
      const errResponse = err.response.data
      actionContext.dispatch('REGISTER_FAILED', errResponse)
      done()
    })
  },

  UploadAvator: (actionContext, payload, done) => {
    HttpClient.post(ACCOUNT_URI.LOAD_SESSION).then((res) => {
      if (res) {
        console.log(res)
      }
      done()
    }).catch((err) => {
      console.log(err)
      done()
    })
  }
}
