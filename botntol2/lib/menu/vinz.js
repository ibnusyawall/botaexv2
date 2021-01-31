require('dotenv').config()
var needle  = require('needle')
var baseurl = 'https://api.zeks.xyz/api'

var vinzapi = ep => new Promise((resolve, reject) => {
    needle(`${baseurl}${ep}`, (err, resp, body) => {
        if (err) reject(err)
        resolve(body)
    })
})

module.exports = vinzapi

/*vinzapi(`/emoji-image?apikey=${process.env.vinz}&emoji=%F0%9F%98%83`)
  .then(data => console.log(data))
  .catch(err => console.log(err))
*/
