import configs from '../../../configs/server'

const HOST = configs.service.host
const PORT = configs.service.port
export const TARGET = `http://${HOST}:${PORT}`
export const BASE = `${TARGET}/api/users`
export const API = {
  BASE,
  LOGIN: `${TARGET}/auth/local`,
  GET_CURRENT_USER: `${BASE}/me`
}
