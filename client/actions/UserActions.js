import axios from 'axios'
import HttpClient from '../utils/httpClient'

const USER_URI = {
  USERS: '/api/users',
  LOGIN: '/api/users/login',
  LOAD_SESSION: '/api/users/me',
  REGISTER: '/api/users/register',
  LOGOUT: '/api/users/logout'
}

export default {
  Login: (actionContext, payload, done) => {
    HttpClient.post(USER_URI.LOGIN, payload).then(() => {
      HttpClient.post(USER_URI.LOAD_SESSION).then((res) => {
        actionContext.dispatch('LOGIN_SUCCESS', res.data)
        done()
      })
    }).catch((err) => {
      actionContext.dispatch('LOGIN_FAILED', err.response.data)
      done()
    })
  },

  LoadSession: (actionContext, payload, done) => {
    HttpClient.post(USER_URI.LOAD_SESSION).then((res) => {
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
    HttpClient.post(USER_URI.REGISTER, payload).then(() => {
      HttpClient.post(USER_URI.LOAD_SESSION).then((res) => {
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
    axios({
      method: 'POST',
      url: `/api/users/${payload.user._id}/avatar?fieldname=avatar`,
      data: payload.content
    }).then((response) => {
      actionContext.dispatch('CHANGE_AVATAR_SUCCESS', response.data)
      done()
    }).catch((error) => {
      console.log(error)
      done()
    })
  },

  ChangePassword: (actionContext, payload, done) => {
    HttpClient.post(`${USER_URI.USERS}/${payload.user._id}/password`, payload).then((res) => {
      actionContext.dispatch('CHANGE_PASSWORD_SUCCESS', res.data)
      done()
    }).catch((err) => {
      const errResponse = err.response.data
      actionContext.dispatch('CHANGE_PASSWORD_FAILED', errResponse)
      done()
    })
  },

  ChangeUserInfo: (actionContext, payload, done) => {
    HttpClient.post(`${USER_URI.USERS}/${payload.user._id}/userinfo`, payload).then((res) => {
      actionContext.dispatch('CHANGE_USER_INFO', res.data)
      done()
    }).catch((err) => {
      console.error(err)
      done()
    })
  },

  Logout: (actionContext, payload, done) => {
    HttpClient.post(USER_URI.LOGOUT).then((res) => {
      actionContext.dispatch('LOGOUT', res.data)
      done()
    })
  }
}
