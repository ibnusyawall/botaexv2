var _ = require('lodash')
var moment = require('moment-timezone')
var Datastore = require('nedb'),
    db = new Datastore({ filename: process.cwd() + `/database/groups.json` })

db.loadDatabase(err => { if (err) throw err; console.log('[:] Database groups loaded.') })

const insertGroup = (from, status, message = '') => new Promise((resolve, reject) => {
    let data = {
        ids: from,
        status: status,
        message: message,
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


/*insertGroup('62822992651515@s.whatsapp.net', 'on')
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
*/

var usersGroupInfo = from => new Promise((resolve, reject) => {
    db.findOne({ ids: from }, (err, doc) => {
        if (err) throw err
        var data = doc != null ? doc : false
        resolve(data)
    })
})

var updateGroupStatus = (from, t) => new Promise((resolve, reject) => {
    db.findOne({ ids: from }, (err, doc) => {
        if (err) throw err
        db.update({ ids: from }, { $set: { 'status': t } }, {}, (err, res) => {
            resolve(true)
        })
    })
})

var updateGroupMessage = (from, t) => new Promise((resolve, reject) => {
    db.findOne({ ids: from }, (err, doc) => {
        if (err) throw err
        db.update({ ids: from }, { $set: { 'message': t } }, {}, (err, res) => {
            resolve(true)
        })
    })
})

var checkGroupUser = from => new Promise((resolve, reject) => {
    db.findOne({ ids: from }, (err, doc) => {
        if (err) reject(err)
        var data = _.isEmpty(doc) ? false : true
        resolve(data)
    })
})

var countGroupUser = from => new Promise((resolve, reject) => {
    db.count({ ids: from }, (err, doc) => {
        if (err) throw err
        resolve(doc)
    })
})

var deleteGroupUser = from => new Promise((resolve, reject) => {
    db.remove({ ids: from }, { multi: true }, (err, doc) => {
        if (err) throw err
        resolve(doc)
    })
})

var nomor = process.argv.splice(2).join` `

usersGroupInfo(nomor).then(data => {
    console.log(data)
})

module.exports = { insertGroup, usersGroupInfo, checkGroupUser, countGroupUser, updateGroupStatus, updateGroupMessage }
