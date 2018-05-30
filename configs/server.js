import proxy from 'http-proxy-middleware'

export default {
  host: 'localhost',
  port: 3000,
  service: {
    host: 'localhost',
    port: 9000,
    proxy: proxy({
      target: 'http://localhost:9000', // target host
      changeOrigin: true, // needed for virtual hosted sites
      ws: true, // proxy websockets
    })
  },
  session: {
    url: 'mongodb://localhost/task-manger-session',
    ttl: 60 * 40
  }
}
