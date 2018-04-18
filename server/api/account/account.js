import axios from 'axios'
import { user } from '../../../server/api'

/**
 * Login with third party API
 *
 * @export
 * @param {any} req
 * @param {any} res
 */
export async function login(req, res) {
  try {
    const response = await axios.post(user.apis.LOGIN, req.body)
    req.session.token = response.data
    res.status(200).json(response.data)
  } catch (error) {
    res.status(500).json(error)
  }
}

/**
 * Get current session user
 *
 * @export
 * @param {any} req
 * @param {any} res
 */
export async function getCurrentUser(req, res) {
  try {
    const options = { headers: { Authorization: `Bearer ${req.session.token}` } }
    const response = await axios.get(user.apis.GET_CURRENT_USER, options)
    res.status(200).json(response.data)
  } catch (error) {
    res.status(500).json(error)
  }
}
