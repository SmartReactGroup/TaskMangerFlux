import axios from 'axios'
import API from '../../api'

/**
 * Login with third party API
 *
 * @export
 * @param {any} req
 * @param {any} res
 */
export function login(req, res) {
  axios
    .post(API.user.apis.LOGIN, req.body)
    .then((response) => {
      req.session.token = response.data.token
      res.status(200).json(response.data)
    })
    .catch((err) => {
      const { status, data } = err.response
      res.status(status).json(data.message)
    })
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
    if (req.session.token) {
      const options = { headers: { Authorization: `Bearer ${req.session.token}` } }
      const response = await axios.get(API.user.apis.GET_CURRENT_USER, options)
      res.status(200).json(response.data)
    } else {
      res.status(200).json(null)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}
