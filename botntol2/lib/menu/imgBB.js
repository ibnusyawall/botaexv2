require('dotenv').config()
const needle = require('needle')
const fs = require('fs')

var key = process.env.imgbb
var uri = 'https://api.imgbb.com/1/upload?expiration=600&key=' + key

//console.log(uri)

const imgBB = (buffer) => {
    return new Promise((resolve, reject) => {
        needle.post(uri, { 'image': buffer }, async (err, resp, body) => {
            try {
                resolve(body.data.image.url)
            } catch (err) {
                reject(err)
            }
        })
    })
}

//var data = fs.readFileSync('./../awokwok.jpg', 'base64')

/*imgBB(data)
  .then(d => console.log(d))
  .catch(err => console.log(err))
*/

module.exports = imgBB
