import axios from 'axios'

export default {
  post: (url, payload) => new Promise((resolve, reject) => {
    axios
      .post(url, payload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  }),

  get: (url, payload) => new Promise((resolve, reject) =>
    axios
      .get(url, payload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  ),

  put: (url, payload) => new Promise((resolve, reject) => {
    axios
      .put(url, payload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  }),

  delete: (url, payload) => new Promise((resolve, reject) => {
    axios
      .delete(url, payload)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
