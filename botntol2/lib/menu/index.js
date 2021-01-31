require('dotenv').config()
const needle = require('needle')


class ApiTech {
    constructor() {
        this.url = 'https://api.i-tech.id'
        this.key = process.env.key
    }

    /**
     *  Random Quotes       *  Random Anime      *  Jurnal Otaku
     *  Random Nekonime     *  Random Anime2
     *  Random Nekonime2    *  Random Hentai
     *  Random Wibu         *  Random Yuri
     *  Random NSWF Neko    *  Random HUG
     *  Random Trap         *  Random D.VA
     */
    anim(type) {
        return new Promise((resolve, reject) => {
            var uri = `${this.url}/anim/${type}?key=${this.key}`

            needle(uri, async (err, resp, body) => {
                try {
                    resolve(body)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    /**
     *  Instagram TV        *  Google Search    *  Youtube Scraper    * Pinterest Scraper
     *  Instagram Scraper   *  Google Image     *  Youtube Search
     *  Instagram Stalker   *  Smule Scraper    *  Spotify Scraper
     *  Instagram Story     *  Smule Stalker    *  Joox Scraper
     *  Instagram Highlight *  Tiktok Scraper   *  Playstore
     *  Instagram Hastag    *  Tiktok Stalker   *  Facebook Scraper
     */
    downloader(type, q, query) {
        return new Promise((resolve, reject) => {
            var uri = `${this.url}/dl/${type}?key=${this.key}&${q}=${query}`

            needle(uri, async (err, resp, body) => {
                try {
                    resolve(body)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    /**
     *  Random Quotes       *  Random Rubah      *  Jadwal TV Sekarang
     *  Random Quotes2      *  Random Kambing    *  Penikmat Timeline
     *  Random Quotes3      *  Random Kucing     *  Berita Terkini
     *  Gempa Terkini       *  Random Anjing     *  Togel
     *  Fuck My Life        *  Fakta Unik        *  Tebak Gambar
     *  Random Asu          *  Pantun Fakboi     *  TTS Cak Lontong
     *  Family 100
     */
    toolsProperties(type) {
        return new Promise((resolve, reject) => {
            var uri = `${this.url}/tools/${type}?key=${this.key}`

            needle(uri, async (err, resp, body) => {
                try {
                    resolve(body)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    /**
     *  Jam Dunia            *  Random Nama             *  Animal Fact
     *  Cuaca Dunia          *  Search Lirik            *  QR Code Maker
     *  Chord Guitar         *  Jadwal sholat           *  KBBI Scraper
     *  Kata Alay            *  URL Shortner            *  Brainly Scraper
     *  Kata Hilih           *  Random Tongue Twister   *  Wikipedia Scraper
     *  Kata Ninja           *  Screenshot Website      *  Text To Speech
     *  Jadwal TV            *  Calender Generator      *  Tulis Di Buku
     *  Generate Cool Text   *  Icon Finder             *  Prediksi Umur
     *  MAC Addres           *  Al-Quran                *  Pasir Pantai
     *  Fire Generate
     */
    toolsParam1(type, q, query) {
        return new Promise((resolve, reject) => {
            var uri = `${this.url}/tools/${type}?key=${this.key}&${q}=${query}`

            needle(uri, async (err, resp, body) => {
                try {
                    resolve(body)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    /**
     *  Google Translate   *  Cek Resi       *  Simi Simi
     *  Name Color         *  Ramalan Jodoh  *
     */
    toolsParam2(type, q1, q2, query1, query2) {
        return new Promise((resolve, reject) => {
            var uri = `${this.url}/tools/${type}?key=${this.key}&${q1}=${query1}&${q2}=${query2}`

            needle(uri, async (err, resp, body) => {
                try {
                    resolve(body)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    /**
     *  Harta Tahta   *         * S
     */
    toolsParam3(type, q1, q2, q3, query1, query2, query3) {
        return new Promise((resolve, reject) => {
            var uri = `${this.url}/tools/${type}?key=${this.key}&${q1}=${query1}&${q2}=${query2}&${q3}=${query3}`

            needle(uri, async (err, resp, body) => {
                try {
                    resolve(body)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }

    /**
     *  Orang Hilang
     */
    toolsParam4(type, q1, q2, q3, q4, query1, query2, query3, query4) {
        return new Promise((resolve, reject) => {
            var uri = `${this.url}/tools/${type}?key=${this.key}&${q1}=${query1}&${q2}=${query2}&${q3}=${query3}&${q4}=${query4}`

            needle(uri, async (err, resp, body) => {
                try {
                    resolve(body)
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}

const AexBot = new ApiTech()

const copyright = '\n\n----    ----\n*©aex-bot copyright | science 2019-2020*'

AexBot.toolsParam3('qtm', 'type', 'author', 'text', 'love', 'syawal', 'hola')
                .then(data => {
//var key = Object.keys(data)
console.log(data)
                })
                .catch(err => {
                    console.log(err)
                })
module.exports = ApiTech
