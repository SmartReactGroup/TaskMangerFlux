import _ from 'lodash'
import { createBrowserHistory, createMemoryHistory } from 'history'

import env from './env'
import configs from '../../configs'

let historyObject = null
if (env.CLIENT) {
  historyObject = createBrowserHistory()
} else if (env.SERVER) {
  historyObject = createMemoryHistory()
}

export const browserHistory = historyObject

export function replaceStateSilence(path) {
  if (env.CLIENT) {
    window.history.replaceState(null, null, path)
  }
}

export function goToPath(path) {
  if (env.CLIENT) {
    window.location.href = path
  }
}

export function isSameUrl(url1, url2, ignores) {
  const query1 = url1.substring(url1.indexOf('?') + 1)
  const query2 = url2.substring(url2.indexOf('?') + 1)
  let params1 = query1.split('&')
  let params2 = query2.split('&')
  if (ignores && ignores.length > 0) {
    ignores.forEach((key) => {
      params1 = params1.filter((param) => param.split('=')[0] !== key)
      params2 = params2.filter((param) => param.split('=')[0] !== key)
    })
  }

  return _.isEqual(params1.sort(), params2.sort())
}

export function getInstancePath(pathname) {
  let instancePath = pathname
  const pathPrefix = configs.path_prefix
  if (pathPrefix && !(pathname.indexOf(pathPrefix) === 0)) {
    if (pathname.toLowerCase().indexOf(pathPrefix.toLowerCase()) === 0) {
      const regEx = new RegExp(pathPrefix, 'i')
      pathname = pathname.replace(regEx, pathPrefix)
    } else if (pathname.indexOf('/') === 0) {
      instancePath = pathPrefix + pathname
    } else {
      instancePath = `${pathPrefix}/${pathname}`
    }
  }
  return instancePath
}

export function listenAndEnsureInstancePath() {
  if (env.CLIENT) {
    browserHistory.listenBefore((location) => {
      location.pathname = getInstancePath(location.pathname)
    })
  }
}
