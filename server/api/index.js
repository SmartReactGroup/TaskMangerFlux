import account from './account'
import serverConfigs from '../../configs/server'

const { host, port } = serverConfigs.api_server
const ACCOUNT_API_ADDRESS = `http://${host}:${port}`

export default {
  user: {
    url: '/api/users',
    controller: account,
    apis: {
      LOGIN: `${ACCOUNT_API_ADDRESS}/auth/local`,
      GET_CURRENT_USER: `${ACCOUNT_API_ADDRESS}/api/users/me`
    }
  }
}
