import configs from '../../../configs/server'

const HOST = configs.service.host
const PORT = configs.service.port
export const TARGET = `http://${HOST}:${PORT}`
export const BASE = `${TARGET}/api/groups`
export const API = {
  BASE
}
