const moment = require("moment-timezone")
const fs = require("fs")
const ffmpeg = require('fluent-ffmpeg')
const imageToBase64 = require('image-to-base64')
const needle = require('needle')

var _ = require('lodash')
var canvas = require('canvacord')
var Exif = require(process.cwd() + '/lib/exif.js')

var exif = new Exif()

const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")

const
{
   ChatModification,
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
   GroupSettingChange
} = require("@adiwajshing/baileys")

const { nulis } = require(process.cwd() + '/lib')

const {
  db,
  insertUser,
  insertPremiumUser,
  checkUser,
  checkUserLimit,
  checkUserPremium,
  usersInfo,
  updateLimit,
  updateResetLimit,
  updateXPUser,
  updateLimitUser,
  removeXPUser,
  removeLimitUser,
  usersInfoAll,
  updateGames,
  updateGamesUser,
  checkUserGames
} = require(process.cwd() + '/database/index')

var {
    insertAFK,
    checkAFK,
    removeAFK,
    usersAFKInfo,
    usersAFKInfoAll,
} = require(process.cwd() + '/database/afk')

const { insertGroup, usersGroupInfo, checkGroupUser, countGroupUser, updateGroupStatus, updateGroupMessage } = require(process.cwd() + '/database/groups')
const ApiTech = require(process.cwd() + '/lib/menu/index')
const { exec, spawnSync } = require("child_process")
const textPorn = require(process.cwd() + '/lib/textporn')
const Archy = require(process.cwd() + '/lib/menu/Archy')
const imgBB = require(process.cwd() + '/lib/menu/imgBB')
const listMenu = require(process.cwd() + '/lib/menu/listMenu.js')
const imgbb = require('imgbb-uploader')

const AexBot = new ApiTech()

const copyright = `\n\n----    ----\n*©aex-bot copyright | science 2019-${moment().format('YYYY')}*`

prefix = '.'

Array.prototype.sortBy = function(p) {
  return this.slice(0).sort(function(a,b) {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
}

const UNITTESTING2 = async (client, m) => {
    global.prefix

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    var getTimeProcess = (format) => {
        function pad(s) {
            return (s < 10 ? '0' : '') + s
        }
        var hours = Math.floor(format / (60*60));
        var minutes = Math.floor(format % (60*60) / 60);
        var seconds = Math.floor(format % 60);

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    }

    var proses = process.uptime()

    var tm = ts => moment(new Date(parseInt(ts) * 1000)).fromNow()
    var toJSON = t => JSON.stringify(t, null, '\t') || ''

    if (!m.message) return
    if (m.key && m.key.remoteJid == 'status@broadcast') return
    if (m.key.fromMe) return

    const content = JSON.stringify(m.message)
    const from = m.key.remoteJid
    const type = Object.keys(m.message)[0]
    const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType

    body = (type === 'conversation' && m.message.conversation.startsWith(prefix)) ? m.message.conversation : (type == 'imageMessage') && m.message.imageMessage.caption.startsWith(prefix) ? m.message.imageMessage.caption : (type == 'videoMessage') && m.message.videoMessage.caption.startsWith(prefix) ? m.message.videoMessage.caption : (type == 'extendedTextMessage') && m.message.extendedTextMessage.text.startsWith(prefix) ? m.message.extendedTextMessage.text : ''
    budy = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
    const argv = body.slice(1).trim().split(/ +/).shift().toLowerCase()
    const args = body.trim().split(/ +/).slice(1)

    const isGroup = from.endsWith('@g.us')
    const id = isGroup ? m.participant : m.key.remoteJid
    const owner = '6282299265151@s.whatsapp.net'

    const isCmd = body.startsWith(prefix)
    const isBot   = client.user.jid
    const isOwner = id === owner ? true : false

    const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const groupId = isGroup ? groupMetadata.jid : ''

    const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage')
    const isQuotedImage   = type === 'extendedTextMessage' && content.includes('imageMessage')
    const isQuotedVideo   = type === 'extendedTextMessage' && content.includes('videoMessage')
    const isQuotedAudio   = type === 'extendedTextMessage' && content.includes('audioMessage')
    const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
    const isQuotedMessage   = type === 'extendedTextMessage' && content.includes('conversation')

    const fromBot   = isQuotedMessage ? m.message.extendedTextMessage.contextInfo.participant : null
    const isFromBot = fromBot != null ? fromBot === isBot : false

    //var Filter = groups.filter(data => data.ids === from)
    //var Ids    = _.isEmpty(Filter)

    var stickerWm = (media, packname, author) => {
        ran = 'stcwm.webp'
        exif.create(packname, author, id.split("@")[0])
        exec(`webpmux -set exif ./temp/${id.split("@")[0]}.exif ./${media} -o ./${ran}`, (err, stderr, stdout) => {
//            fs.unlinkSync(media)
            if (err) return client.sendMessage(from, String(err), text, { quoted: m })
            client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: m})
//            fs.unlinkSync(ran)
        })
    }

    var isWellcome = isGroup ? await checkGroupUser(from) : false

    const client2 = {
        sendVideoFromUrl: function(f, u, c = '') {
            var path = 'videos.mp4'
            var data = fs.createWriteStream(path)
            needle.get(u).pipe(data).on('finish', () => {
                var file = fs.readFileSync(path)
                client.sendMessage(f, file, video, { quoted: m, caption: c })
            })
        },
        getName: function(i) {
            var v = client.contacts[i] || { notify: i.replace(/@.+/, '') }
            return v.name || v.vname || v.notify
        },
        forwardMessage: function(f, t, type) {
            var options = {
                contextInfo: { forwardingScore: 1, isForwarded: true }
            }
            client.sendMessage(f, t, type, options)
        },
        fakeReply: function(f = '', t = '', tg) {
            var ehe = tg.startsWith('08') ? tg.replace(/08/, '628') : tg

            var options = {
                contextInfo: {
                    participant: ehe + '@s.whatsapp.net',
                    quotedMessage: {
                        extendedTextMessage: {
                            text: f
                        }
                    }
                }
            }
            client.sendMessage(from, `${t}`, MessageType.text, options)
        },
        reply: function(f, t) {
            client.sendMessage(f, t, text, { quoted: m })
        },
        sendText: function(f, t) {
            client.sendMessage(f, t, text)
        },
        sendImage: function(f, i, c = null) {
            imageToBase64(i)
                .then(data => {
                     var buffer = fs.readFileSync(data, 'base64')
                     client.sendMessage(f, buffer, image, { quoted: m, caption: c })
                })
        },
        sendImageFromUrl: function(f, u, c = '', id) {
            imageToBase64(u)
                .then(data => {
                    var options = {
                        quoted: id,
                        caption: c
                    }
        //            client.sendMessage(f, data, text, { quoted: id })
                    var buffer = Buffer.from(data, 'base64')
                    client.sendMessage(f, buffer, image, options)
                })
        },
        sendTtpAsSticker: function(f, t = 'ttp bro') {
          var url = `https://api.areltiyan.site/sticker_maker?text=${t}`

          needle(url, async (err, resp, body) => {
              try {
                  var namafile = 'pel.jpeg'
                  var namastc = 'pel'
                  var datas = body.base64.replace('data:image/png;base64,', '').toString('base64')
                  fs.writeFileSync(namafile, datas, 'base64')
                  exec('cwebp -q 50 ' + namafile + ' -o temp/' + namastc + '.webp', (error, stdout, stderr) => {
                       if (error) console.log(stderr)
                       var result = fs.readFileSync('./temp/' + namastc + '.webp')
                       client.sendMessage(f, result, sticker, { quoted: m })
                  })
              } catch (err) {
                  throw err
              }
          })
        },
        sendStickerfromUrl: function(f, u, id) {
            imageToBase64(u)
                .then(data => {
                     var namafile = 'url.jpeg'
                     var namaStc = 'url'
                     fs.writeFileSync(namafile, data, 'base64')
                     exec('cwebp -q 50 ' + namafile + ' -o temp/' + namaStc + '.webp', (error, stdout, stderr) => {
                         if (error) console.log(stderr)
                         var result = fs.readFileSync('./temp/' + namaStc + '.webp')
                         client.sendMessage(f, result, MessageType.sticker)
                     })
                })
        },
        sendTts: function(f, l, t) {
            var tts = require('node-gtts')[l]
            tts.save(process.cwd() + '/tts.ogg', t, async () => {
                if (err) throw err
                var buffer = fs.readFileSync('./tts.ogg')
                await client.sendMessage(f, buffer, audio, { quoted: m, ptt: true })
            })
        },
        sendAudioAsPtt: function(f, a) {
            var options = {
                __ogg: 'audio.ogg'
            }
            exec(`ffmpeg -i ${a} -ar 48000 -vn -c:a libopus ${options.__ogg}`, (err) => {
                var buffer = fs.readFileSync('./' + options.__ogg)
                client.sendMessage(f, buffer, audio, { quoted: m, ptt: true })
            })
        },
        sendTextWithMentions: function(f, b) {
           var options = {
               text: b.replace(/@s.whatsapp.net/gi, ''),
               contextInfo: { mentionedJid: b.match(/\d{1,3}?\d{1,10}\W/gi).join(' ').replace(/@/gi, '').split(' ').map(d => d + '@s.whatsapp.net') },
               quoted: m
           }
           client.sendMessage(f, options, text)
        },
        setGroupToAdminsOnly: function(f, s = true || false) {
            client.groupSettingChange(f, GroupSettingChange.messageSend, s)
        },
        setSubject: function(f, t) {
            client.groupUpdateSubject(f, t)
        },
        setDescription: function(f, t) {
            client.groupUpdateDescription(f, t)
        },
        promoteParticipant: function(f, p) {
            client.groupMakeAdmin(f, p)
        },
        demoteParticipant: function(f, p) {
            client.groupDemoteAdmin(f, p)
        },
        addParticipant: function(f, p = []) {
            client.grupAdd(f, p)
        },
        removeParticipant: function(f, p = []) {
            client.groupRemove(f, p)
        },
        getGroupInviteLink: function(f) {
            client.getGroupInviteLink(f)
        },
        setGroupProfilePicture: function(f, i) {
            var buffer = fs.readFileSync('./' + i)
            client.updateProfilePicture(f, buffer)
        },
        getProfilePicture: async function(f) {
            var profile = await client.getProfilePicture(f)
            return profile
        }
    }

    var isAdmin = async (where, idGroup) => {
        var group  = await client.groupMetadata(idGroup)
        var member = group['participants']
        var number = where.includes('s.whatsapp.net') ? where.replace(/s.whatsapp.net/, 'c.us') : where
        var isAdminGroup = member.filter(admin => admin.id === number)[0].isAdmin
        return isAdminGroup
    }

    var isBotAdmin = async (where, idGroup) => {
        var group  = await client.groupMetadata(idGroup)
        var member = group['participants']
        var number = where.includes('s.whatsapp.net') ? where.replace(/s.whatsapp.net/, 'c.us') : where
        var isAdminGroup = member.filter(admin => admin.id === number)[0].isAdmin
        return isAdminGroup
    }

    var logging = {
        isNotSticker: 'reply stiker dengan caption: .toimg',
        userIsNotAdmin: 'kamu bukan admin.',
        botIsNotAdmin: 'Jadikan aex sebagai admin untuk memaksimalkan fitur group!',
        isNotGroup: 'Command ini hanya berlaku didalam group saja.',
        isNotOwner: 'Command khusus owner bot!',
        isUserLimitGame: 'sayangnya limit game kamu telah habis, silahkan tunggu esok untuk mendapatkan limit kembali.',
        isUserLimit: 'limit kamu telah habis. Gunakan bot dengan bijak yah kak.Menjadi member premium akan membuat limit kamu tak terbatas lho!, cukup ketik *#daftarpremium* untuk info menjadi premium member!',
        isSudahDaftar: 'nomor kamu sudah terdaftar di db! mohon untuk tidak melakukan spam!',
        isNotDaftar: 'kamu belum terdaftar dalam db bot, ketik *.register* untuk pendaftaran pertama kamu!',
        isNotUserDB: 'user tsb tidak terdaftar di database kami, harap untuk mendaftar terlebih dahulu untuk menggunakan command ini!',
        active: '_semakin kamu aktif menggunakan bot ini, xp akan otomatis bertambah dengan sistem yang telah ditentukan._',
        imperror: '_image processing error_'
    }

    var commandListBot = ['.testing', '.mengetest', '.iya', '.abis']

    var isDaftar    = await checkUser(id)
    var isUserLimit = await checkUserLimit(id)
    var isUserLimitGame = await checkUserGames(id)
    var isPremium   = await checkUserPremium(id)
    var user   = await usersInfo(id)
    var xpuser = user != false ? user.details.xp : 0

    const randomHexs = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`
    const randomHex = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`

    var pushtime = []
    pushtime = { time: `${moment().format('HH:mm:ss')}`, id: id}

    var cekAFK = await checkAFK(id)

    if (m.message.extendedTextMesaage) {
        if (/\@\d/i.test(m.message.extendedTextMessage.text)) {
            var match = m.message.extendedTextMessage.text.match(/\@|\d/gi).join``
            var check = await checkAFK(`${match}@s.whatsapp.net`)
            if (check) {
                client.sendMessage(from, `_@${match} dia sedang afk!_`, text, { quoted: m, contextInfo: { mentionedJid: [`${match}@s.whatsapp.net`] } })
            }
        }
    }

    if (cekAFK) {
        usersAFKInfo(id)
            .then( async data => {
                await removeAFK(id)
                var capts = `_${data.username} sudah tidak afk!_`
                client2.sendText(from, capts)
            })
    }
    console.log(pushtime)

    switch (argv) {
       // afk
       case 'afk':
           if (!cekAFK) {
               insertAFK(id, client2.getName(id), args.join``, from)
                   .then(data => {
                       var capts = `_${data.username} sekarang afk!\nreason: ${data.reason}_`
                       client2.sendText(from, capts)
                   })
           }
           break
       // Games
       case 'pup':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 2) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'get':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 1) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'shift':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 3) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'right':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 2) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'up':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 4) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'down':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 3) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'rich':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 5) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'tap':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 2) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'guy':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 3) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'tic':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 2) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'tup':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 5) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'put':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 3) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break
       case 'pull':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           if (isUserLimitGame) return client2.reply(from, logging.isUserLimitGame)
           var arr  = [1, 2, 4, 6]
           var ran  = arr[Math.floor(Math.random() * arr.length)]
           var acak = Math.floor(Math.random() * 2) + ran

           await updateGames(id)
           updateGamesUser(id, acak)
               .then(res => {
                   client2.reply(from, `kamu mendapatkan *${acak}* xp!`)
               })
           break

       // Leveling
       case 'level':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           var level = ((xpuser >= 0) && xpuser <= 100) ? `1`
            : ((xpuser >= 100) && xpuser <= 230) ? `2`
            : ((xpuser >= 230) && xpuser <= 370) ? `3`
            : ((xpuser >= 370) && xpuser <= 520) ? `4`
            : ((xpuser >= 520) && xpuser <= 680) ? `5`
            : ((xpuser >= 680) && xpuser <= 850) ? `6`
            : ((xpuser >= 850) && xpuser <= 1130)  ? `7`
            : ((xpuser >= 1130) && xpuser <= 1320) ? `8`
            : ((xpuser >= 1320) && xpuser <= 1520) ? `9`
            : ((xpuser >= 1520) && xpuser <= 1730) ? `10`
            : ((xpuser >= 1730) && xpuser <= 1950) ? `11`
            : ((xpuser >= 1950) && xpuser <= 2180) ? `12`
            : ((xpuser >= 2180) && xpuser <= 2420) ? `13`
            : ((xpuser >= 2420) && xpuser <= 2670) ? `14`
            : ((xpuser >= 2670) && xpuser <= 2910) ? `15`
            : `15`
            var requiredXP = ((xpuser >= 0) && xpuser <= 100) ? `100`
            : ((xpuser >= 100) && xpuser <= 230) ? `230`
            : ((xpuser >= 230) && xpuser <= 370) ? `370`
            : ((xpuser >= 370) && xpuser <= 520) ? `520`
            : ((xpuser >= 520) && xpuser <= 680) ? `680`
            : ((xpuser >= 680) && xpuser <= 850) ? `850`
            : ((xpuser >= 850) && xpuser <= 1130)  ? `1130`
            : ((xpuser >= 1130) && xpuser <= 1320) ? `1320`
            : ((xpuser >= 1320) && xpuser <= 1520) ? `1520`
            : ((xpuser >= 1520) && xpuser <= 1730) ? `1730`
            : ((xpuser >= 1730) && xpuser <= 1950) ? `1950`
            : ((xpuser >= 1950) && xpuser <= 2180) ? `2180`
            : ((xpuser >= 2180) && xpuser <= 2420) ? `2420`
            : ((xpuser >= 2420) && xpuser <= 2670) ? `2679`
            : ((xpuser >= 2670) && xpuser <= 2910) ? `2910`
            : `~`
            var rank = ((xpuser >= 0) && xpuser <= 100) ? `ROOKIE`
            : ((xpuser >= 100) && xpuser <= 230) ? `ROOKIE`
            : ((xpuser >= 230) && xpuser <= 370) ? `ROOKIE`
            : ((xpuser >= 370) && xpuser <= 520) ? `VETERAN`
            : ((xpuser >= 520) && xpuser <= 680) ? `VETERAN`
            : ((xpuser >= 680) && xpuser <= 850) ? `VETERAN`
            : ((xpuser >= 850) && xpuser <= 1130)  ? `ELITE`
            : ((xpuser >= 1130) && xpuser <= 1320) ? `ELITE`
            : ((xpuser >= 1320) && xpuser <= 1520) ? `ELITE`
            : ((xpuser >= 1520) && xpuser <= 1730) ? `MASTER`
            : ((xpuser >= 1730) && xpuser <= 1950) ? `MASTER`
            : ((xpuser >= 1950) && xpuser <= 2180) ? `MASTER`
            : ((xpuser >= 2180) && xpuser <= 2420) ? `LEGEND`
            : ((xpuser >= 2420) && xpuser <= 2670) ? `LEGEND`
            : ((xpuser >= 2670) && xpuser <= 2910) ? `LEGEND`
            : `LEGEND`

            try {
                ppimg = await client.getProfilePicture(`${id.split('@')[0]}@c.us`)
            } catch {
                ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
            }
            usersInfoAll().then(data => {
                 var nampung = []
                 data.map(({ username: user, details, no }) => {
                     nampung.push({
                         no: no, user: user, xp: details.xp
                     })
                 })
                 var result   = nampung.sort((x, y) => x.xp - y.xp).reverse()
                 var position = result.findIndex(data => data.no === id) + 1

                 const ranked = new canvas.Rank()
                    .setAvatar(ppimg)
                    .setLevel(parseInt(level))
                    .setRankColor('#2c2f33', '#2c2f33')
                    .setCurrentXP(parseInt(xpuser))
                    .setRequiredXP(parseInt(requiredXP))
                    .setProgressBar([randomHexs, randomHex], 'GRADIENT')
                    .setUsername(client2.getName(id))
                    .setDiscriminator(1234)
                    .setStatus('online')
                    .setRank(position, rank)
                    .setRankColor('#ffffff', '#ffffff')
                ranked.build()
                    .then(async buffer => {
                        canvas.write(buffer, `${client2.getName(id)}.png`)
                        await client.sendMessage(from, buffer, image, { quoted: m, caption: `XP: ${xpuser}/${requiredXP}`})
                    })
                    .catch(err => console.log(err))
           })
           break
       // manipulate menu | mp
       case 'ohno':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           await updateXPUser(id, 1)

           if ((!args[0]) && args.length <= 2) return client2.reply(from, logging.imperror)
           canvas.Canvas.ohno(args.splice(0).join` `).then(buffer => {
               client.sendMessage(from, buffer, image, { quoted: m, caption: `_ohno success_`})
           })
           break
       case 'joke':
           if (isMedia || isQuotedImage) {
               if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
               if (isUserLimit) return client2.reply(from, logging.isUserLimit)

               await updateLimit(id)
               await updateXPUser(id, 1)
               var mediaEncrypt = JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo
               var mediaFinalys = await client.downloadAndSaveMediaMessage(mediaEncrypt, 'dlstikerwm')

               try {
                   canvas.Canvas.jokeOverHead(mediaFinalys).then(buffer => {
                       client.sendMessage(from, buffer, image, { quoted: m, caption: `_jokes success_`})
                   })
               } catch (e) {
                   throw e
                   client2.reply(from, logging.imperror)
               }
           }
           break
       case 'trigger':
           if (isMedia || isQuotedImage) {
               if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
               if (isUserLimit) return client2.reply(from, logging.isUserLimit)

               await updateLimit(id)
               await updateXPUser(id, 1)
               var mediaEncrypt = JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo
               var mediaFinalys = await client.downloadAndSaveMediaMessage(mediaEncrypt, 'dlstikerwm')

               try {
                   canvas.Canvas.trigger(mediaFinalys).then( async buffer => {
                       canvas.write(buffer, 'trigger.gif')
                       exec(`ffmpeg -i trigger.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" trigger.mp4`, async (err, stderr, stdout) => {
                           if (err) throw stderr
                           await ffmpeg('./trigger.mp4')
                               .inputFormat('mp4')
                               .on('start', function(cmd) {
                                    console.log(`START FFMPEG CONVERT STICKER FROM GIF FORMATING\n${cmd}`)
                                })
                               .on('error', function(err) {
                                    console.log(`Error : ${err}`)
                                    fs.unlinkSync('trigger.mp4')
                                    client2.reply(from, logging.imperror)
                                })
                               .on('end', function() {
                                    stickerWm('trigger.webp', 'aex-bot', '@isywl_')
//                                    client.sendMessage(from, fs.readFileSync('trigger.webp'), sticker, { quoted: m })
                                    setTimeout(() => {
                                        fs.unlinkSync('trigger.webp')
                                        fs.unlinkSync('trigger.mp4')
                                    }, 2000)
                                })
                               .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                               .toFormat('webp')
                               .save('trigger.webp')
                           })
                   })
               } catch (e) {
                   throw e
               }
           } else if (args.length >= 0) {
               if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
               if (isUserLimit) return client2.reply(from, logging.isUserLimit)

               await updateLimit(id)
               await updateXPUser(id, 1)

               try {
                   ppimg = await client.getProfilePicture(`${m.message.extendedTextMessage.contextInfo.mentionedJid[0].split('@')[0]}@c.us`)
               } catch {
                   ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
               }

               canvas.Canvas.trigger(ppimg).then( async buffer => {
                    canvas.write(buffer, 'trigger.gif')
                    exec(`ffmpeg -i trigger.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" trigger.mp4`, async (err, stderr, stdout) => {
                        if (err) throw stderr
                        await ffmpeg('./trigger.mp4')
                               .inputFormat('mp4')
                               .on('start', function(cmd) {
                                    console.log(`START FFMPEG CONVERT STICKER FROM GIF FORMATING\n${cmd}`)
                                })
                               .on('error', function(err) {
                                    console.log(`Error : ${err}`)
                                    fs.unlinkSync('trigger.mp4')
                                    client2.reply(from, logging.imperror)
                                })
                               .on('end', function() {
                                    stickerWm('trigger.webp', 'aex-bot', '@isywl_')
                                    //client.sendMessage(from, fs.readFileSync('trigger.webp'), sticker, { quoted: m })
                                    setTimeout(() => {
                                        fs.unlinkSync('trigger.webp')
                                        fs.unlinkSync('trigger.mp4')
                                    }, 2000)
                                })
                               .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                               .toFormat('webp')
                               .save('trigger.webp')
                    })
               })
           }
           break
       case 'botsay':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           await updateXPUser(id, 1)
           
           if ((!args[0] || !args[1]) && args.length <= 2) return client2.reply(from, logging.imperror)
           canvas.Canvas.clyde(args.splice(1).join` `, args[0]).then(buffer => {
               client.sendMessage(from, buffer, image, { quoted: m, caption: `_botsay success_`})
           })
           break
       case 'gradient':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           await updateXPUser(id, 1)
           if ((!args[0] || !args[1]) && args.length <= 2) return client2.reply(from, logging.imperror)
           var colorize = canvas.Canvas.gradient(args[0], args[1], 1024, 677)
           client.sendMessage(from, colorize, image, { quotee: m, caption: `_gradient result from ${args[0]} to ${args[1]}_` })
           break
       case 'debug':
           if (!isOwner) return client2.reply(from, logging.isNotOwner)
           try {
               return eval(args.join(' '))
           } catch (e) {
               client2.reply(from, String(e))
           }
           break
       case 'rank':
           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
           await updateXPUser(id, 1)

           level = ((xpuser >= 0) && xpuser <= 100) ? `${xpuser}/100`
            : ((xpuser >= 100) && xpuser <= 230) ? `${xpuser}/230`
            : ((xpuser >= 230) && xpuser <= 370) ? `${xpuser}/270`
            : ((xpuser >= 370) && xpuser <= 520) ? `${xpuser}/520`
            : ((xpuser >= 520) && xpuser <= 680) ? `${xpuser}/680`
            : ((xpuser >= 680) && xpuser <= 850) ? `${xpuser}/850`
            : ((xpuser >= 850) && xpuser <= 1130)  ? `${xpuser}/1130`
            : ((xpuser >= 1130) && xpuser <= 1320) ? `${xpuser}/1320`
            : ((xpuser >= 1320) && xpuser <= 1520) ? `${xpuser}/1520`
            : ((xpuser >= 1520) && xpuser <= 1730) ? `${xpuser}/1739`
            : ((xpuser >= 1730) && xpuser <= 1950) ? `${xpuser}/1950`
            : ((xpuser >= 1950) && xpuser <= 2180) ? `${xpuser}/2180`
            : ((xpuser >= 2180) && xpuser <= 2420) ? `${xpuser}/2429`
            : ((xpuser >= 2420) && xpuser <= 2670) ? `${xpuser}/2670`
            : ((xpuser >= 2670) && xpuser <= 2910) ? `${xpuser}/2919`
            : `${xpuser}/~`
           usersInfoAll().then(data => {
               var nampung = []
               data.map(({ username: user, details, no }) => {
                   nampung.push({
                       no: no, user: user, xp: details.xp
                   })
               })
               var result = nampung.sort((x, y) => x.xp - y.xp).reverse().slice(0, 10)
               var capts  = `LEADERBOARD *AEX-BOT*\n\n`;
               var index  = 1

               result.map(({ no, user, xp }) => {
                   /*siuser   = usersInfo(no)
                   sixpuser = siuser != false ? siuser.details.xp : 0

                   silevel = ((sixpuser >= 0) && sixpuser <= 100) ? `${xpuser}/100`
                   : ((sixpuser >= 100) && sixpuser <= 230) ? `${xpuser}/230`
                   : ((sixpuser >= 230) && sixpuser <= 370) ? `${sixpuser}/270`
                   : ((sixpuser >= 370) && sixpuser <= 520) ? `${sixpuser}/520`
                   : ((sixpuser >= 520) && sixpuser <= 680) ? `${sixpuser}/680`
                   : ((sixpuser >= 680) && sixpuser <= 850) ? `${sixpuser}/850`
                   : ((sixpuser >= 850) && sixpuser <= 1130)  ? `${sixpuser}/1130`
                   : ((sixpuser >= 1130) && sixpuser <= 1320) ? `${sixpuser}/1320`
                   : ((sixpuser >= 1320) && sixpuser <= 1520) ? `${sixpuser}/1520`
                   : ((sixpuser >= 1520) && sixpuser <= 1730) ? `${sixpuser}/1739`
                   : ((sixpuser >= 1730) && sixpuser <= 1950) ? `${sixpuser}/1950`
                   : ((sixpuser >= 1950) && sixpuser <= 2180) ? `${sixpuser}/2180`
                   : ((sixpuser >= 2180) && sixpuser <= 2420) ? `${sixpuser}/2429`
                   : ((sixpuser >= 2420) && sixpuser <= 2670) ? `${sixpuser}/2670`
                   : ((sixpuser >= 2670) && sixpuser <= 2910) ? `${sixpuser}/2919`
                   : `${sixpuser}/~`*/
                   capts += `*${index++}*. wa.me/${no.split(/@/)[0]}\n*XP*: ${xp}\n`
               })
               client2.reply(from, capts)
           })
           break
       case 'milih':
           milih = await client.sendMessage(from, 'silahkan reply dengan jawaban *yes/no*', text, { quoted: m })
           //if (m)
           client2.sendText(from, JSON.stringify(m, null, '\t'))
           break
       case 'limit':
           switch(args[0]) {
               case 'xp':
                   if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
                   var __ids  = args.join(' ').indexOf('@') < 0 ? args.join + '@s.whatsapp.net' : args.join(' ')

                   var isUser = await checkUser(__ids)

                   var user = await usersInfo(id)
                   var xpuser = user != false ? user.details.xp : 0

                   await client2.reply(from, `total xp kamu sekarang: ${xpuser}xp`)
                   break
               case 'hit':
                   if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)

                   var user = await usersInfo(id)
                   var xpuser = user != false ? ((user.details.limit < 0) ? 0 : user.details.limit) : 0

                   await client2.reply(from, `sisa limit penggunaan bot kamu: *${xpuser}*`)
                   break
               case 'games':
                   if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)

                   var user = await usersInfo(id)
                   var xpuser = user != false ? ((user.details.games < 0) ? 0 : user.details.games) : 0

                   await client2.reply(from, `sisa limit penggunaan games kamu: *${xpuser}*`)
                   break
               default:
                   break
           }
           break
        case 'send':
           switch(args[0]) {
               case 'xp':
                   if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
                   var split  = args.splice(1).join(' ').split('?')

                   var __ids  = split[0].indexOf('@') < 0 ? split[0] + '@s.whatsapp.net' : split[0]

                   var isUser = await checkUser(__ids)
                   if (!isUser) return client2.reply(from, logging.isNotUserDB)

                   var user = await usersInfo(id)
                   var xpuser = user != false ? user.details.xp : 0

                   var itis = xpuser >= parseInt(split[1])

                   if (!itis) return client2.reply(from, `xp kamu tidak mencukupi untuk mengirim dalam nominal ${split[1]}\nsisa xp kamu: *${xpuser}*\n\n${logging.active}`)

                   await removeXPUser(id, parseInt(split[1]))
                   await updateXPUser(__ids, parseInt(split[1]))

                   var options = {
                       contextInfo: { mentionedJid: [__ids] }
                   }

                   if (isGroup) return client.sendMessage(from, `selamat! @${__ids.split(/@/)[0]}! kamu mendapatkan kiriman xp berjumlah *${split[1]}* dari _${id}_\n\n${logging.active}`, text, options)
                   if (!isGroup) return client2.sendText(__ids, `selamat! kamu mendapatkan kiriman xp berjumlah *${split[1]}* dari _${id}_\n\n${logging.active}`)

                   break
               case 'hit':
                   if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
                   var split  = args.splice(1).join(' ').split('?')

                   var __ids  = split[0].indexOf('@') < 0 ? split[0] + '@s.whatsapp.net' : split[0]

                   var isUser = await checkUser(__ids)
                   if (!isUser) return client2.reply(from, logging.isNotUserDB)

                   var user = await usersInfo(id)
                   var xpuser = user != false ? ((user.details.limit < 0) ? 0 : user.details.limit) : 0

                   var itis = xpuser >= parseInt(split[1])
                   if (!itis) return client2.reply(from, `limit kamu tidak mencukupi untuk mengirim dalam nominal ${split[1]}\nsisa limit kamu: *${xpuser}*\n\n${logging.active}`)

                   await removeLimitUser(id, parseInt(split[1]))
                   await updateLimitUser(__ids, parseInt(split[1]))

                   var options = {
                       contextInfo: { mentionedJid: [__ids] }
                   }

                   if (isGroup) return client.sendMessage(from, `selamat! @${__ids.split(/@/)[0]}! kamu mendapatkan kiriman limit berjumlah *${split[1]}* dari _${id}_\n\n${logging.active}`, text, options)
                   if (!isGroup) return client2.sendText(__ids, `selamat! kamu mendapatkan kiriman limit berjumlah *${split[1]}* dari _${id}_\n\n${logging.active}`)

                   break
               default:
                   break
           }
           break
        case 'tukar':
           switch(args[0]) {
               case 'xp2limit':
                   if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
                   var xp2limit = n => parseInt(n/10)
                   var nilai = args.splice(1).join(' ')
                   var total = xp2limit(nilai)

                   var user = await usersInfo(id)
                   var xpuser = user != false ? user.details.xp : 0

                   var itis = xpuser >= nilai
                   if (!itis) return client2.reply(from, `xp kamu tidak mencukupi untuk membeli *${total}* limit\nsisa xp: ${xpuser}xp\n\n${logging.active}`)

                   await removeXPUser(id, nilai)
                   await updateLimitUser(id, total)

                   var options = {
                       contextInfo: { mentionedJid: [id] }
                   }

                   if (isGroup) return client.sendMessage(from, `selamat! @${id.split(/@/)[0]}! kamu telah membeli *${total}* limit demgan point xp kamu nominal ${nilai}xp!\n\n${logging.active}`, text, options)
                   if (!isGroup) return client2.sendText(id, `selamat! kamu telah membeli *${total}* limit demgan point xp kamu nominal ${args.join(' ')}xp!\n\n${logging.active}`)

               default:
                   break
           }
           break
        default:
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            break
    }
}

module.exports = UNITTESTING2
