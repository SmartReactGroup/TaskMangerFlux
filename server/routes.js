/* eslint-disable all, no-param-reassign, react/prop-types */
import React from 'react'
import { Switch } from 'react-router'
import { Route, matchPath, Redirect } from 'react-router-dom'

import { Home, About, Login } from '../client/components'
import { pathPrefix } from '../configs'
import App from '../client/components/App'

function getInstancePath(pathname) {
  let instancePath = pathname
  // const pathPrefix = config.path_prefix
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

const routesConfig = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/about',
    component: About
  }
]

// update routes config with instance name
const updateRoutesConfig = (routeConfig) => {
  const { path, redirect, routes } = routeConfig
  if (path) {
    routeConfig.path = getInstancePath(path)
  }

  if (redirect) {
    const { authorized, unauthorized } = redirect
    if (authorized) {
      redirect.authorized = getInstancePath(authorized)
    }
    if (unauthorized) {
      redirect.unauthorized = getInstancePath(unauthorized)
    }
  }
  if (routes) {
    routes.forEach(updateRoutesConfig)
  }
}
routesConfig.forEach(updateRoutesConfig)

const StaticRouteWithSubRoutes = (route) => {
  const { fluxibleContext, path, redirect, component: Component } = route

  // check auth
  const getRenderComponent = (props) => {
    let result = <Component {...props} />
    if (!redirect) {
      return result
    }

    const isAuthenticated = fluxibleContext && fluxibleContext.getStore('UserStore').user
    const redirectToOption = {
      state: {
        from: props.location
      }
    }

    let shouldRedirect = false
    const { authorized, unauthorized } = redirect

    if (isAuthenticated && authorized) {
      redirectToOption.pathname = authorized
      shouldRedirect = true
    } else if (!isAuthenticated && unauthorized) {
      redirectToOption.pathname = unauthorized
      shouldRedirect = true
    }

    if (redirectToOption.pathname === props.location.pathname) {
      shouldRedirect = false
    }

    if (shouldRedirect) {
      const { staticContext } = props
      if (staticContext) {
        staticContext.stateCode = 302
        staticContext.url = redirectToOption.pathname
      }
      result = <Redirect to={redirectToOption} />
    }

    return result
  }

  return <Route path={path} render={getRenderComponent} />
}

const createRoutes = (context) => (
  <App context={context}>
    <Switch>
      {routesConfig.map((subRoute, k) => (
        <StaticRouteWithSubRoutes key={k} {...subRoute} fluxibleContext={context} />
      ))}
    </Switch>
  </App>
)

const extractRoutesMetadataRecursive = (routes, context, url) => {
  let promises = []
  let components = []
  routes.forEach((route) => {
    const match = matchPath(url, route)
    if (!match) {
      return
    }

    const { component, routes: nestedRoutes } = route

    if (component) {
      components.push(component)
    }

    const { fetchData } = component || {}

    if (fetchData) {
      promises.push(fetchData.bind(null, context, route))
    }

    if (nestedRoutes) {
      const { promises: nastedPromise, components: nestedComponents } = extractRoutesMetadataRecursive(
        nestedRoutes,
        context,
        url
      )
      promises = promises.concat(nastedPromise)
      components = components.concat(nestedComponents)
    }
  })
  return { promises, components }
}
const extractRoutesMetadata = extractRoutesMetadataRecursive.bind(null, routesConfig)

export default {
  StaticRouteWithSubRoutes,
  createRoutes,
  extractRoutesMetadata
}
