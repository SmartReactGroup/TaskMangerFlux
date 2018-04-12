import axios from 'axios'
import serverConfigs from '../../../configs/server'

const { host, port } = serverConfigs.api_server
const ACCOUNT_API_ADDRESS = `http://${host}:${port}`

/**
 *
 *
 * @export
 * @param {any} req
 * @param {any} res
 */
export async function login(req, res) {
  try {
    const response = await axios.post(`${ACCOUNT_API_ADDRESS}/auth/local`, req.body)
    res.status(200).json(response.data)
  } catch (error) {
    console.log(typeof error)
    res.status(500).json(error)
  }
}

/**
 *
 *
 * @export
 * @param {any} req
 * @param {any} res
 */
export async function getCurrentUser(req, res) {
  try {
    const options = { headers: { Authorization: `Bearer ${req.body.token}` } }
    const response = await axios.get(`${ACCOUNT_API_ADDRESS}/api/users/me`, options)
    res.status(200).json(response.data)
  } catch (error) {
    res.status(500).json(error)
  }
}
