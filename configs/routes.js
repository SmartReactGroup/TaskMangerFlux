import Home from '../client/components/Home'
import About from '../client/components/About'

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
  }
}
