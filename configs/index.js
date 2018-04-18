import server from './server'
import instance from './instance'

export default {
  server,
  pathPrefix: (instance.name ? '/' : '') + instance.name
}
