const needle = require('needle')
const url = 'https://docs-jojo.herokuapp.com/api/phblogo?text1'
const imageToBase64 = require('image-to-base64')

const textPorn = (text) => new Promise((resolve, reject) => {
    if (typeof text === 'undefined') { reject('masukan text.') }
    needle(url + '=' + text.split(' ')[0] + '&text2=' + text.split(' ')[1], async (err, resp, body) => {
        try {
              resolve(body)
/*            imageToBase64(body.result)
              .then(data => {
                  var buffer = Buffer.from(data, 'base64')
                  resolve(buffer)
              })*/
        } catch(err) { reject(err) }
    })
})

//textPorn(process.argv.splice(2).join(' ')).then(data => console.log(data))
module.exports = textPorn
