const axios = require("axios")
const imageToBase64 = require('image-to-base64');

const nulis = (teks) => {
    return new Promise((resolve, reject) => {
        if (typeof teks === 'undefined') { reject('masukan teks yang akan ditulis.') }
        var url = 'http://salism3.pythonanywhere.com/write?text=' + teks.split('').join('  ')
        axios.get(url)
            .then(res => {
/*                imageToBase64(res.data.result)
                    .then(data => {
                        var buffer = Buffer.from(data, 'base64')
                        resolve(buffer)
                    })*/
resolve(res.data)
            })
            .catch(err => {
                reject(err)
            })
    })
}

///nulis(process.argv[2].repeat(process.argv[3])).then(data => console.log(data)).catch(err => console.log(err))
module.exports = nulis
