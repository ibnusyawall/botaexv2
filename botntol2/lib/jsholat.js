const axios = require('axios')

const jsholat = (query) => {
    return new Promise((resolve, reject) => {
        if (typeof query === 'undefined') { reject('harap masukan nama daerah.') }
        var url = `https://api.haipbis.xyz/jadwalsholat?daerah=${query}`
        axios.get(url)
            .then(res => {
                const { Imsyak, Subuh, Dzuhur, Ashar, Maghrib, Isya, Dhuha } = res.data
resolve(res.data) //                resolve({ Imsyak, Subuh, Dzuhur, Ashar, Maghrib, Isya, Dhuha })
             })
            .catch(err => reject(err))
    })
}

//jsholat(process.argv[2]).then(data => console.log(data)).catch(err => console.log(err))
module.exports = jsholat
