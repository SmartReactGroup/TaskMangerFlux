import { Home, About, Login } from '../client/components'

export default {
  home: {
    path: '/',
    method: 'get',
    page: 'home',
    title: 'Home',
    handler: Home
  },
  about: {
    path: '/about',
    method: 'get',
    page: 'about',
    title: 'About',
    handler: About
  },
  login: {
    path: '/login',
    method: 'get',
    page: 'login',
    title: 'Login',
    handler: Login
  }
}
