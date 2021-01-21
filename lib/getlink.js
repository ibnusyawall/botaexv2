const needle = require('needle')


const getLink = (link) => {
    return new Promise((resolve, reject) => {
        if (typeof link === 'undefined') { reject('masukan param link.') }
        needle(link)
            .then(resp => {
                resolve(resp.headers)
            })
            .catch(err => {
                reject(err)
            })
    })
}


/*getLink(process.argv.splice(2).join(' '))
   .then(data => console.log(data))
   .catch(err => console.log(err))
*/
