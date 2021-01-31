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

const UNITTESTING = async (client, m) => {
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
       case 'statapi':
           if (!isOwner) return client2.reply(from, logging.isNotOwner)
           AexBot.downloader('pornhub', 'link', 'https://www.pornhub.com/view_video.php\?viewkey\=ph5f92b1f567ac2')
              .then(data => {
                  if (data.code != 200) {
                      let { pesan: ip } = data
                      grepIp = ip.match(/\d|\./g).join('')
                      let tutor = `WARN: IP BELUM TERKONEKSI!\n\n1. Masuk ke web: https://api.i-tech.id/login\n2. Masukan username *ibnusyawall* dan password ~silahkan minta ke kontak owner~\n3. Klik ikon profile, klik profile, cari menu *ip static* dan klik\n4. Masukan ip: *${grepIp}* dan kolom ip lainnya kosongkan, lalu masukan password yang sebelumnya dan klik *simpan*\n5. Bila sudah tersimpan, silahkan jalankan bot ulang, dan test dengan command *.statapi*\n\n_${moment().format('HH.mm')} | @isywl_`
                      client2.reply(from, tutor)
                  } else {
                      client2.reply(from, '[ √ ] IP CONNECTED!')
                  }
              })
              .catch(err => {
                  client2.reply(from, toJSON(err))
              })
           break
       case 'reset':
           if (!isOwner) return client2.reply(from, logging.isNotOwner)
           updateResetLimit(args.join(' '))
               .then(data => {
                   client2.reply(from, `Limit user berhasil di reset: *${args.join(' ')}* limit\n\n_${moment().format('DD/MM/YYYY HH.mm')}_`)
               })
               .catch(err => {
                  client2.reply(from, 'error')
               })
           break
       case 'ping':
           client2.reply(from, `🏓 pong! | speed: ${istimer(m.messageTimestamp)}ms`)
           break
       case 'cpu':
           var format = {
               ram: {
                   total: formatBytes(require('os').totalmem()),
                   free: formatBytes(require('os').freemem())
               },
               system: {
                   version: require('os').version(),
                   hostname: require('os').hostname(),
                   arch: require('os').arch(),
                   user: require('os').userInfo().username
               },
               uptime: getTimeProcess(process.uptime())
           }
           client2.reply(from, JSON.stringify(format, null, '\t'))
           break

        case 'premi':
            switch (args[0]) {
                case 'add':
                    if (isOwner) {
                        var user = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
                        var expired = moment().add(30, 'day')
                        insertPremiumUser(user, client2.getName(user), expired, 1000, 'advanced', 100)
                            .then(data => {
                                 var card = `\`\`\`anjas premium lo! nomor lo berhasil di daftarin nih!\n\nUSERNAME: _${client2.getName(user)}_\nNOMOR: ${user.split(/@/)[0]}\nLEVEL: Advanced\nLIMIT: 1000\nXP: 100\nID: ${data._id}\n\nEXPIRED: ${expired.format('DD/MM/YYYY HH:mm')} (30 DAY)\`\`\``
                                 client2.reply(from, card)
                            })
                    } else {
                        client2.reply(from, logging.isNotOwner)
                    }
                    break
                case 'remove':
                    if (id === owner) {

                    } else {

                    }
                    break
                case 'reset':
                    if (id === owner) {

                    } else {

                    }
                    break
                default:
                    
                    break
            }
            break
        case 'register':
            if (isDaftar) return client2.reply(from, logging.isSudahDaftar)
            insertUser(id, client2.getName(id), 50, 'begginer', 100)
               .then(res => {
                   var card = `\`\`\`thats right! nomor lo berhasil di daftarin men!\n\nUSERNAME: _${client2.getName(id)}_\nNOMOR: ${id.split(/@/)[0]}\nLEVEL: Begginer\nLIMIT: 50\nXP: 100\nID: ${res._id}\`\`\``
                   client2.reply(from, card)
               })
               .catch(err => {
                   console.log(err)
               })
            client2.sendTtpAsSticker(from, args.join` `)
            break
        case 'testing':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)

            await updateLimit(id)
            await updateXPUser(id, 1)

            await client2.reply(from, 'oke kamu terdaftar!')
            break
        case 'daftarpremium':
            client2.sendTtpAsSticker(from, 'dalam tahap pengembangan!')
            break

        // premium
        case 'pitul':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)
            if (!isPremium) return client2.reply(from, 'fitur khusus member premium!')

            client2.reply(from, 'sip kamu sudah premium')
            break
        case 'return':
            try {
                if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
                if (isUserLimit) return client2.reply(from, logging.isUserLimit)

                await updateLimit(id)
                await updateXPUser(id, 1)
                await client2.reply(from, JSON.stringify(eval(args.join(' ')), null, '\t'))
            } catch (e) {
                await client2.reply(from, String(e))
            }
            break
        case 'eval':
            if (isOwner) {
                return eval(args.join(' '))
            } else {
                return client2.reply(from, logging.isNotOwner)
            }
            break
        case 'img2url':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            var encmedia  = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo : m
            var media = await client.downloadAndSaveMediaMessage(encmedia)

            imgbb(process.env.imgbb, media)
                .then(data => {
                    imageToBase64(data.display_url)
                       .then(foto => {
                           var buffer = Buffer.from(foto, 'base64')
                           var caps = `\`\`\`Image To URL\`\`\`\n\nID: ${data.id}\nMimeType: ${data.image.mime}\nExtension: ${data.image.extension}\n\nURL: ${data.display_url}`
                           client.sendMessage(from, buffer, image, { quoted: m, caption: caps })
                        })
                })
                .catch(err => {
                    throw err
                })
            break
        case 'menu':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            var user = await usersInfo(id)
            var limituser = user != false ? ((user.details.limit < 0) ? 0 : user.details.limit) : 0
            var limitgame = user != false ? ((user.details.games < 0) ? 0 : user.details.games) : 0
            var limitxp = user != false ? ((user.details.xp < 0) ? 0 : user.details.xp) : 0
            listMenu(client2.getName(id), limituser, limitgame, limitxp, user.role)
                .then(data => {
                    client.sendMessage(from, data, text, { quoted: m, detectLinks: true })
                })
            break
        case 'lapor':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            client2.reply(from, 'laporan berhasil dikirim!')
            client2.sendText(owner, `Laporan dari: *${client2.getName(id)}*\n\nID: ${id.split('@')[0]}\n\n_${args.join(' ')}_`)
            break
        case 'help':
            client2.reply(from, 'wayoloh')
            break
        case 'shell':
            if (isOwner) {
                exec(args.join(' '), (err, stdout) => {
                    if (err) client2.reply(from, err)
                    client2.reply(from, `root@localheart: ${process.cwd().replace('/data/data/com.termux/files/home/', '~/')} *»* ${args.join(' ')}\n${stdout}`)
                })
            } else {
                client2.reply(from, logging.isNotOwner)
            }
            break
        case 't':
            var options = {
                contextInfo: { forwardingScore: 1, isForwarded: true }
            }
            await client.sendMessage(from, args.join(' '), text, options)
            break
        case 'readview':
            if (isQuotedMessage && isGroup) {
                if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
                if (isUserLimit) return client2.reply(from, logging.isUserLimit)

                await updateLimit(id)
                await updateXPUser(id, 1)
                var idMessage = m.message.extendedTextMessage.contextInfo.stanzaId || ''

                var stat = await client.loadMessage(from, m.message.extendedTextMessage.contextInfo.stanzaId)

                var who = await client.messageInfo(from, idMessage)

                var ids1 = []
                var msg1 = `ID MESSAGE: *${idMessage}*\n\n\`\`\`WHO READS: ${who.reads.length}\`\`\`\n\n`
                var index1 = 1

                var ids2 = []
                var msg2 = `\n\n\`\`\`WHO UN-READ: ${who.deliveries.length}\`\`\`\n\n`
                var index2 = 1

                who.reads.map(({ jid, t }) => {
                    ids1.push(jid)
                    msg1 += `${index1++}. @${jid.split(/@/)[0]} : ${tm(t)}\n`
                })

                who.deliveries.map(({ jid, t }) => {
                    ids2.push(jid)
                    msg2 += `${index2++}. @${jid.split(/@/)[0]} : ${tm(t)}\n`
                })

                client.sendMessage(from, `${msg1}${msg2}`, text, { contextInfo: { mentionedJid: [...ids1, ...ids2] }, quoted: m })
            }
            break
        case 'list':
            switch(args[0]) {
                case 'group':
                    var chat   = await client.chats.all()
                    var cgroup = chat.filter(stat => stat.jid.endsWith('@g.us'))

                    var msg = `Total Group: ${cgroup.length}\n\n`
                    var ind = 1

                    cgroup.sortBy('count').map(({ count, name }) => {
                        msg += `*${ind++}*. ${name} [ ${count} chat ]\n`
                    })

                    client2.reply(from, msg)
                    break
                case 'chat':
                    var chat   = await client.chats.all()
                    var cchat  = chat.filter(stat => stat.jid.endsWith('@s.whatsapp.net'))

                    var msg = `Total Chat Pribadi: ${cchat.length}\n\n`
                    var ind = 1

                    cchat.map(({ count, jid }) => {
                        msg += `*${ind++}*. ${jid.split(/@/)[0]} [ ${count} chat ]\n`
                    })

                    client2.reply(from, msg)
                    break
                case 'user':
                    usersInfoAll().then(data => {
                        var premi = data.filter(data => data.role === 'premium').length
                        var none  = data.filter(data => data.role === 'none').length

                        var capts = `\`\`\`LIST PENGGUNA AEX-BOT YANG TELAH TERDAFTAR\`\`\`\n\nTOTAL: *${data.length}*\n\n\`\`\`PREMIUM\`\`\` : *${premi}*\n\`\`\`NONE\`\`\` : *${none}*\n\n_${moment().format('DD/MM/YYYY (HH.mm)')}_`
                        var index = 1
                        client2.reply(from, capts)
                    })
                    break
                default:
                    break
            }
            break
        case 'leave':
            switch(args[0]) {
                case 'delay':
                    var admin = await isAdmin(id, from)

                    if (!admin) return client2.reply(from, logging.userIsNotAdmin)
                    if (!isGroup) return client2.reply(from, logging.isNotGroup)

                    await client2.reply(from, `aex akan keluar group dalam hitungan: *${args.join(' ')}* detik dari sekarang....`)

                    setTimeout( async () => {
                        await client.groupLeave(from)
                    }, Number(`${args.splice(1).join(' ')}000`))
                break
                case 'all':
                    var isowner = id === owner

                    if (!owner) return client2.reply(from, logging.isNotOwner)

                    var chat   = await client.chats.all()
                    var cgroup = chat.filter(stat => stat.jid.endsWith('@g.us'))

                    var msg = `aex bot sedang melakukan uji coba *leave all group* , invite kembali aex jika dibutuhkan, bye 👋🏻\n\n*https://chat.whatsapp.com/HtrGfYgAz9iFxUaowKo2tf*`

                    var ids = []

                    cgroup.map(({ jid }) => {
                        ids.push(jid)
                    })

                    var loop = (i) => {
                        if (ids[i]) {
                             client2.reply(ids[i], `halo *${name}*!\n\n${msg}`)

                             setTimeout( async () => {
                                  await client.groupLeave(jid)
                             }, Number(`${args.splice(1).join(' ')}000`))
                             setTimeout(() => {
                                  loop(i + 1)
                             }, 4000)
                        }
                    }
                    loop(0)
                break
                default:
                break
            }
            break
        case 'me':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            var vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${client2.getName(id)}\nORG:KONTAK SAYA;\nitem1.TEL;type=CELL;type=VOICE;waid=${id.split(/@/)[0]}:+${id.split(/@/)[0]}\nitem1.X-ABLabel:Ponsel\nX-WA-BIZ-NAME:${client2.getName(id)}\nEND:VCARD`
            var kirim = await client.sendMessage(from, { displayName: client2.getName(id), vcard: vcard, quoted: m }, contact)
            await client.sendMessage(from, `NAMA: *${client2.getName(id)}*\nNOMOR: @${id.split(/@/)[0]}\nCHAT LINK: wa.me/${id.split(/@/)[0]}`, text, { quoted: kirim, contextInfo: { mentionedJid: [id] } })
            break
        case 'owner':
            var vcard2 = "BEGIN:VCARD\nVERSION:3.0\nN:;Ibnusyawall;;;\nFN:Ibnusyawall\nORG:OWNER AEXBOT\nTITLE:\nitem1.TEL;waid=6282299265151:+62 822-9926-5151\nitem1.X-ABLabel:Ponsel\nX-WA-BIZ-NAME:Ibnusyawall\nEND:VCARD"
            var vcard = 'BEGIN:VCARD\n' // metadata of the contact card
                      + 'VERSION:3.0\n' 
                      + 'FN:Ibnusyawall\n' // full name
                      + 'ORG:OWNER AEXBOT;\n' // the organization of the contact
                      + 'item1.TEL;type=CELL;type=VOICE;waid=6282299265151:+62 822-9926-5151\n' // WhatsApp ID + phone number
                      + 'item1.X-ABLabel:Ponsel\n'
                      + 'X-WA-BIZ-NAME:Ibnusyawall\n'
                      + 'END:VCARD'
            var kirim = await client.sendMessage(from, { displayName: 'Ibnusyawall', vcard: vcard, quoted: m }, contact)
            await client.sendMessage(from, 'untuk bantuan lebih lanjut atau sekedar ingin berteman bisa chat kontak tsb yah kak^^.', text, { quoted: kirim })
            break
        case 'simulate':
            switch (args[0]) {
                case 'typing':
                    await client.updatePresence(from, Presence.composing)
                    break
                case 'recording':
                    await client.updatePresence(from, Presence.recording)
                    break
                case 'stop':
                    await client.updatePresence(from, Presence.paused)
                    break
                default:
                    break
            }
            break
        case 'delall':
            var get = await client.chats.get(from)

            console.log(get.messages)
        case 'del':
            var admin     = await isAdmin(id, from)

            if (!admin) return client2.reply(from, logging.userIsNotAdmin)

            if ((id === owner || admin) && isFromBot) {
                await client.deleteMessage(from, { id: m.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
            } else if (!isGroup && isFromBot) {
                //
            }
            break
        case 'fitnah':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            var split = args.join(' ').replace(/@|\d/gi, '').split('|')
            var taged = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
            var options = {
                contextInfo: {
                    participant: taged,
                    quotedMessage: {
                        extendedTextMessage: {
                            text: split[0]
                        }
                    }
                }
            }
            client.sendMessage(from, `${split[1]}`, MessageType.text, options)
            break
        case 'exec':
            switch(args[0]) {
                case 'js':
                    if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
                    if (isUserLimit) return client2.reply(from, logging.isUserLimit)

                    await updateLimit(id)
                    await updateXPUser(id, 1)
                    var withOption = isQuotedMessage ? m.message.extendedTextMessage.contextInfo.quotedMessage.conversation.replace(/\n/gi, ';') : args.splice(1).join(' ').replace(/\n/gi, ';')
                    var data = spawnSync('node', ['-e', withOption]).stdout.toString('utf-8')
                    client2.reply(from, `*CODE EXECUTER*: NODEJS\n\nOUTPUT:\n\n\`\`\`${data}\`\`\`${copyright}`)
                    break
                default:
                    break
            }
            break
        case 'gclink':
            if (!isGroup) return client2.reply(from, logging.isNotGroup)

            var botAdmin  = await isBotAdmin(isBot, from)
            if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)

            var link = await client.groupInviteCode(from)
            var isLinkGC = `Link 👉🏻: *https://chat.whatsapp.com/${link}*`
            client2.reply(from, `Link Group: *${groupMetadata.subject}*\n\n${isLinkGC}`)
            break
        case 'setgc':
            switch (args[0]) {
               case 'wellcome':
                   switch (args[1]) {
                       case 'status':
                           switch (args[2]) {
                               case 'on':
                                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                                   var admin     = await isAdmin(id, from)
                                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)
                                   if (!isWellcome) await insertGroup(from, 'on')
                                   if (isWellcome) await updateGroupStatus(from, 'on')

                                   client2.reply(from, 'sambutan group telah di aktifkan di group ini.')
                                   break
                               case 'off':
                                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                                   var admin     = await isAdmin(id, from)
                                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)
                                   if (!isWellcome) return client2.reply(from, 'sambutan group belum diaktifkan, silahkan aktifkan terlebih dahulu.')
                                   
                                   if (isWellcome) await updateGroupStatus(from, 'off')
                                   client2.reply(from, 'sambutan group telah di non-aktifkan di group ini.')
                                   break
                               default:
                                   break
                           }
                           break
                       case 'message':
                           if (!isGroup) return client2.reply(from, logging.isNotGroup)
                           var admin     = await isAdmin(id, from)
                           if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                           if (!isWellcome) return client2.reply(from, 'sambutan group belum diaktifkan, silahkan aktifkan terlebih dahulu.')
                           
                           if (isWellcome) await updateGroupMessage(from, args.splice(2).join` `)
                           client2.reply(from, 'pesan kata sambutan group telah di aktifkan.')
                           break
                       default:
                           if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
                           if (isUserLimit) return client2.reply(from, logging.isUserLimit)

                           await updateLimit(id)
                           await updateXPUser(id, 1)
                           var infoGC = isWellcome ? await usersGroupInfo(from) : false
                           var capts = `WELLCOME MESSAGE BOT | *aex-bot*\n\nID: ${from}\nSTATUS: ${isWellcome ? '_Group telah mengaktifkan fitur ini._' : '_Group belum mengaktifkan fitur ini._'}\nSWITCH: ${isWellcome ? infoGC.status.toUpperCase() : '-'}\nCUSTOM MESSAGE: ${isWellcome ? ((infoGC.message.length <= 0) ? 'FALSE' : 'TRUE') : '-'}`
                           if (!isGroup) return client2.reply(from, logging.isNotGroup)
                           client2.reply(from, capts)
                           break
                   }
                   break
               case 'add':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)

                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   
                   break
               case 'kick':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)

                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   await client.groupRemove(from, [m.message.extendedTextMessage.contextInfo.participant])
                   break
               case 'promote':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)

                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   var taged = m.message.extendedTextMessage.contextInfo.mentionedJid[0]

                   var options = {
                       text: `@${taged.split("@s.whatsapp.net")[0]} kamu sekarang adalah admin!`,
                       contextInfo: { mentionedJid: [taged] }
                   }

                   client.sendMessage(from, options, MessageType.text)

                   client.groupMakeAdmin(from, [taged])
                   break
               case 'demote':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)

                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   var taged = m.message.extendedTextMessage.contextInfo.mentionedJid[0]

                   var options = {
                       text: `@${taged.split("@s.whatsapp.net")[0]} kamu sekarang bukan admin!`,
                       contextInfo: { mentionedJid: [taged] }
                   }

                   client.sendMessage(from, options, MessageType.text)

                   client2.demoteParticipant(from, [taged])
                   break
               case 'name':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)
                   //var nonOption = im
                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   client2.setSubject(from, args.splice(1).join(' '))
                   break
               case 'desc':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)
                   //var nonOption = im
                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   client2.setDescription(from, args.splice(1).join(' '))
                   break
               case 'pp':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)
                   var encmedia  = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo : m
                   var media = await client.downloadAndSaveMediaMessage(encmedia)

                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   client2.setGroupProfilePicture(from, media)
                   //client2.reply(from, pp)
                   break
               case 'open':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)
                   //var nonOption = im
                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   client2.setGroupToAdminsOnly(from, false)
                   break
               case 'close':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(isBot, from)
                   //var nonOption = im
                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   client2.setGroupToAdminsOnly(from, true)
                   break
               default:
                   break
            }
            break
        case 'bc':
            var encmedia = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo : m
            var buffer = await client.downloadMediaMessage(encmedia)
            if (isOwner) {
                  var chat = await client.chats.all()
                  var ids = []
                  var index = 1
                  chat.map(({ jid }) => {
                      ids.push(jid)
                  })
                  var loop = (i) => {
                      if (ids[i]) {
                           client.sendMessage(froms[i], buffer, image, { caption: args.join(' '), quoted: m })
                           setTimeout(() => {
                                loop(i + 1)
                           }, 4000)
                      }
                  }
                  loop(0)
                  await client2.sendText(from, `sukses custom broadcast ke *${chat.length}* chat! ( with random delay )`)
              } else {
                  client2.reply(from, logging.isNotOwner)
              }
            break
        case 'block':
            switch (args[0]) {
                case 'add':
                    if (id === owner) {
                        var what = args.join(' ').startsWith('0') ? a.replace(/08/, 628) : args.join(' ')

                        await client.blockUser(what + '@c.us', 'add')
                        client2.reply(from, 'nomor berhasil bot block: ${what}')
                    } else {
                        client2.reply(from, logging.isNotOwner)
                    }
                    break
                case 'remove':
                    if (id === owner) {
                        var what = args.join(' ').startsWith('0') ? a.replace(/08/, 628) : args.join(' ')

                        await client.blockUser(what + '@c.us', 'remove')
                        client2.reply(from, 'nomor berhasil bot un-block: ${what}')
                    } else {
                        client2.reply(from, logging.isNotOwner)
                    }
                    break
                case 'addTag':
                    if (id === owner) {
                        var what = isGroup ? m.message.extendedTextMessage.contextInfo.mentionedJid[0] : null

                        await client.blockUser(what + '@c.us', 'add')
                        client2.reply(from, 'nomor berhasil bot block: ${what.}')
                    } else {
                        client2.reply(from, logging.isNotOwner)
                    }
                    break
                case 'removeTag':
                    if (id === owner) {
                        var what = isGroup ? m.message.extendedTextMessage.contextInfo.mentionedJid[0] : null

                        await client.blockUser(what + '@c.us', 'remove')
                        client2.reply(from, 'nomor berhasil bot un-block: ${what}')
                    } else {
                        client2.reply(from, logging.isNotOwner)
                    }
                    break
                default:
                    break
            }
            break
        case 'toimg':
            if (!isQuotedSticker) return client2.reply(from, logging.isNotSticker)
            var encmedia = JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo
            var media = await client.downloadAndSaveMediaMessage(encmedia)
            var names = 'stiker.png'

            exec(`ffmpeg -i ${media} ${names}`, (err) => {
                //fs.unlinkSync(media)
                if (err) throw err
                //client2.sendImage(from, names, 'nih')
                var buffer = fs.readFileSync(names)
                console.log(buffer); client.sendMessage(from, buffer, image, {quoted: m, caption: 'nih'})
                //fs.unlinkSync(names)
            })
            break
        case 'readall':
            var result = await client.chats.all()
            if (isOwner) {
                result.map( async ({ jid }) => {
                    await client.chatRead(jid)
                })
                await client.sendMessage(from, `berhasil membaca semua pesan: ${result.length} pesan.`, MessageType.text, { quoted: m })
            } else {
                await client.sendMessage(from, 'kamu bukan owner!', MessageType.text, { quoted: m })
            }
            break
        case 'hidetag':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            var admin = await isAdmin(id, from)
            if (admin || isOwner) {
                var group  = await client.groupMetadata(from)
                var member = group['participants']
                var admin = member.filter(admin => admin.isAdmin === true)
                var ids = []
                var index = 1
                member.map( async adm => {
                    ids.push(adm.id.replace('c.us', 's.whatsapp.net'))
                })
                var options = {
                    text: args.join(' '),
                    contextInfo: { mentionedJid: ids },
                    quoted: m
                }
                await client.sendMessage(from, options, MessageType.text)
            } else {
                client.sendMessage(from, 'kamu bukan admin!', MessageType.text, { quoted: m })
            }
            break
        case 'tagall':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            var admin = await isAdmin(id, from)
            if (!admin) return client2.reply(from, logging.userIsNotAdmin)

            var group  = await client.groupMetadata(id)
            var member = group['participants']
            var ids = []
            var msg = `\`\`\`TAG ALL NIH\`\`\` ( *${member.length}* orang. )\n\n`
            var index = 1
            member.map( async (uye) => {
                msg += `${index++}. @${uye.id.split('@')[0]}\n`
                ids.push(uye.id.replace('c.us', 's.whatsapp.net'))
            })
            console.log(JSON.stringify(group, null, '\t'))
            const _options = {
                text: msg,
                contextInfo: { mentionedJid: ids }
            }
            await client.sendMessage(from, _options, MessageType.text)
            break
        case 'spadmin':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            if (isUserLimit) return client2.reply(from, logging.isUserLimit)

            await updateLimit(id)
            await updateXPUser(id, 1)
            var admin = await isAdmin(id, from)
            if (!admin) return client2.reply(from, logging.userIsNotAdmin)

            var group  = await client.groupMetadata(id)
            var member = group['participants']
            var admin = member.filter(admin => admin.isAdmin === true)
            var ids = []
            var msg = `\`\`\`ADMIN GC ${group.subject}\`\`\` ( *${admin.length}* orang. )\n\n`
            var index = 1
            admin.map( async adm => {
                msg += `${index++}. @${adm.id.split('@')[0]}\n`
                ids.push(adm.id.replace('c.us', 's.whatsapp.net'))
            })
            var options = {
                text: msg,
                contextInfo: { mentionedJid: ids },
                quoted: m
            }
            await client.sendMessage(from, options, MessageType.text)
            break
        case 'tagme':
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            var options = {
                text: `@${id.split("@s.whatsapp.net")[0]} tagged!`,
                contextInfo: { mentionedJid: [id] }
            }
            client.sendMessage(from, options, MessageType.text)
            break
        case 'tree':
            Archy()
               .then(data => {
                   var data = `*s* T r U k t U R c 0 d s\n\n${data}${copyright}`
                   client.sendMessage(from, data, MessageType.text, { quoted: m })
               })
            break
        default:
            if (!isDaftar) await insertUser(id, client2.getName(id), 50, 'begginer', 70, 20)
            break
    }
}

module.exports = UNITTESTING
