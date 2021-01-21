require('dotenv').config()
var needle = require('needle')

var url = 'https://api.i-tech.id'
var key = process.env.key

const Kbbi = (query) => new Promise((resolve, reject) => {
    if (typeof query === 'undefined') { reject('masukan query.') }
    needle(url + '/tools/kbbi?key=' + key + '&query=' + query, async (err, resp, body) => {
        try {
//            if (body.code == 404) { reject('sepertinya error.') }
            resolve(body)
        } catch (err) {
            reject(err)
        }
    })
})

//Kbbi(process.argv[2]).then(data => console.log(data)).catch(err => console.log(err))

module.exports = Kbbi
