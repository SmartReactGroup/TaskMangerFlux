import path from 'path'
import devConfigs from './development'

export default {
  dist: path.join(__dirname, '..', 'dist'),
  assets_file_path: path.join(__dirname, 'assets.js'),
  assets_style: `http://${devConfigs.host}:${devConfigs.port}/main.css`,
  assets_main: `http://${devConfigs.host}:${devConfigs.port}/main.js`,
  assets_common: `http://${devConfigs.host}:${devConfigs.port}/common.js`
}
