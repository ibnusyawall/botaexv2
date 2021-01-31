const needle = require('needle')
const url = 'https://textpro.me/create-3d-avengers-logo-online-974.html'
const imageToBase64 = require('image-to-base64')
const html2json = require('html-to-json')

const textPorn = (text) => new Promise((resolve, reject) => {
    if (typeof text === 'undefined') { reject('masukan text.') }
/*    needle(url + '=' + text.split(' ')[0] + '&text2=' + text.split(' ')[1], async (err, resp, body) => {
        try {
              resolve(body)
/*            imageToBase64(body.result)
              .then(data => {
                  var buffer = Buffer.from(data, 'base64')
                  resolve(buffer)
              })
        } catch(err) { reject(err) }
    })*/
    needle(url)
        .then(data => {
            html2json.parse(data.body, {
               'key': ['input', (key) => {
                    return key.attr('value')
                }]
            }, (err, result) => {
                if (err) reject(err)
                const options = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                needle.post(url, { 'text[]': 'ibnu', 'text[]': 'syawal as salim', 'submit': 'Go', 'token': result.key[4] }, options, async (err, resp, body) => {
                    try {
                        resolve(body)
                    } catch (err) {
                         reject(err)
                    }
                })
            })
            //resolve(data.body)
        })
})

//textPorn(process.argv.splice(2).join(' ')).then(data => console.log(data))
module.exports = textPorn
