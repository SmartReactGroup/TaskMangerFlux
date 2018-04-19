import server from './server'
import instance from './instance'
import development from './development'

export default {
  server,
  development,
  pathPrefix: (instance.name ? '/' : '') + instance.name
}
