import HttpClient from '../utils/httpClient'

const ACCOUNT_URI = '/api/users'

export default {
  login: async (actionContext, payload, done) => {
    try {
      const tokenRes = await HttpClient.post(`${ACCOUNT_URI}/login`, payload)
      const userRes = await HttpClient.post(`${ACCOUNT_URI}/me`, tokenRes.data)
      actionContext.dispatch('USER_LOGGED_IN', userRes.data.name)
      done()
    } catch (error) {
      console.log(error)
    }
  },

  getCurrentUser: () => {

  }
}
