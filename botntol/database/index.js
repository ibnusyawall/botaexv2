var _ = require('lodash')
var moment = require('moment-timezone')
var Datastore = require('nedb'),
    db = new Datastore({ filename: process.cwd() + `/database/_database.json` })

db.loadDatabase(err => { if (err) throw err; console.log('[:] Database loaded.') })

const insertPremiumUser = (no, username, expired, limit, level, xp, games) => new Promise((resolve, reject) => {
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
})

const insertUser = (no, username, limit, level, xp, games) => new Promise((resolve, reject) => {
    let data = {
        no: no,
        username: username,
        date: new Date(),
        role: 'none',
        details: {
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
})


/*insertUser('62822992651515@s.whatsapp.net', 'ibnusyawall', 0, 'begginer', 20)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
*/

var removeLimitUser = (nomor, limit) => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.limit': doc.details.limit - limit } }, {}, (err, res) => {
            //if (err) throw err
            resolve(res)
        })
//        resolve(doc)
    })
})

var removeXPUser = (nomor, xp) => new Promise((resolve, reject) => {
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
        db.update({ no: nomor }, { $set: { 'details.limit': doc.details.limit + limit } }, {}, (err, res) => {
            //if (err) throw err
            resolve(res)
        })
//        resolve(doc)
    })
})

var updateXPUser = (nomor, xp) => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.xp': doc.details.xp + xp } }, {}, (err, res) => {
            //if (err) throw err
            resolve(doc)
        })
//        resolve(doc)
    })
})

var updateGamesUser = (nomor, games) => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.xp': doc.details.xp + games } }, {}, (err, res) => {
            //if (err) throw err
            resolve(doc)
        })
//        resolve(doc)
    })
})

var updateLimit = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.limit': --doc.details.limit } }, {}, (err, res) => {
//            if (err) throw err
            resolve(true)
        })
    })
})

var updateGames = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        db.update({ no: nomor }, { $set: { 'details.games': --doc.details.games } }, {}, (err, res) => {
//            if (err) throw err
            resolve(true)
        })
    })
})

var updateResetLimit = (v) => new Promise((resolve, reject) => {
    db.find({ role: { $regex: /none/ } }, (err, doc) => {
        if (err) throw err
        doc.map(({ _id }) => {
            db.update({ _id: _id }, { $set: { 'details.limit': v } }, {}, (err, resp) => {
                resolve(true)
            })
        })
//        resolve(doc)
    })
})

var usersInfo = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) throw err
        var data = doc != null ? doc : false
        resolve(data)
    })
})

var usersInfoAll = () => new Promise((resolve, reject) => {
    db.find({}, (err, doc) => {
        if (err) throw err
        var data = doc != null ? doc : false
        resolve(data)
    })
})

var checkUser = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = _.isEmpty(doc) ? false : true
        resolve(data)
    })
})

var checkUserLimit = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = doc != null ? ((doc.details.limit < 1) ? true : false) : false
        resolve(data)
    })
})

var checkUserGames = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = doc != null ? ((doc.details.games < 1) ? true : false) : false
        resolve(data)
    })
})

var checkUserPremium = nomor => new Promise((resolve, reject) => {
    db.findOne({ no: nomor }, (err, doc) => {
        if (err) reject(err)
        var data = doc != null ? ((doc.role === 'premium') ? true : false) : false
        resolve(data)
    })
})

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

usersInfoAll().then(data => {
    console.log(data)
    var tampung = []
    var Xp = []
    var premi = data.filter(data => data.role === 'none')
    console.log(premi)
    /*data.map(({ no, details: xp, username }) => {
        tampung.push({ no: no, user: username, xp: xp.xp })
    })
    /*tampung.map(({ xp }) => {
        Xp.push(xp)
    })
    console.log(Xp.sort((a, b) => a - b))
    var t = tampung.sort((x, y) => x.xp - y.xp).reverse()
    console.log(t.findIndex(t => t.no == nomor) + 1)*/
    //console.log(da)
})

/*updateXPUser(nomor, 5).then(data => {
    console.log(data)
})*/

module.exports = {
    db,
    insertUser,
    insertPremiumUser,
    checkUser,
    checkUserLimit,
    checkUserPremium,
    usersInfo,
    usersInfoAll,
    updateLimit,
    updateResetLimit,
    updateLimitUser,
    updateXPUser,
    removeLimitUser,
    removeXPUser,
    updateGames,
    updateGamesUser,
    checkUserGames
}


