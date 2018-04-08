import axios from 'axios'

export default {
  post: (url, payload) =>
    new Promise((resolve, reject) => {
      axios
        .post(url, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
}
