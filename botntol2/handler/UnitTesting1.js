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

const UNITTESTING1 = async (client, m) => {
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
    var random = () => `${moment().format('ssmmHH_MMss_YYY')}_`

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

    var isWellcome = isGroup ? await checkGroupUser(from) : false

    var stickerWm = (media, packname, author) => {
        ran = 'stcwm.webp'
	exif.create(packname, author, id.split("@")[0])
        exec(`webpmux -set exif ./temp/${id.split("@")[0]}.exif ./${media} -o ./${ran}`, (err, stderr, stdout) => {
            //fs.unlinkSync(media)
            if (err) return client.sendMessage(from, String(err), text, { quoted: m })
            client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: m})
            //fs.unlinkSync(ran)
	})
    }

    const client2 = {
        sendVideoFromUrl: function(f, u, c = '') {
            var path = 'videos.mp4'
            var data = fs.createWriteStream(path)
            needle.get(u).pipe(data).on('finish', () => {
                var file = fs.readFileSync(path).toString('base64')
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
        active: '_semakin kamu aktif menggunakan bot ini, xp akan otomatis bertambah dengan sistem yang telah ditentukan._'
    }

    var commandListBot = ['.testing', '.mengetest', '.iya', '.abis']

    var isDaftar    = await checkUser(id)
    var isUserLimit = await checkUserLimit(id)
    var isUserLimitGame = await checkUserGames(id)
    var isPremium   = await checkUserPremium(id)
    var user   = await usersInfo(id)
    var xpuser = user != false ? user.details.xp : 0
    const istimer = (ts) => moment.duration(moment() - moment(ts * 1000)).asSeconds()

    const randomHexs = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`
    const randomHex = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`

    var pushtime = []
    pushtime = { time: `${moment().format('HH:mm:ss')}`, id: id}

    console.log(pushtime)

    var salam = ['assalamualaikum', 'p', 'hei', 'mikum', '.', 'punten']
    var kasar = ['jancok', 'babi', 'anjing', 'babi', 'memek', 'koplok', 'asu', 'bajingan', 'tolol', 'gblg', 'goblok', 'anj', 'ilham']
    var sumon = ['bot', 'aex', 'bot mana', 'bot wa', 'wa bot']

    if (sumon.includes(args.join(' ')) != false) return client2.reply(from, '_iyah aex disini kak, mending ketik .menu_')
    if (kasar.includes(args.join(' ')) != false) return cluent2.reply(from, '_shut jangan bicara kasar_')
    if (salam.includes(args.join(' ')) != false) return client2.reply(from, '_waalaikumsalam_')

    switch (argv) {
       case 'stiker_add':
           if ((isMedia || isQuotedSticker) && args.length >= 0) {
               if (!args.join` `) return client2.reply(from, 'input a file name.')
               !fs.existsSync(`clouds/${id.split(/@/)[0]}`) ? fs.mkdirSync(`clouds/${id.split(/@/)[0]}`) : false

               var mediaEncrypt = JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo
               var mediaFinalys = await client.downloadAndSaveMediaMessage(mediaEncrypt, `${args.join(' ')}`)
               var extension = `\'${args.join(' ')}.webp\'`

               client2.reply(from, `stiker berhasil disimpan: _${args.join(' ')}_`)

               setTimeout(() => {
                    exec(`mv ${extension} clouds/${id.split(/@/)[0]}`, (err, stderr, stdout) => {
                        if (err) return client2.reply(from, String(stderr))
                        console.log(`[ ${id} ] : STIKER MOVED`)
                    })
               }, 2000)
           }
           break
       case 'stiker_del':
           !fs.existsSync(`clouds/${id.split(/@/)[0]}`) ? client2.reply(from, `ketik dan quoted stiker dengan command .stiker_add *nama stiker* untuk menambahkan stiker pertama kamu!`) : false
           var list = fs.readdirSync(`clouds/${id.split(/@/)[0]}`)

           function deleted() {
               setTimeout(() => {
                   fs.unlinkSync(`clouds/${id.split(/@/)[0]}/${args.join(' ')}.webp`)
                   client2.reply(from, `_stiker ${args.join(' ')} telah dihapus_`)
               }, 1000)
           }

           !list.includes(`${args.join(' ')}.webp`) ? client2.reply(from, `sayangnya file tidak ditemukan di cloud kamu.`) : deleted()
           break
       case 'stiker_get':
           !fs.existsSync(`clouds/${id.split(/@/)[0]}`) ? client2.reply(from, `ketik dan quoted stiker dengan command .stiker_add *nama stiker* untuk menambahkan stiker pertama kamu!`) : false
           var list = fs.readdirSync(`clouds/${id.split(/@/)[0]}`)

           function geting() {
               setTimeout(() => {
                   client.sendMessage(from, fs.readFileSync(`clouds/${id.split(/@/)[0]}/${args.join(' ')}.webp`), sticker, { quoted: m })
               }, 500)
           }

           !list.includes(`${args.join(' ')}.webp`) ? client2.reply(from, `sayangnya file tidak ditemukan di cloud kamu.`) : geting()
           break
       case 'stiker_':
           !fs.existsSync(`clouds/${id.split(/@/)[0]}`) ? client2.reply(from, `ketik dan quoted stiker dengan command .stiker_add *nama stiker* untuk menambahkan stiker pertama kamu!`) : false
           var list = fs.readdirSync(`clouds/${id.split(/@/)[0]}`)

           var result   = list.sort()
           var tampung  = []
           var tampung_ = `CLOUD STORAGE STIKER KAMU *${list.length}* FILE:\n\n`

           var index = 1

           result.map(tam => tampung.push(tam.replace(/\.webp/, '')) )

           tampung.map(data => {
               tampung_ += `*${index++}*. ${data}\n`
           })

           client2.reply(from, tampung_)
           break
       case 'ui':
           client2.reply(from, args.join` `)
       case 'solve':
           var tagMessage = await client.loadMessage(from, m.message.extendedTextMessage.contextInfo.stanzaId)
           if (/^Berapa hasil dari/i.test(m.message.extendedTextMessage.contextInfo.quotedMessage.conversation)) {
               var answer = m.message.extendedTextMessage.contextInfo.quotedMessage.conversation.split(/\?/g)[0].match(/\d|\-|\+|\//g).join``
               client.sendMessage(from, `${eval(answer)}`, text, { quoted: tagMessage })
               console.log(answer + ': ' + `${eval(answer)}`)
               console.log(toJSON(tagMessage))
           }
           break
       case 'swm':
           if ((isMedia || isQuotedImage || isQuotedSticker) && args.length >= 2) {
               if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
               if (isUserLimit) return client2.reply(from, logging.isUserLimit)

               await updateLimit(id)
               await updateXPUser(id, 1)
               var mediaEncrypt = JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo
               var mediaFinalys = await client.downloadAndSaveMediaMessage(mediaEncrypt, 'dlstikerwm')

               var packageName   = args[0]
               var packageAuthor = args[1]

               var exifName = 'stikerwm.exif',
                   webpName = `${id.split(/@/)[0]}.webp`

               try {
                   exec(`cwebp -q 50 dlstikerwm.jpeg -o ${webpName}`, (err, stderr, stdout) => {
                       if (err) return client2.reply(from, String(stderr))
                           stickerWm(webpName, packageName, packageAuthor)
                   })
               } catch (e) {
                   throw e
               }
           }
           break
       case 'sticker':
           if ((isMedia || isQuotedImage || isQuotedSticker) && args.length >= 0) {
               if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
               if (isUserLimit) return client2.reply(from, logging.isUserLimit)

               await updateLimit(id)
               await updateXPUser(id, 1)
               var mediaEncrypt = JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo
               var mediaFinalys = await client.downloadAndSaveMediaMessage(mediaEncrypt, 'dlstikerwm')

               var packageName   = 'aex-bot'
               var packageAuthor = '@isywl_'

               var exifName = 'stikerwm.exif',
                   webpName = `${id.split(/@/)[0]}.webp`

               try {
                   exec(`cwebp -q 50 dlstikerwm.jpeg -o ${webpName}`, (err, stderr, stdout) => {
                       if (err) return client2.reply(from, String(stderr))
                           stickerWm(webpName, packageName, packageAuthor)
                   })
               } catch (e) {
                   throw e
               }
           }
           break
        default:
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            break
    }
}

module.exports = UNITTESTING1
