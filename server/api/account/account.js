import axios from 'axios'
import serverConfigs from '../../../configs/server'

const { host, port } = serverConfigs.api_server
const ACCOUNT_API_ADDRESS = `http://${host}:${port}`

export default {
  login: (req, res) => {
    axios.post(`${ACCOUNT_API_ADDRESS}/auth/local`, req.body)
      .then(async (result) => {
        try {
          const user = await this.getCurrentUser(result.data)
          res.status(200).json(user)
        } catch (error) {
          res.status(401).json(error)
        }
      })
  },

  getCurrentUser: (token) => new Promise((resolve, reject) => {
    axios.get(`${ACCOUNT_API_ADDRESS}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
