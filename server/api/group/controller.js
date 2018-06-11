import axios from 'axios'
import { API } from './service'

export default function getGroups(req, res) {
  axios
    .get(API.BASE, req.body)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      const { status, data } = err.response
      res.status(status).json(data.message)
    })
}
