import axios from 'axios'
import { API } from './service'

/**
 * Login with third party API
 *
 * @export
 * @param {any} req
 * @param {any} res
 */
export function login(req, res) {
  axios
    .post(API.LOGIN, req.body)
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
      const response = await axios.get(API.GET_CURRENT_USER, options)
      res.status(200).json(response.data)
    } else {
      res.status(200).json(null)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

/**
 * Create new user
 *
 * @export
 * @param {any} req
 * @param {any} res
 */

export async function Register(req, res) {
  try {
    const response = await axios.post(API.BASE, req.body)
    req.session.token = response.data.token
    res.status(200).json(response.data)
  } catch (error) {
    const { status, data } = error.response
    res.status(status).send(data)
  }
}

export async function ChangePassword(req, res) {
  try {
    const { body, session, params } = req
    const url = `${API.BASE}/${params.id}/password?access_token=${session.token}`
    const response = await axios.put(url, {
      oldPassword: body.oldPassword,
      newPassword: body.newPassword
    })
    res.status(200).send(response.data)
  } catch (error) {
    const { status, data } = error.response
    res.status(status).send(data)
  }
}

export async function ChangeUserInfo(req, res) {
  try {
    const response = await axios.put(
      `${API.BASE}/${req.params.id}?access_token=${req.session.token}`, {
        name: req.body.name
      })
    res.status(200).send(response.data)
  } catch (error) {
    const { status, data } = error.response
    res.status(status).send(data)
  }
}

export function Logout(req, res) {
  if (req.session.token) {
    req.session.destroy()
    res.status(200).send({ message: 'logout successfully' })
  }
}
