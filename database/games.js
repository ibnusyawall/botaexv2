var _ = require('lodash')
var moment = require('moment-timezone')
var Datastore = require('nedb'),
    db = new Datastore({ filename: process.cwd() + `/database/level.json` })

db.loadDatabase(err => { if (err) throw err; console.log('[:] Database level loaded.') })

const insertCist = (no, cmd) => new Promise((resolve, reject) => {
    let data = {
        no: no,
        cmd: cmd,
        date: new Date()
    }
    db.insert(data, async (err, resp) => {
        try {
            resolve(resp)
        } catch (err) {
            reject(err)
        }
    })
})


/*insertUser('62822992651515@s.whatsapp.net', 'ibnusyawall', 0, 'begginer', 20)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
*/

var checkCmdUser = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = _.isEmpty(doc) ? false : true
        resolve(data)
    })
})

var countCmdUser = nomor => new Promise((resolve, reject) => {
    db.count({ no: nomor }, (err, doc) => {
        if (err) throw err
        resolve(doc)
    })
})

var deleteCmdUser = nomor => new Promise((resolve, reject) => {
    db.remove({ no: nomor }, { multi: true }, (err, doc) => {
        if (err) throw err
        resolve(doc)
    })
})

var nomor = process.argv.splice(2).join` `

checkCmdUser(nomor).then(data => {
    console.log(data)
})

module.exports = { insertCist, countCmdUser, deleteCmdUser, checkCmdUser }
