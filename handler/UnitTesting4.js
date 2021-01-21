const moment = require("moment-timezone")
const fs = require("fs")
const ffmpeg = require('fluent-ffmpeg')
const imageToBase64 = require('image-to-base64')
const needle = require('needle')

var _ = require('lodash')
var canvas = require('canvacord')

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

const UNITTESTING4 = async (client, m) => {
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

    var isWellcome = isGroup ? await checkGroupUser(from) : false

    const client2 = {
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

    const randomHexs = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`
    const randomHex = `#${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')}`

    var pushtime = []
    pushtime = { time: `${moment().format('HH:mm:ss')}`, id: id}

    console.log(pushtime)

    switch (argv) {

        /**
         * TOOLS 1 PARAMETER API I-TECH
         */
        case 'jam':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('jam', 'kota', args.join(' '))
                .then(data => {
                    var { timezone, date, time, latitude: lat, longitude: long } = data
                    var maps = 'https://www.google.com/maps/@' + lat + ',' + long
                    var result = `j a M Lo o k u P (${args.join(' ')})\n\nTimezone: *${timezone}*\nDate: *${date}* [${time}]\n\nLatitude: ${lat}\nLongtitude: ${long}\n\nGoogle Maps Link: ${maps}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'cuaca':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('cuaca', 'kota', args.join(' '))
                .then(data => {
                    var { tempat, cuaca, deskripsi, suhu, kelembapan, udara, angin } = data
                    var result = `Cuaca daerah *{tempat}*\n\nCuaca: ${cuaca} (${deskripsi})\nSuhu: ${suhu}\nKelembapan: ${kelembapan}\n\nUdara: ${udara}\nAngin: ${angin}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'chord':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('chord', 'query', args.join(' '))
                .then(data => {
                    var { result: chord } = data
                    var result = `Chord Lagu *${args.join(' ')}*\n\n${chord}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'hilih':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('hilih', 'kata', args.join(' '))
                .then(data => {
                    var { result: hilih } = data
                    var result = `${hilih}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'alay':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('alay', 'kata', args.join(' '))
                .then(data => {
                    var { result: alay } = data
                    var result = `${alay}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'ninja':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('ninja', 'kata', args.join(' '))
                .then(data => {
                    var { result: ninja } = data
                    var result = `${ninja}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'cool':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('cool', 'text', args.join(' '))
                .then(data => {
                    var { result: cool } = data
                    var result = `Cool Text: *${args.join(' ')}*${copyright}`
                    imageToBase64(cool)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(from, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'fire':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            var imageFire = await client.downloadAndSaveMediaMessage(m)
            var datas = fs.readFileSync('./' + imageFire, 'base64')
            imgBB(datas)
                .then(uri => {
                     AexBot.toolsParam1('picfire', 'pic', uri)
                        .then(data => {
                            var { result: fire } = data
                            var result = `Fired!..${copyright}`
                            imageToBase64(fire)
                                .then(_data => {
                                     var buffer = Buffer.from(_data, 'base64')
                                     client.sendMessage(from, buffer, MessageType.image, { quoted: m, caption: result, mimetype: Mimetype.gif })
                                 })
                        })
                        .catch(err => {
                             console.log(err)
                             console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                     })
                })
            break
        case 'nama':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            var gender = {'cewe': 'female', 'perempuan': 'female', 'cowo': 'male', 'laki-laki': 'male'}
            AexBot.toolsParam1('nama', 'gender', gender[args.join(' ')])
                .then(data => {
                    var { result: nama } = data
                    var result = `Random N a M a *${args.join(' ')}*\n\nHasil: *${nama}*${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'lirik':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('lirik', 'query', args.join(' '))
                .then(data => {
                    var { result: lirik } = data
                    var result = `\`\`\`Lirik Lagu\`\`\` *${args.join(' ')}*\n\n${lirik}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'sholat':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('sholat', 'kota', args.join(' '))
                .then(data => {
                    var { status } = data
                    if (status === 'error') { client.sendMessage(from, `nama kota *${args.join(' ')}* tidak ditemukan.`) }
                    var { imsak, subuh, dhuha, dzuhur, ashar, isya, maghrib, tanggal, note } = data
                    var result = `Jadwal Sholat Kota *${args.join(' ')}*\n\nImsak: ${imsak}\nSubuh: ${subuh}\nDzuhur: ${dzuhur}\nAshar: ${ashar}\nMaghrib: ${maghrib}\nIsya: ${isya}\n\n_${note}_${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'short':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('shorturl', 'link', args.join(' '))
                .then(data => {
                    var { result: url } = data
                    var result = `original url: *${args.join(' ')}*\nshort url: *${url}*${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'ss':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('ssweb', 'link', args.join(' '))
                .then(data => {
                    var { result: ss } = data
                    var result = `screenshot dari web: *${args.join(' ')}*${copyright}`
                    imageToBase64(ss)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(from, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'icfind':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('icon', 'query', args.join(' '))
                .then(data => {
                    var { status } = data
                    if (status === 'error') { client.sendMessage(from, `Icon *${args.join(' ')}* tidak ditemukan.`) }
                    var { result: icon } = data
                    let response = `List icon *${args.join(' ')}*:\n\n`
                    let index = 1
                    icon.map(({ title, author, image }) => {
                        response += `*${index++}*. ${title} ( _*${author}*_ )\nLink: ${image}\n\n`
                    })
                    var result = `${response}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'quran':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            if (args.join(' ') >= 114) { client.sendMessage(from, 'nomor surat hanya sampai 114.') }
            AexBot.toolsParam1('quran', 'surat', args.join(' '))
                .then(data => {
                    var { result: surat } = data
                    let response = `Al-Qur\'an Surat ke - *${args.join(' ')}*:\n\n`
                    let index = 1
                    surat.map(({ ar, id }) => {
                        response += `*${index++}*. ${ar}\n\n${id}\n\n`
                    })
                    var result = `${response}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'fact':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('fact', 'animal', args.join(' '))
                .then(data => {
                    var { result: fact } = data
                    var result = `animal fact: *${args.join(' ')}*\n\n _${fact}_${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'qr':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('qr', 'query', args.join(' '))
                .then(data => {
                    var { result: qr } = data
                    var result = `*QR CODE MAKER*\n\nstatus: berhasil!\ntext: _${args.join(' ')}_ ${copyright}`
                    imageToBase64(qr)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(from, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'brainly':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            brainlySearch(args.join(' '))
               .then(data => {
                   client.sendMessage(from, data, MessageType.text, { quoted: m })
               })
               .catch(err => {
                   client.sendMessage(from, err, MessageType.text)
               })
            break
        case 'wiki':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('wiki', 'query', args.join(' '))
                .then(data => {
                    var { result: wiki } = data
                    var result = `pencarian ${args.join(' ')}:berdasarkan data wikipedia:\n\n ${wiki}${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'umur':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            AexBot.toolsParam1('umur', 'nama', args.join(' '))
                .then(data => {
                    var { umur } = data
                    var result = `sepertinya umur *${args.join(' ')}* ${umur} tahun? 🤔 ${copyright}`
                    client.sendMessage(from, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'nulis':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            nulis(args.join(' '))
                .then(data => {
                    var result = `*Berhasil menulis!* ${copyright}`
                    let index = 1
                    data.map(link => {
                        imageToBase64(link)
                            .then(_data => {
                                var buffer = Buffer.from(_data, 'base64')
                                client.sendMessage(from, buffer, MessageType.image, { quoted: m, caption: `Lembar ke *${index++}* dari total lembar: ${data.length}\n\n` + result })
                            })
                    })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        default:
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            break
    }
}

module.exports = UNITTESTING4
