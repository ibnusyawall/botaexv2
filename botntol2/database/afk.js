var _ = require('lodash')
var moment = require('moment-timezone')
var Datastore = require('nedb'),
    db = new Datastore({ filename: process.cwd() + `/database/_afk.json` })

db.loadDatabase(err => { if (err) throw err; console.log('[:] Database afk loaded.') })

/*const insertPremiumUser = (no, username, expired, limit, level, xp, games) => new Promise((resolve, reject) => {
    let data = {
        no: no,
        username: username,
        date: new Date(),
        role: 'premium',
        details: {
            expired: expired,
            limit: limit,
            level: level,
            xp: xp,
            games: games
        }
    }
    db.insert(data, async (err, resp) => {
        try {
            resolve(resp)
        } catch (err) {
            reject(err)
        }
    })
})*/

const insertAFK = (no, username, reason, groupId) => new Promise((resolve, reject) => {
    let data = {
        no: no,
        username: username,
        groupId: groupId,
        date: new Date(),
        reason: reason
    }
    db.insert(data, async (err, resp) => {
        try {
            resolve(resp)
        } catch (err) {
            reject(err)
        }
    })
})


/*insertAFK('6282299265151@s.whatsapp.net', 'ibnusyawall', 'boker', '7654321')
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
*/
/*var removeLimitUser = (nomor, limit) => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.limit': doc.details.limit - limit } }, {}, (err, res) => {
            //if (err) throw err
            resolve(res)
        })
//        resolve(doc)
    })
})*/

/*var removeXPUser = (nomor, xp) => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.xp': doc.details.xp - xp } }, {}, (err, res) => {
            //if (err) throw err
            resolve(doc)
        })
//        resolve(doc)
    })
})

var updateLimitUser = (nomor, limit) => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.limit': parseInt(doc.details.limit) + limit } }, {}, (err, res) => {
            //if (err) throw err
            resolve(res)
        })
//        resolve(doc)
    })
})*/

/*var updateXPUser = (nomor, xp) => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.xp': doc.details.xp + xp } }, {}, (err, res) => {
            //if (err) throw err
            resolve(doc)
        })
//        resolve(doc)
    })
})*/

/*var updateGamesUser = (nomor, games) => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.xp': doc.details.xp + games } }, {}, (err, res) => {
            //if (err) throw err
            resolve(doc)
        })
//        resolve(doc)
    })
})*/

/*var updateLimit = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.limit': --doc.details.limit } }, {}, (err, res) => {
//            if (err) throw err
            resolve(true)
        })
    })
})*/

/*var updateGames = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.games': --doc.details.games } }, {}, (err, res) => {
//            if (err) throw err
            resolve(true)
        })
    })
})*/

/*var updateResetLimit = (v) => new Promise((resolve, reject) => {
    db.find({ role: { $regex: /none/ } }, (err, doc) => {
        if (err) throw err
        doc.map(({ _id }) => {
            db.update({ _id: _id }, { $set: { 'details.limit': v } }, {}, (err, resp) => {
                resolve(true)
            })
        })
//        resolve(doc)
    })
})*/

var usersAFKInfo = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        var data = doc != null ? doc : false
        resolve(data)
    })
})

var usersAFKInfoAll = () => new Promise((resolve, reject) => {
    db.find({}, (err, doc) => {
        if (err) throw err
        var data = doc != null ? doc : false
        resolve(data)
    })
})

var checkAFK = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = _.isEmpty(doc) ? false : true
        resolve(data)
    })
})

var removeAFK = nomor => new Promise((resolve, reject) => {
     db.remove({ no: nomor }, {}, (err, doc) => {
         if (err) reject(err)
         resolve(doc)
     })
})
/*var checkUserLimit = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = doc != null ? ((doc.details.limit < 1) ? true : false) : false
        resolve(data)
    })
})
*/
/*var checkUserGames = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = doc != null ? ((doc.details.games < 1) ? true : false) : false
        resolve(data)
    })
})*/

/*var checkUserPremium = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = doc != null ? ((doc.role === 'premium') ? true : false) : false
        resolve(data)
    })
})*/

var nomor = process.argv.splice(2).join` `
/*
db.find({ role: { $regex: /premium/ } }, (err, doc) => {
        if (err) throw err
      //  doc.map(({ _id }) => {
        //    db.update({ _id: _id }, { $set: { 'details.limit': v } }, {}, (err, resp) => {
          //      resolve(true)
            //})
        //})
        console.log(doc)
    })*/
/*updateResetLimit(6).then(data => {
    console.log(data)
})*/
/*
updateLimit(nomor).then(data => {
    console.log(data)
    //console.log(data.details.limit)
})*/

Array.prototype.sortBy = function(p) {
  return this.slice(0).sort(function(a,b) {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
}

Array.prototype.shortY = function() {
    this.sort( function( a , b){
        if(a > b) return 1;
        if(a < b) return -1;
        return 0;
    });
}

/*usersAFKInfo(nomor).then(data => {
    console.log(data)
})*/

/*updateXPUser(nomor, 5).then(data => {
    console.log(data)
})*/

module.exports = {
    insertAFK,
    checkAFK,
    removeAFK,
    usersAFKInfo,
    usersAFKInfoAll,
}

