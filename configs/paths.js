import path from 'path'
import devConfigs from './development'
import serverConfigs from './server'

export default {
  dist: path.join(__dirname, '..', 'dist'),
  assets_file_path: path.join(__dirname, 'assets.js'),
  prod_server_path: path.join(__dirname, '..', 'server.js'),
  assets_style: `http://${devConfigs.host}:${devConfigs.port}/main.css`,
  assets_main: `http://${devConfigs.host}:${devConfigs.port}/main.js`,
  assets_common: `http://${devConfigs.host}:${devConfigs.port}/common.js`,
  express_server_address: `http://${serverConfigs.host}:${serverConfigs.port}/`
}
