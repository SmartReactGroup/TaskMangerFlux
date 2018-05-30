import { browserHistory } from '../utils/historyUtils'

import env from './env'
import UserActions from '../actions/UserActions'
import configs from '../../configs'

// session Mutex wrapper for fetchData
// return value is a promise
// options:
//     refresh: true, reload page when session validate failed
//              false(default), use history push to redirect to login page
export default (fluxibleContext, match, options = {}) =>
  new Promise((resolve, reject) => {
    fluxibleContext.executeAction(UserActions.LoadSession, {}).then(resolve).catch((error) => {
      // auth failed, redirect to the login page
      const { url } = match
      browserHistory.push(`${configs.pathPrefix}/login?returnUrl=${url}`)

      const { refresh } = options
      if (env.CLIENT && refresh) {
        window.location.reload()
      }
      return reject(error)
    })
  })
