const moment = require("moment-timezone")
const fs = require("fs")
const ffmpeg = require('fluent-ffmpeg')
const imageToBase64 = require('image-to-base64')
const needle = require('needle')

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
  updateLimitUser
} = require(process.cwd() + '/database/index')

const { exec, spawnSync } = require("child_process")
const textPorn = require(process.cwd() + '/lib/textporn')
const Archy = require(process.cwd() + '/lib/menu/Archy')
const imgBB = require(process.cwd() + '/lib/menu/imgBB')
const listMenu = require(process.cwd() + '/lib/menu/listMenu.js')
const imgbb = require('imgbb-uploader')

const copyright = '\n\n----    ----\n*©aex-bot copyright | science 2019-2020*'

prefix = '.'

Array.prototype.sortBy = function(p) {
  return this.slice(0).sort(function(a,b) {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
}

const CUSTOMHANDLER = async (client, m) => {
    global.prefix

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
    var tj = tj => JSON.stringify(tj, null, '\t')
    var tm = ts => moment(new Date(parseInt(ts) * 1000)).fromNow()
    //var toJSON = t => JSON.stringify(t, null, '\t') || ''

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
    const isCmd = body.startsWith(prefix)

    const nomorbot = client.user.jid
    const ownerNumber = ["6285892766102@s.whatsapp.net"] // replace this with your number
    const isGroup = from.endsWith('@g.us')
    const id = isGroup ? m.participant : m.key.remoteJid
    const owner = '6282299265151@s.whatsapp.net'
    const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const groupId = isGroup ? groupMetadata.jid : ''
    //const groupMembers = isGroup ? groupMetadata.participants : ''
    //const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
    //const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
    //const isGroupAdmins = groupAdmins.includes(sender) || false
    //const isWelkom = isGroup ? welkom.includes(from) : false
    //const isNsfw = isGroup ? nsfw.includes(from) : false
    //const isSimi = isGroup ? samih.includes(from) : false
    //const isOwner = ownerNumber.includes(sender)
    const isMedia = (type === 'imageMessage' || type === 'videoMessage' || type === 'audioMessage')
    const isQuotedImage   = type === 'extendedTextMessage' && content.includes('imageMessage')
    const isQuotedVideo   = type === 'extendedTextMessage' && content.includes('videoMessage')
    const isQuotedAudio   = type === 'extendedTextMessage' && content.includes('audioMessage')
    const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
    const isQuotedMessage   = type === 'extendedTextMessage' && content.includes('conversation')

    const fromBot   = isQuotedMessage ? m.message.extendedTextMessage.contextInfo.participant : null
    const isFromBot = fromBot != null ? fromBot === nomorbot : false

    const client2 = {
        getName: function(i) {
            var v = client.contacts[i] || { notify: i.replace(/@.+/, '') }
            return v.name || v.vname || v.notify
        },
        forwardMessage: function(f, t, type) {
            var options = {
                contextInfo: { forwardingScore: 127, isForwarded: true }
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
             //       client.sendMessage(f, data, text, { quoted: id })
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
        isNotOwner: 'Command khusus owner bot!'
    }

    switch (argv) {
        case 'kick':
            var admin = await isAdmin(id, from)

            if (!admin) return client2.reply(from, logging.userIsNotAdmin)
            if (!isGroup) return client2.reply(from, logging.isNotGroup)

            await client.groupRemove(from, [m.message.extendedTextMessage.contextInfo.participant])
            break
        case 'ttp':
            client2.sendTtpAsSticker(from, args.join` `)
            break
        case 'chat':
            if (m.message.extendedTextMessage) {
                var ghost = m.message.extendedTextMessage.contextInfo.mentionedJid[0] || from
                client2.sendText(ghost, args.splice(1).join(' ') + `\n\nChat Dari: *${from}*`)
                await client.sendMessage(from, `pesan behasil dikirim ke @${ghost.split(/@/)[0]}`, text, { quoted: m, contextInfo: { mentionedJid: [ghost] } })
            }
            break
        case 'pushname':
            var options = {
                contextInfo: { mentionedJid: [id] }
            }
            await client.sendMessage(from, `pushname: *${client2.getName(id)}* | @${id.split(/@/)[0]}`, text, options)
            break
        case 'st':
          client2.sendStickerfromUrl(from, args.join(' '), id)
          break
        case 'return':
            try {
                await client2.reply(from, JSON.stringify(eval(args.join(' ')), null, '\t'))
            } catch (e) {
                await client2.reply(from, String(e))
            }
            break
        case 'eval':
            var isowner = id === owner

            if (isowner) {
                return eval(args.join(' '))
            } else {
                return client2.reply(from, logging.isNotOwner)
            }
            break
        case 'g':
            var y = await client.getBroadcastListInfo("1609227892@broadcast")
            client2.reply(from, `${JSON.stringify(y, null, '\t')}`)
            break
        case 'pp2url':
            ghost = m.message.extendedTextMessage.contextInfo.mentionedJid[0] || id
            pp = await client.getProfilePicture(ghost)

            imageToBase64(JSON.stringify(pp).replace(/\"/gi, ''))
                .then(data => {
                    fs.writeFileSync('getpp.jpeg', data, 'base64')
                    imgbb(process.env.imgbb, 'getpp.jpeg')
                        .then(res => {
                             var buffer = Buffer.from(data, 'base64')
                             var capts  = `\`\`\`PROFILE PICTURE URL FROM @${ghost.split(/@/)[0]}\n\n${res.display_url}\`\`\`${copyright}`
                             client.sendMessage(from, buffer, image, { quoted: m, caption: capts, contextInfo: { mentionedJid: [ghost] } })
                         })
                })
            break
        case 'img2url':
            var encmedia  = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo : m
            var media = await client.downloadAndSaveMediaMessage(encmedia)
            //client2.reply(from, String(media))
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
        case 'u':
            var chat = await client.chats.get(args.join(' '))

            
//            var pushname = client.chats.get(m.participant) === undefined ? (client.contacts[m.key.remoteJid] ? client.contacts[m.key.remoteJid].notify : "Tanpa Nama") : (client.contacts[m.participant].notify ? client.contacts[m.participant].notify : "Tanpa Nama")
            //var user = await client.chats.get(id).notify
            //var uset = await client.contacts(id).notify

            client2.reply(from, `${tj(chat)}`)
            break
        case 'menu':
            listMenu(client2.getName(id), getTimeProcess(proses))
                .then(data => {
                    client2.reply(from, data)
                })
            break
        case 'lapor':
            client2.reply(id, 'laporan berhasil dikirim!')
            client2.sendText(owner, `Laporan dari: *${nama}*\n\nID: ${id.split('@')[0]}\n\n_${args.join(' ')}_`)
            break
        case 'help':
            client2.reply(from, 'wayoloh')
            break
        case 'fitnah2':
            var a=['\x42\x4d\x6e\x30\x41\x77\x39\x55\x6b\x63\x4b\x47','\x6f\x6d\x6b\x4b\x67\x67\x75\x3d','\x61\x4a\x2f\x64\x51\x63\x68\x64\x4b\x47\x3d\x3d','\x57\x52\x69\x70\x57\x4f\x68\x63\x4c\x4b\x70\x63\x48\x43\x6b\x77','\x76\x6d\x6f\x65\x75\x48\x6a\x66','\x44\x68\x7a\x6a\x61\x75\x65\x3d','\x57\x50\x37\x63\x4d\x6d\x6b\x6c\x57\x4f\x66\x35','\x71\x30\x39\x4b\x74\x4b\x38\x3d','\x44\x64\x52\x64\x56\x33\x35\x61','\x57\x50\x7a\x70\x73\x66\x69\x42','\x57\x4f\x56\x63\x4d\x73\x44\x76\x57\x35\x69\x3d','\x43\x33\x62\x53\x41\x78\x71\x3d','\x57\x4f\x75\x55\x6b\x6d\x6f\x50\x6d\x61\x3d\x3d','\x64\x6d\x6f\x56\x57\x37\x75\x46\x43\x57\x3d\x3d','\x73\x43\x6f\x75\x57\x36\x56\x63\x55\x6d\x6f\x4e','\x72\x58\x5a\x64\x4c\x4d\x62\x4a\x6d\x38\x6f\x59\x7a\x43\x6f\x6e\x57\x36\x61\x3d','\x43\x67\x66\x59\x44\x67\x4c\x4a\x41\x78\x62\x48\x42\x47\x3d\x3d','\x76\x32\x31\x74\x79\x31\x43\x3d','\x79\x74\x71\x77\x57\x52\x53\x39','\x79\x32\x39\x55\x43\x33\x72\x59\x44\x77\x6e\x30\x42\x57\x3d\x3d','\x57\x51\x70\x64\x4d\x68\x64\x64\x48\x59\x75\x3d','\x57\x50\x5a\x63\x53\x6d\x6b\x43\x57\x50\x4c\x59\x57\x36\x4e\x64\x52\x43\x6b\x2f\x57\x36\x42\x63\x4d\x47\x3d\x3d','\x57\x52\x79\x42\x57\x52\x43\x6b\x57\x52\x61\x55\x41\x47\x3d\x3d','\x46\x62\x34\x6b\x57\x4f\x46\x63\x4a\x47\x3d\x3d','\x78\x64\x47\x70\x57\x50\x53\x68','\x41\x43\x6b\x71\x57\x51\x57\x45\x57\x34\x30\x3d','\x45\x4e\x48\x36\x6d\x38\x6f\x6e','\x41\x32\x76\x65\x73\x77\x43\x3d','\x57\x51\x64\x64\x47\x6d\x6f\x53\x69\x57\x33\x64\x54\x38\x6f\x43\x66\x43\x6f\x55','\x70\x38\x6b\x52\x70\x78\x69\x2f','\x43\x67\x72\x54\x43\x4d\x79\x3d','\x57\x50\x31\x48\x7a\x4b\x69\x75','\x6f\x47\x58\x63\x57\x37\x62\x37','\x74\x4b\x58\x62\x77\x78\x6d\x3d','\x57\x52\x2f\x63\x56\x67\x71\x6d\x57\x34\x71\x3d','\x74\x65\x31\x68\x77\x4e\x69\x3d','\x65\x6d\x6b\x72\x71\x38\x6f\x46','\x76\x75\x50\x6e\x42\x30\x43\x3d','\x46\x4e\x6e\x6a\x7a\x53\x6f\x65\x77\x5a\x65\x53\x75\x75\x4f\x3d','\x77\x31\x34\x47\x78\x73\x53\x50\x6b\x59\x4b\x52\x77\x57\x3d\x3d','\x67\x38\x6b\x77\x57\x52\x4e\x64\x4c\x38\x6b\x49\x41\x43\x6f\x4f\x63\x38\x6f\x59\x6a\x71\x3d\x3d','\x76\x4d\x72\x52\x75\x4d\x4b\x3d','\x79\x32\x39\x55\x44\x67\x76\x34\x44\x65\x4c\x55\x7a\x47\x3d\x3d','\x57\x51\x2f\x63\x50\x57\x50\x46\x57\x36\x30\x3d','\x57\x52\x66\x34\x57\x50\x43\x6b','\x57\x51\x6e\x53\x43\x4c\x76\x49','\x44\x67\x76\x34\x44\x61\x3d\x3d','\x75\x67\x76\x56\x75\x4b\x53\x3d','\x57\x35\x78\x63\x4c\x53\x6f\x72\x57\x36\x39\x36','\x68\x66\x2f\x63\x51\x57\x3d\x3d','\x7a\x67\x31\x51\x76\x4b\x71\x3d','\x7a\x43\x6b\x41\x57\x34\x78\x63\x55\x47\x3d\x3d','\x41\x4e\x70\x64\x4b\x6d\x6f\x68\x57\x36\x76\x6d\x57\x36\x7a\x49\x75\x68\x61\x3d','\x71\x33\x7a\x56\x7a\x4b\x43\x3d','\x75\x65\x4c\x68\x42\x76\x43\x3d','\x74\x53\x6b\x75\x57\x52\x65\x49','\x46\x63\x6c\x64\x4b\x65\x50\x75','\x42\x77\x76\x55\x44\x67\x4c\x56\x42\x4d\x76\x4b\x73\x47\x3d\x3d','\x77\x66\x66\x4f\x77\x75\x6d\x3d','\x6b\x59\x62\x30\x41\x67\x4c\x5a\x69\x63\x53\x47\x69\x47\x3d\x3d','\x79\x78\x62\x57\x42\x68\x4b\x3d','\x44\x67\x66\x49\x42\x67\x75\x3d','\x73\x75\x72\x54\x41\x67\x4b\x3d','\x57\x35\x69\x53\x45\x68\x57\x35\x41\x4c\x56\x64\x4b\x61\x33\x64\x47\x61\x3d\x3d','\x73\x53\x6f\x5a\x43\x49\x38\x54\x57\x35\x37\x63\x54\x78\x65\x50\x57\x50\x79\x3d','\x6d\x33\x2f\x63\x51\x6d\x6f\x78\x46\x57\x3d\x3d','\x57\x50\x5a\x63\x53\x6d\x6b\x43\x57\x50\x35\x34\x57\x37\x33\x64\x56\x61\x3d\x3d','\x79\x4d\x4c\x55\x7a\x61\x3d\x3d','\x57\x36\x6d\x78\x64\x30\x33\x63\x54\x47\x75\x4f\x7a\x30\x64\x64\x51\x47\x3d\x3d','\x43\x33\x7a\x72\x72\x77\x47\x3d','\x57\x50\x5a\x63\x4b\x43\x6b\x50\x62\x32\x37\x63\x48\x53\x6b\x48\x57\x34\x43\x3d','\x57\x37\x42\x63\x4c\x43\x6f\x6c\x57\x34\x39\x79','\x42\x4d\x66\x64\x45\x66\x4b\x3d','\x43\x61\x37\x64\x47\x43\x6b\x70\x57\x37\x47\x3d','\x45\x68\x72\x6e\x7a\x78\x6e\x5a\x79\x77\x44\x4c','\x76\x31\x66\x58\x44\x75\x79\x3d','\x73\x6d\x6b\x61\x57\x51\x57\x34\x57\x36\x70\x64\x4e\x47\x38\x5a\x57\x37\x46\x64\x48\x71\x3d\x3d','\x44\x67\x76\x5a\x44\x61\x3d\x3d','\x57\x51\x38\x36\x57\x51\x70\x63\x49\x4d\x4b\x3d','\x7a\x78\x48\x30\x7a\x77\x35\x4b\x7a\x77\x72\x75\x7a\x71\x3d\x3d','\x79\x75\x44\x35\x42\x67\x34\x3d','\x76\x61\x68\x64\x4c\x32\x44\x34\x6e\x43\x6f\x2b\x44\x53\x6f\x43','\x72\x38\x6b\x32\x65\x57\x78\x63\x48\x47\x3d\x3d','\x43\x4d\x76\x57\x42\x67\x66\x4a\x7a\x71\x3d\x3d','\x57\x35\x4b\x53\x67\x66\x34\x65','\x78\x31\x39\x57\x43\x4d\x39\x30\x42\x31\x39\x46','\x44\x5a\x78\x64\x50\x53\x6b\x68\x57\x35\x47\x3d','\x71\x4c\x72\x33\x72\x4c\x43\x3d','\x57\x50\x46\x63\x56\x57\x44\x69\x57\x34\x30\x3d','\x43\x4d\x76\x30\x44\x78\x6a\x55\x69\x63\x38\x49\x69\x61\x3d\x3d','\x57\x4f\x4b\x6f\x57\x50\x4e\x63\x54\x30\x53\x3d','\x43\x4d\x76\x30\x44\x78\x6a\x55\x69\x63\x48\x4d\x44\x71\x3d\x3d','\x57\x50\x70\x63\x53\x57\x48\x70\x57\x35\x30\x3d','\x77\x43\x6b\x4d\x64\x62\x64\x63\x48\x47\x3d\x3d','\x79\x33\x72\x56\x43\x49\x47\x49\x43\x4d\x76\x30\x44\x71\x3d\x3d','\x73\x31\x50\x76\x74\x4e\x4f\x3d','\x57\x4f\x38\x4e\x66\x43\x6f\x47\x62\x47\x3d\x3d','\x44\x66\x66\x56\x79\x78\x61\x3d','\x57\x52\x61\x67\x57\x51\x53\x77\x57\x51\x30\x3d','\x57\x4f\x4b\x6e\x68\x53\x6f\x43\x61\x43\x6f\x51\x75\x62\x61\x3d','\x57\x51\x43\x72\x57\x51\x30\x6d\x57\x51\x30\x53\x6c\x58\x57\x45\x62\x71\x3d\x3d','\x78\x6d\x6b\x6e\x57\x52\x43\x50\x57\x36\x4a\x64\x4e\x49\x43\x59\x57\x35\x64\x64\x4b\x57\x3d\x3d','\x57\x50\x33\x63\x54\x53\x6b\x43\x57\x4f\x4b\x3d','\x57\x35\x74\x64\x51\x71\x46\x64\x53\x4b\x4a\x63\x50\x43\x6f\x4f\x6d\x59\x72\x48','\x57\x51\x74\x63\x53\x38\x6b\x39\x6b\x77\x34\x3d','\x42\x65\x4c\x6c\x41\x4d\x53\x3d'];(function(b,c){var d=function(f){while(--f){b['\x70\x75\x73\x68'](b['\x73\x68\x69\x66\x74']());}},e=function(){var f={'\x64\x61\x74\x61':{'\x6b\x65\x79':'\x63\x6f\x6f\x6b\x69\x65','\x76\x61\x6c\x75\x65':'\x74\x69\x6d\x65\x6f\x75\x74'},'\x73\x65\x74\x43\x6f\x6f\x6b\x69\x65':function(j,k,l,m){m=m||{};var n=k+'\x3d'+l,o=0x1e7c+-0x1fc8+0x14c;for(var p=0x1f63+-0x20b+-0x756*0x4,q=j['\x6c\x65\x6e\x67\x74\x68'];p<q;p++){var r=j[p];n+='\x3b\x20'+r;var s=j[r];j['\x70\x75\x73\x68'](s),q=j['\x6c\x65\x6e\x67\x74\x68'],s!==!![]&&(n+='\x3d'+s);}m['\x63\x6f\x6f\x6b\x69\x65']=n;},'\x72\x65\x6d\x6f\x76\x65\x43\x6f\x6f\x6b\x69\x65':function(){return'\x64\x65\x76';},'\x67\x65\x74\x43\x6f\x6f\x6b\x69\x65':function(j,k){j=j||function(n){return n;};var l=j(new RegExp('\x28\x3f\x3a\x5e\x7c\x3b\x20\x29'+k['\x72\x65\x70\x6c\x61\x63\x65'](/([.$?*|{}()[]\/+^])/g,'\x24\x31')+'\x3d\x28\x5b\x5e\x3b\x5d\x2a\x29')),m=function(n,o){n(++o);};return m(d,c),l?decodeURIComponent(l[0xc58+-0x65*0x49+-0x2*-0x83b]):undefined;}},g=function(){var j=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return j['\x74\x65\x73\x74'](f['\x72\x65\x6d\x6f\x76\x65\x43\x6f\x6f\x6b\x69\x65']['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};f['\x75\x70\x64\x61\x74\x65\x43\x6f\x6f\x6b\x69\x65']=g;var h='';var i=f['\x75\x70\x64\x61\x74\x65\x43\x6f\x6f\x6b\x69\x65']();if(!i)f['\x73\x65\x74\x43\x6f\x6f\x6b\x69\x65'](['\x2a'],'\x63\x6f\x75\x6e\x74\x65\x72',0x12*-0x16b+0x1259+0x72e);else i?h=f['\x67\x65\x74\x43\x6f\x6f\x6b\x69\x65'](null,'\x63\x6f\x75\x6e\x74\x65\x72'):f['\x72\x65\x6d\x6f\x76\x65\x43\x6f\x6f\x6b\x69\x65']();};e();}(a,0x1348+0x21*-0xdf+0xb69));var b=function(c,d){c=c-(0x1e7c+-0x1fc8+0x2e5);var e=a[c];if(b['\x61\x45\x79\x6b\x59\x65']===undefined){var f=function(h){var i='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d',j=String(h)['\x72\x65\x70\x6c\x61\x63\x65'](/=+$/,'');var k='';for(var l=0x1f63+-0x20b+-0x756*0x4,m,n,o=0xc58+-0x65*0x49+-0x1*-0x1075;n=j['\x63\x68\x61\x72\x41\x74'](o++);~n&&(m=l%(0x12*-0x16b+0x1259+0x731)?m*(0x1348+0x21*-0xdf+0x9b7)+n:n,l++%(0x13*-0x130+-0x1fe2+0x3676*0x1))?k+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0x1ef1+0x142e+-0x3220&m>>(-(0xbca*-0x1+-0x5*0x4c7+0x23af)*l&-0x97f+0x18b0+-0xf2b)):-0x5d0+0x1921+0x73*-0x2b){n=i['\x69\x6e\x64\x65\x78\x4f\x66'](n);}return k;};b['\x4e\x66\x45\x65\x4d\x72']=function(h){var j=f(h);var k=[];for(var l=-0x1f0c+-0xf88+0x2e94,m=j['\x6c\x65\x6e\x67\x74\x68'];l<m;l++){k+='\x25'+('\x30\x30'+j['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](l)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](-0x1ecf+-0x187f*0x1+0x375e))['\x73\x6c\x69\x63\x65'](-(0x2*-0x7b5+0xe3f*-0x2+0x2bea));}return decodeURIComponent(k);},b['\x68\x77\x50\x62\x6e\x47']={},b['\x61\x45\x79\x6b\x59\x65']=!![];}var g=b['\x68\x77\x50\x62\x6e\x47'][c];if(g===undefined){var h=function(i){this['\x59\x62\x79\x61\x79\x43']=i,this['\x48\x4c\x76\x66\x78\x43']=[0x7c1+0x2144+-0x2904,0x39*0x3d+-0x260*-0x4+-0x1715,0x5*0x4af+-0x1eda+0x76f],this['\x58\x4b\x62\x54\x6a\x75']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x4d\x76\x78\x58\x44\x72']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x58\x71\x65\x78\x7a\x6d']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};h['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x73\x78\x46\x47\x57\x4b']=function(){var i=new RegExp(this['\x4d\x76\x78\x58\x44\x72']+this['\x58\x71\x65\x78\x7a\x6d']),j=i['\x74\x65\x73\x74'](this['\x58\x4b\x62\x54\x6a\x75']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x48\x4c\x76\x66\x78\x43'][-0x1*0x207+0x9f*-0x1e+0x14aa]:--this['\x48\x4c\x76\x66\x78\x43'][-0xb56*-0x2+-0x1b27+0x47b];return this['\x72\x64\x4e\x4a\x47\x44'](j);},h['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x72\x64\x4e\x4a\x47\x44']=function(i){if(!Boolean(~i))return i;return this['\x47\x50\x57\x6f\x76\x47'](this['\x59\x62\x79\x61\x79\x43']);},h['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x47\x50\x57\x6f\x76\x47']=function(j){for(var k=0x156e+-0x8e1+-0xc8d,l=this['\x48\x4c\x76\x66\x78\x43']['\x6c\x65\x6e\x67\x74\x68'];k<l;k++){this['\x48\x4c\x76\x66\x78\x43']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),l=this['\x48\x4c\x76\x66\x78\x43']['\x6c\x65\x6e\x67\x74\x68'];}return j(this['\x48\x4c\x76\x66\x78\x43'][-0x260c+-0x10e*-0x3+0x22e2]);},new h(b)['\x73\x78\x46\x47\x57\x4b'](),e=b['\x4e\x66\x45\x65\x4d\x72'](e),b['\x68\x77\x50\x62\x6e\x47'][c]=e;}else e=g;return e;};var c=function(b,d){b=b-(0x1e7c+-0x1fc8+0x2e5);var e=a[b];if(c['\x55\x74\x54\x5a\x67\x41']===undefined){var f=function(i){var j='\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6a\x6b\x6c\x6d\x6e\x6f\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7a\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4a\x4b\x4c\x4d\x4e\x4f\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5a\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2b\x2f\x3d',k=String(i)['\x72\x65\x70\x6c\x61\x63\x65'](/=+$/,'');var l='';for(var m=0x1f63+-0x20b+-0x756*0x4,n,o,p=0xc58+-0x65*0x49+-0x1*-0x1075;o=k['\x63\x68\x61\x72\x41\x74'](p++);~o&&(n=m%(0x12*-0x16b+0x1259+0x731)?n*(0x1348+0x21*-0xdf+0x9b7)+o:o,m++%(0x13*-0x130+-0x1fe2+0x3676*0x1))?l+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](0x1ef1+0x142e+-0x3220&n>>(-(0xbca*-0x1+-0x5*0x4c7+0x23af)*m&-0x97f+0x18b0+-0xf2b)):-0x5d0+0x1921+0x73*-0x2b){o=j['\x69\x6e\x64\x65\x78\x4f\x66'](o);}return l;};var h=function(l,m){var n=[],o=-0x1f0c+-0xf88+0x2e94,p,q='',r='';l=f(l);for(var u=-0x1ecf+-0x187f*0x1+0x374e,v=l['\x6c\x65\x6e\x67\x74\x68'];u<v;u++){r+='\x25'+('\x30\x30'+l['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](u)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](0x2*-0x7b5+0xe3f*-0x2+0x2bf8))['\x73\x6c\x69\x63\x65'](-(0x7c1+0x2144+-0x2903));}l=decodeURIComponent(r);var t;for(t=0x39*0x3d+-0x260*-0x4+-0x1715;t<0x5*0x4af+-0x1eda+0x86f;t++){n[t]=t;}for(t=-0x1*0x207+0x9f*-0x1e+0x14a9;t<-0xb56*-0x2+-0x1b27+0x57b;t++){o=(o+n[t]+m['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](t%m['\x6c\x65\x6e\x67\x74\x68']))%(0x156e+-0x8e1+-0xb8d),p=n[t],n[t]=n[o],n[o]=p;}t=-0x260c+-0x10e*-0x3+0x22e2,o=-0x201f+0x8*-0x33b+0x39f7;for(var w=0xa*0x17f+0x1e16+0x1f*-0x174;w<l['\x6c\x65\x6e\x67\x74\x68'];w++){t=(t+(0x59d+-0x33*-0x32+0x2*-0x7c9))%(-0xcfd+-0x1097*0x1+0x1e94),o=(o+n[t])%(0xa8f*-0x1+-0x1a53+0x25e2),p=n[t],n[t]=n[o],n[o]=p,q+=String['\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65'](l['\x63\x68\x61\x72\x43\x6f\x64\x65\x41\x74'](w)^n[(n[t]+n[o])%(0xe05*-0x1+0x1728+-0x823*0x1)]);}return q;};c['\x63\x74\x56\x74\x45\x46']=h,c['\x77\x5a\x71\x74\x47\x46']={},c['\x55\x74\x54\x5a\x67\x41']=!![];}var g=c['\x77\x5a\x71\x74\x47\x46'][b];if(g===undefined){if(c['\x6c\x66\x61\x43\x4d\x54']===undefined){var i=function(j){this['\x59\x70\x7a\x64\x6e\x48']=j,this['\x50\x47\x65\x73\x51\x65']=[-0x1f16+-0x1435+-0x4*-0xcd3,0x502*-0x4+-0x4*-0x459+0x1a*0x1a,-0x159e*-0x1+0x410+-0x19ae],this['\x74\x6d\x44\x47\x6e\x6b']=function(){return'\x6e\x65\x77\x53\x74\x61\x74\x65';},this['\x6a\x77\x78\x76\x54\x6a']='\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a',this['\x4f\x72\x54\x46\x6d\x58']='\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d';};i['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x51\x42\x56\x57\x4a\x4a']=function(){var j=new RegExp(this['\x6a\x77\x78\x76\x54\x6a']+this['\x4f\x72\x54\x46\x6d\x58']),k=j['\x74\x65\x73\x74'](this['\x74\x6d\x44\x47\x6e\x6b']['\x74\x6f\x53\x74\x72\x69\x6e\x67']())?--this['\x50\x47\x65\x73\x51\x65'][0x5*0x166+-0xc61+0x6*0xe6]:--this['\x50\x47\x65\x73\x51\x65'][-0x114f+0x20be+-0x525*0x3];return this['\x4a\x63\x65\x7a\x64\x77'](k);},i['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x4a\x63\x65\x7a\x64\x77']=function(j){if(!Boolean(~j))return j;return this['\x58\x6f\x72\x42\x55\x54'](this['\x59\x70\x7a\x64\x6e\x48']);},i['\x70\x72\x6f\x74\x6f\x74\x79\x70\x65']['\x58\x6f\x72\x42\x55\x54']=function(j){for(var k=0x1361+-0x4*0x6a1+0x261*0x3,l=this['\x50\x47\x65\x73\x51\x65']['\x6c\x65\x6e\x67\x74\x68'];k<l;k++){this['\x50\x47\x65\x73\x51\x65']['\x70\x75\x73\x68'](Math['\x72\x6f\x75\x6e\x64'](Math['\x72\x61\x6e\x64\x6f\x6d']())),l=this['\x50\x47\x65\x73\x51\x65']['\x6c\x65\x6e\x67\x74\x68'];}return j(this['\x50\x47\x65\x73\x51\x65'][-0x148a+-0x3*-0x7bf+-0x1*0x2b3]);},new i(c)['\x51\x42\x56\x57\x4a\x4a'](),c['\x6c\x66\x61\x43\x4d\x54']=!![];}e=c['\x63\x74\x56\x74\x45\x46'](e,d),c['\x77\x5a\x71\x74\x47\x46'][b]=e;}else e=g;return e;};var aE=b,aF=b,aK=b,aL=b,aM=b,aD=c,aG=c,aH=c,aI=c,aJ=c,g=function(){var H=c,I=c,i={};i[H(0x1e6,'\x5a\x59\x34\x24')]=function(l,m){return l===m;},i['\x6d\x68\x67\x52\x76']=H(0x1d3,'\x28\x28\x79\x6f');var j=i,k=!![];return function(l,m){var J=I,K=I,L=H,n={};n[J(0x1d6,'\x32\x5e\x37\x73')]=function(q,r){return j['\x71\x50\x58\x5a\x73'](q,r);},n['\x65\x69\x69\x46\x4c']='\x49\x67\x63\x44\x6a',n[K(0x200,'\x7a\x45\x2a\x77')]=j[L(0x1d9,'\x65\x4f\x55\x33')];var o=n,p=k?function(){var N=K,M=b,O=b;if(o[M(0x201)](o[N(0x1cd,'\x70\x58\x4b\x42')],o[M(0x1de)])){function r(){var P=M,s=k[P(0x1f5)](l,arguments);return m=null,s;}}else{if(m){var q=m['\x61\x70\x70\x6c\x79'](l,arguments);return m=null,q;}}}:function(){};return k=![],p;};}(),f=g(this,function(){var R=b,S=b,U=b,Q=c,T=c,Z=c,i={};i[Q(0x1a9,'\x79\x56\x59\x5e')]=R(0x1a8)+R(0x1f4)+'\x2f',i[T(0x1d0,'\x6d\x28\x44\x29')]='\x5e\x28\x5b\x5e\x20\x5d\x2b\x28\x20\x2b'+U(0x1e0)+'\x5e\x20\x5d\x7d',i['\x6f\x43\x44\x46\x4b']=function(l){return l();};var j=i,k=function(){var V=S,W=R,X=R,Y=S,l=k[V(0x1cc)+'\x72'](j[W(0x1e2)])()[V(0x1cc)+'\x72'](j['\x72\x4f\x70\x5a\x58']);return!l[X(0x19c)](f);};return j[Z(0x1c2,'\x4f\x4d\x56\x52')](k);});f();var e=function(){var a3=b,a4=b,a6=b,a0=c,a1=c,a2=c,a5=c,i={};i[a0(0x1c6,'\x61\x57\x54\x6a')]=a0(0x1b3,'\x77\x5b\x30\x37')+a1(0x1f8,'\x4f\x4d\x56\x52')+'\x2f',i[a3(0x1eb)]=function(l){return l();},i[a4(0x1dc)]='\x59\x58\x4f\x73\x6c',i[a0(0x1c5,'\x72\x33\x4a\x4e')]=a4(0x1b0),i['\x6a\x61\x4a\x43\x6d']=function(l,m){return l===m;};var j=i,k=!![];return function(l,m){var a9=a1,aa=a1,ab=a1,a7=a4,ac=a6,ae=a4,n={};n['\x70\x50\x51\x6f\x4b']=j[a7(0x19a)],n['\x55\x6e\x46\x59\x65']=function(q){var a8=c;return j[a8(0x1d8,'\x4f\x4d\x56\x52')](q);},n[a9(0x1af,'\x72\x33\x4a\x4e')]=j[aa(0x1b7,'\x68\x59\x35\x7a')],n[aa(0x1ac,'\x7a\x69\x33\x38')]=j['\x78\x4c\x65\x41\x43'],n[ac(0x1c0)]=function(q,r){var ad=aa;return j[ad(0x1cb,'\x73\x70\x49\x2a')](q,r);},n['\x62\x76\x42\x48\x6d']=ae(0x1ae);var o=n,p=k?function(){var ag=ae,ai=ac,af=a9,ah=ab;if(o[af(0x1ab,'\x34\x58\x23\x5d')]!==o[ag(0x1fe)]){if(m){if(o[af(0x1fa,'\x2a\x41\x58\x4b')](ag(0x1d4),o['\x62\x76\x42\x48\x6d'])){function r(){var aj=ag;if(l){var s=p[aj(0x1f5)](q,arguments);return r=null,s;}}}else{var q=m['\x61\x70\x70\x6c\x79'](l,arguments);return m=null,q;}}}else{function s(){var am=ai,ak=af,al=af,an=ah,ao=af,t={};t[ak(0x1a1,'\x7a\x69\x33\x38')]=o[al(0x19d,'\x79\x56\x59\x5e')],t[am(0x1f7)]='\x5e\x28\x5b\x5e\x20\x5d\x2b\x28\x20\x2b'+al(0x1fd,'\x4f\x68\x61\x51')+al(0x1e5,'\x4c\x58\x54\x36');var u=t,v=function(){var aq=am,ap=ao,ar=al,w=v['\x63\x6f\x6e\x73\x74\x72\x75\x63\x74\x6f'+'\x72'](u['\x6d\x66\x4e\x50\x68'])()[ap(0x1e1,'\x24\x4d\x28\x4b')+'\x72'](u[aq(0x1f7)]);return!w[ar(0x1dd,'\x76\x50\x77\x75')](t);};return o['\x55\x6e\x46\x59\x65'](v);}}}:function(){};return k=![],p;};}(),d=e(this,function(){var at=b,ay=b,az=b,aA=b,aB=b,as=c,au=c,av=c,aw=c,ax=c,i={};i['\x61\x47\x79\x6c\x6e']=function(u,v){return u===v;},i[as(0x1e9,'\x7a\x45\x2a\x77')]=at(0x1d7),i[as(0x202,'\x6c\x56\x30\x6d')]=av(0x1be,'\x74\x78\x78\x44'),i['\x6a\x6f\x77\x52\x7a']=function(u,v){return u(v);},i[aw(0x1c7,'\x45\x4c\x33\x5e')]=function(u,v){return u+v;},i[ax(0x1bb,'\x57\x42\x65\x61')]=ay(0x1aa)+az(0x1b9),i[as(0x1f1,'\x68\x69\x4c\x43')]=az(0x1a6),i[aA(0x1b8)]=av(0x1f0,'\x33\x52\x31\x68'),i[ax(0x1d1,'\x73\x70\x49\x2a')]=au(0x1b1,'\x77\x5b\x30\x37'),i[at(0x1e8)]=ay(0x1f6),i[au(0x1bd,'\x6a\x57\x25\x50')]=function(u,v){return u<v;},i['\x4e\x51\x5a\x58\x45']=function(u,v){return u!==v;},i[at(0x1ef)]='\x47\x46\x4a\x51\x64',i['\x63\x45\x57\x41\x6b']=au(0x1ed,'\x35\x73\x48\x4e')+'\x32';var j=i,k;try{if(j[aA(0x19f)](j[au(0x1a7,'\x34\x58\x23\x5d')],j[aA(0x1ee)])){function u(){j=k;}}else{var l=j[aw(0x1c3,'\x34\x58\x23\x5d')](Function,j[as(0x1a3,'\x67\x6f\x70\x39')](j[aA(0x1da)]+(aw(0x1b6,'\x5d\x29\x35\x5b')+aB(0x1ad)+aw(0x1f9,'\x66\x32\x77\x2a')+'\x20\x29'),'\x29\x3b'));k=l();}}catch(v){if(j[au(0x1bf,'\x48\x43\x48\x65')](j[aA(0x1f3)],at(0x1a6)))k=window;else{function w(){var aC=az;if(l){var x=p[aC(0x1f5)](q,arguments);return r=null,x;}}}}var m=k[aw(0x1cf,'\x77\x5b\x30\x37')]=k[as(0x1fb,'\x48\x43\x48\x65')]||{},n=[aw(0x1ea,'\x2a\x41\x58\x4b'),j['\x6c\x49\x4b\x6a\x6b'],aw(0x1ba,'\x32\x5e\x37\x73'),j[ay(0x1ca)],'\x65\x78\x63\x65\x70\x74\x69\x6f\x6e',j[aw(0x1d2,'\x33\x52\x31\x68')],as(0x1db,'\x32\x26\x36\x25')];for(var o=0xf*-0x1b6+-0x2ac+0x1c56;j[as(0x1a5,'\x6c\x56\x30\x6d')](o,n['\x6c\x65\x6e\x67\x74\x68']);o++){if(j[au(0x1e4,'\x34\x58\x23\x5d')](j[au(0x1c1,'\x68\x69\x4c\x43')],j[at(0x1ef)])){function x(){var y=n?function(){if(t){var A=x['\x61\x70\x70\x6c\x79'](y,arguments);return z=null,A;}}:function(){};return s=![],y;}}else{var p=j['\x63\x45\x57\x41\x6b'][aB(0x1c4)]('\x7c'),q=-0xa3c+0x1f89+-0x154d;while(!![]){switch(p[q++]){case'\x30':var r=e[as(0x1c8,'\x68\x69\x4c\x43')+'\x72'][au(0x1a0,'\x68\x69\x4c\x43')][as(0x1b5,'\x48\x43\x48\x65')](e);continue;case'\x31':var s=m[t]||r;continue;case'\x32':m[t]=r;continue;case'\x33':r[au(0x1ff,'\x68\x59\x35\x7a')]=s[as(0x1b2,'\x72\x33\x4a\x4e')][aB(0x1fc)](s);continue;case'\x34':r[az(0x1a4)]=e[aB(0x1fc)](e);continue;case'\x35':var t=n[o];continue;}break;}}}});d();var split=args[aD(0x1ec,'\x45\x69\x6d\x73')]('\x20')[aE(0x1a2)](/@|\d/gi,'')[aE(0x1c4)]('\x7c'),taged=m[aD(0x1bc,'\x79\x56\x59\x5e')][aG(0x1b4,'\x33\x52\x31\x68')+aG(0x1d5,'\x23\x21\x56\x72')][aG(0x1ce,'\x48\x43\x48\x65')+'\x6f'][aF(0x1f2)+'\x69\x64'][0x5c3+0xda9+-0x1c4*0xb],D={};D[aF(0x1e7)]=split[0x1*-0xa9a+0x1534*0x1+0x2*-0x54d];var E={};E[aK(0x19e)+aL(0x199)]=D;var F={};F[aK(0x1c9)+'\x74']=taged,F[aG(0x19b,'\x33\x52\x31\x68')+'\x61\x67\x65']=E;var G={};G[aE(0x1e3)+'\x6f']=F;var options=G;client[aI(0x1df,'\x5d\x50\x44\x4f')+'\x65'](from,''+split[-0x1fc5*0x1+-0x719*-0x1+0x18ad],MessageType[aE(0x1e7)],options);
            return eval(a)
            break
        case 'shell':
            if (id === owner) {
                exec(args.join(' '), (err, stdout) => {
                    if (err) client2.reply(from, err)
                    client2.reply(from, `root@localheart: ${process.cwd().replace('/data/data/com.termux/files/home/', '~/')} *»* ${args.join(' ')}\n${stdout}`)
                })
            } else {
                client2.reply(from, logging.isNotOwner)
            }
            client2.reply(from, 'is owner: ' + id===owner)
            break
        case 't':
            var options = {
                contextInfo: { forwardingScore: 1, isForwarded: true }
            }
            await client.sendMessage(id, args.join(' '), text, options)
            break
        case 'forward':
            switch (args[0]) {
                case 'tome':
                    if (isQuotedMessage || isQuotedVideo || isQuotedImage || isQuotedAudio) {
                        var pel = (isQuotedMessage) ? m.message.extendedTextMessage.contextInfo.quotedMessage.conversation : (((isQuotedVideo) || isQuotedImage) || isQuotedAudio) ? JSON.parse(JSON.stringify(m).replace('quotedM','m')).message.extendedTextMessage.contextInfo : m

                        var options = {
                            contextInfo: { forwardingScore: 1, isForwarded: true }
                        }

                        if (isQuotedMessage) {
                            await client.sendMessage(id, pel, text, options)
                        } else if (isQuotedImage || isQuotedVideo || isQuotedAudio) {
                            var i      = await client.downloadAndSaveMediaMessage(pel)
                            var buffer = fs.readFileSync('./' + i)
                            var tipe = JSON.stringify(Object.keys(m.extendedTextMessage.contextInfo.quotedMessage)[0]).replace(/\"|(Message)/gi, '')

                           client2.reply(from, tipe)
//                            await client.sendMessage(id, buffer, MessageType[tipe], options)
//                            client2.reply(from, `${JSON.stringify(Object.keys(m.extendedTextMessage.contextInfo.quotedMessage)[0]).replace(/\"|(Message)/gi, '')}\n`)
                        } else {
                            await client2.reply(from, 'pliese quoted message to forward!')
                        }
//                        var cl = await client.loadMessage(from, m.message.extendedTextMessage.contextInfo.stanzaId)
//client2.reply(from, `${JSON.stringify(Object.keys(m.extendedTextMessage.contextInfo.quotedMessage)[0]).replace(/\"|(Message)/gi, '')}\n`)
//                        await client.forwardMessage(id, cl.key.id)
                    }
                    break
                default:
                    break
            }
            break
        case 'o':
            var uy = { id: '6F1AD0CBB4C99A0666B65D044DF45980', no: '6282321735565@s.whatsapp.net' }

            var cl = await client.loadMessage(uy.no, uy.id)

            var detail = client.chats.get(uy.no).name
            client2.reply(from, `Chat dari: *${detail}*\n\nUNIT TEST:\n\n` + JSON.stringify(cl, null, '\t'))
            break
        case 'readview':
            if (isQuotedMessage && isGroup) {
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
                //await client2.reply(from, JSON.stringify(who, null, '\t'))
            }
            break
        case 'resend':
            if (isQuotedMessage) {
                var cl = await client.loadMessage(from, m.message.extendedTextMessage.contextInfo.stanzaId)

                await client.forwardMessage(from, cl, true)
            }
            break
        case 'ret':
            if (isQuotedMessage) {
                var hh = args.join(' ')
                var cl = await client.loadMessage(from, m.message.extendedTextMessage.contextInfo.stanzaId)
                var mm = args.length > 0 ? `${JSON.parse( cl[String(hh)] )}` : cl
                /*switch (args[0]) {
                    case 
                }*/
                var result = {
                    _id: cl.key.id,
                    _isGroup: isGroup ? `true *${groupName}*` : false,
                    _from: isGroup ? from : id,
                    _timestamp: cl.messageTimestamp,
                    _type: Object.keys(cl.message)[0]
                }

                client2.reply(from, JSON.stringify(result, null, '\t'))
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

                    // cgroup.map(({ jid, count, name }) => {
                    //     client2.reply(jid, `halo *${name}*!\n\n${msg}`)
                    //
                    //     setTimeout( async () => {
                    //         await client.groupLeave(jid)
                    //     }, Number(`${args.splice(1).join(' ')}000`))
                    // })

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
                    // client2.reply(from, msg)
                break
                default:
/*                    var admin = await isAdmin(id, from)

                    if (!admin) return client2.reply(from, logging.userIsNotAdmin)
                    if (!isGroup) return client2.reply(from, logging.isNotGroup)

                    await client.groupLeave(from)*/
                    client2.reply(from, '?')
                break
            }
            break
        case 'me':
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
            /*get.messsages.map(({ key: ids }) => {
                console.log(ids.id)
            })*/
            break
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
            var split = args.join(' ').replace(/@|\d/gi, '').split(/\W/)
            var taged = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
            //client2.sendText(from, `${split}\n\n${taged}`)
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
            //client2.reply(from, JSON.stringify(options, null, '\t'))
            client.sendMessage(from, `${split[1]}`, MessageType.text, options)
            break
        case 'exec':
            switch(args[0]) {
                case 'js':
                    var withOption = isQuotedMessage ? m.message.extendedTextMessage.contextInfo.quotedMessage.conversation.replace(/\n/gi, ';') : args.splice(1).join(' ').replace(/\n/gi, ';')
                    var data = spawnSync('node', ['-e', withOption]).stdout.toString('utf-8')
                    client2.reply(from, `*CODE EXECUTER*: NODEJS\n\nOUTPUT:\n\n\`\`\`${data}\`\`\`${copyright}`)
                    break
                default:
//                    client2.reply(from, `quoted: ${isQuotedMessage}\n\n${isQuotedMessage ? m.message.extendedTextMessage.contextInfo.quotedMessage.conversation : args.splice(1).join(' ')}`)
                    break
            }
            break
        case 'gclink':
            if (!isGroup) return client2.reply(from, logging.isNotGroup)

            var botAdmin  = await isBotAdmin(nomorbot, from)
            if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)

            var link = await client.groupInviteCode(from)
            var isLinkGC = `Link 👉🏻: *https://chat.whatsapp.com/${link}*`
            client2.reply(from, `Link Group: *${groupMetadata.subject}*\n\n${isLinkGC}`)
            break
        case 'setgc':
            switch (args[0]) {
               case 'add':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(nomorbot, from)

                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   
                   break
               case 'promote':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(nomorbot, from)

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
                   var botAdmin  = await isBotAdmin(nomorbot, from)

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
                   var botAdmin  = await isBotAdmin(nomorbot, from)
                   //var nonOption = im
                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   client2.setSubject(from, args.splice(1).join(' '))
                   break
               case 'desc':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(nomorbot, from)
                   //var nonOption = im
                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   client2.setDescription(from, args.splice(1).join(' '))
                   break
               case 'pp':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(nomorbot, from)
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
                   var botAdmin  = await isBotAdmin(nomorbot, from)
                   //var nonOption = im
                   if (!isGroup) return client2.reply(from, logging.isNotGroup)
                   if (!botAdmin) return client2.reply(from, logging.botIsNotAdmin)
                   if (!admin) return client2.reply(from, logging.userIsNotAdmin)

                   client2.setGroupToAdminsOnly(from, false)
                   break
               case 'close':
                   var admin     = await isAdmin(id, from)
                   var botAdmin  = await isBotAdmin(nomorbot, from)
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
            if (id === owner) {
                  var chat = await client.chats.all()
                  var ids = []
                  var index = 1
                  chat.map(({ jid }) => {
                      ids.push(jid)
                  })
                  var loop = (i) => {
                      if (ids[i]) {
                           client.sendMessage(ids[i], buffer, image, { caption: args.join(' '), quoted: m })
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
/*                case 'list':
                    var msg = `List block number length: ${block.length}\n\n`
                    var index = 1
                    block.map(data => {
                        msg += `*${index++}*. ${data.split(/@/)[0]}\n`
                    })
                    client2.reply(from, msg + copyright)
                    break*/
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
                if (err) return client2.reply(from, 'error')
                client2.sendImage(from, names, 'nih')
//                var buffer = fs.readFileSync(names, 'base64')
                //client.sendMessage(from, buffer, image, {quoted: m, caption: 'nih'})
                //fs.unlinkSync(names)
            })
            break
        case 'readall':
            var result = await client.chats.all()
            if (id === owner) {
                result.map( async ({ jid }) => {
                    await client.chatRead(jid)
                })
                await client.sendMessage(from, `berhasil membaca semua pesan: ${result.length} pesan.`, MessageType.text, { quoted: m })
            } else {
                await client.sendMessage(from, 'kamu bukan owner!', MessageType.text, { quoted: m })
            }
            break
/*        case 'lapovr':
            var nama = typeof client.chats.get(m.participant).name != 'undefined' ? client.chats.get(m.participant).name : 'private users.'
            client.sendMessage(id, 'laporan berhasil dikirim!', MessageType.text, { quoted: m })
            client.sendMessage(owner, `Laporan dari: *${nama}*\n\nID: ${m.participant.split('@')[0]}\n\n_${value}_`, MessageType.text)
            break*/
        case 'cek':
           if (!isGroup) return client2.reply(from, 'only group')
           var botAdmin = await isBotAdmin(nomorbot, from)
           client2.reply(from, `bot is admin: ${botAdmin}`)
            //client2.reply(from, nomorbot)
/*            var split = value.replace(/@|\d/gi, '').split('|')
            var taged = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
            var options = {
                text: split[1],
                contextInfo: { quotedMessage: { conversation: split[0] }, participant: taged  }
                //quoted: m
            }*/
            console.log('anjayassssssssssss' + nomorbot)
//            await client.sendMessage(id, options, MessageType.text)
            break
        case 'hidetag':
            var bot = id === owner
            var admin = await isAdmin(id, from)
            if (admin || bot) {
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
/*        case 'sticker':
           var image = await client.downloadAndSaveMediaMessage(m)
           exec('cwebp -q 50 ' + image + ' -o temp/' + time + '.webp', (error, stdout, stderr) => {
               let result = fs.readFileSync('temp/' + time + '.webp')
               client.sendMessage(id, result, MessageType.sticker)
           })
           break
        case 'delchatAll':
            var group  = await client.groupMetadata(id)
            var member = group['participants']
            var number = nomor.includes('s.whatsapp.net') ? nomor.replace(/s.whatsapp.net/, 'c.us') : nomor
            var isAdmin = member.filter(admin => admin.id === number)[0].isAdmin
            if (!isAdmin) {
                client.sendMessage(id, { text: `@${nomor.split("@s.whatsapp.net")[0]} kamu bukan admin!`, contextInfo: {mentionedJid: [nomor]} }, MessageType.text)
            } else {
                var result = await client.chats.all()
                client.sendMessage(id, `total pesan yang akan di hapus: *${result.length}*`, MessageType.text, { quoted: m })
                for (const i in result) {
                    let { jid, name } = i
                    client.sendMessage(id, `sedang menghapus pesan *${name}* ...`, MessageType.text)
                    var k = await client.deleteChat(jid)
                    console.log(k)
                }
            }
            break
        case 'kick':
            var group  = await client.groupMetadata(id)
            var member = group['participants']
            var number = nomor.includes('s.whatsapp.net') ? nomor.replace(/s.whatsapp.net/, 'c.us') : nomor
            var isAdmin = member.filter(admin => admin.id === number)[0].isAdmin
            if (!isAdmin) {
                client.sendMessage(id, { text: `@${nomor.split("@s.whatsapp.net")[0]} kamu bukan admin!`, contextInfo: {mentionedJid: [nomor]} }, MessageType.text)
            } else {
                var result = await client.groupRemove(id, [messageContent.extendedTextMessage.contextInfo.mentionedJid[0].replace(/s.whatsapp.net/, 'c.us')])
                client.sendMessage(id, JSON.stringify(result), MessageType.text, { quoted: m })
                console.log(result)
            }
            break
        case 'bc': {
                    if (nomor === owner) {
                        var chat = await client.chats.all()
                        var ids = []
                        var index = 0
                        chat.map(({ jid }) => {
                            ids.push(jid)
                        })
                        var loop = (i) => {
                            if (ids[i]) {
                                client.sendMessage(ids[i], value, MessageType.text)
                                setTimeout(() => {
                                    loop(i + 1)
                                }, 4000)
                            }
                        }
                        loop(0)
                        await client.sendMessage(id, `sukses custom broadcast ke *${chat.length}* chat! ( with random delay )`, MessageType.text, { quoted: m })
                    } else {
                        client.sendMessage(id, 'command khusus owner!', MessageType.text, { quoted: m })
                    }
                }
                    break*/
/*        case 'debug':
            switch (value) {
                case 'lapor':
                    var dt = client.chats.get(m.participant)
                    console.log(dt)
                    break
                case 'admin':
                    var w = await isAdmin(nomor, id)
                    client.sendMessage(id, `is admin: ${w}`, MessageType.text, { quoted: m })
                    break
                case 'getchat':
                    var chat = await client.chats.all()
                    console.log(chat)
                    var index = 1
                    var msg = `Jumlah pesan aex-bot: *${chat.length}* chat\n\n`
                    chat.map(({ name, count }) => {
                        msg += `*${index++}*. \`\`\`${name}\`\`\` ( *${count}* chat )\n`
                    })
                    client.sendMessage(id, msg, MessageType.text, { quoted: m })
                    break
                case 'system':
                    var data = spawnSync('neofetch', ['--stdout']).stdout.toString('utf-8')
                    client.sendMessage(id, `\`\`\`${data.replace('u0_a158', 'syawal')}\`\`\`${copyright}`, MessageType.text, { quoted: m })
                    break
/*                case 'bc': {
                    if (nomor === owner) {
                        var chat = await client.chats.all()
                        var ids = []
                        var index = 0
                        chat.map(({ jid }) => {
                            ids.push(jid)
                        })
                        var loop = (i) => {
                            if (ids[i]) {
                                client.sendMessage(ids[i], value2, MessageType.text)
                                setTimeout(() => {
                                    loop(i + 1)
                                }, 4000)
                            }
                        }
                        loop(0)
                        await client.sendMessage(id, `sukses custom broadcast ke *${chat.length}* chat! ( with random delay )`, MessageType.text, { quoted: m })
                    } else {
                        client.sendMessage(id, 'command khusus owner!', MessageType.text, { quoted: m })
                    }
                }
                    break // 
                default:
                    var decomand = ['lapor', 'getchat', 'system']
                    var index = 1
                    var msg = `men-debug command aex, debuging harus disertakan argumen valid:\n\n`
                    decomand.map(cmd => {
                        msg += `.debug *${cmd}*\n`
                    })
                    client.sendMessage(id, `${msg}${copyright}`, MessageType.text, { quoted: m })
                    break
            }
            break
        case 'coba':
            if (nomor === owner) client.sendMessage(id, { text: `@${nomor.split("@s.whatsapp.net")[0]} sip kamu owner! hh`, contextInfo: {mentionedJid: [nomor]}, quoted: m }, MessageType.text)
            else client.sendMessage(id, { text: `@${nomor.split("@s.whatsapp.net")[0]} kamu bukan owner bot!`, contextInfo: {mentionedJid: [nomor]}, quoted: m }, MessageType.text)
            break
        case 'tagall':
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
            await client.sendMessage(id, _options, MessageType.text)
            break
/*        case 'adlhsy':
            var group  = await client.groupMetadata(id)
            var member = group['participants']
            var number = nomor.includes('s.whatsapp.net') ? nomor.replace(/s.whatsapp.net/, 'c.us') : nomor
            var isAdmin = member.filter(admin => admin.id === number)[0].isAdmin
/*            const options = {
                text: `@${nomor.split("@s.whatsapp.net")[0]} tagged!`,
                contextInfo: { mentionedJid: [nomor] }
            } // 
            if (!isAdmin) client.sendMessage(id, { text: `@${nomor.split("@s.whatsapp.net")[0]} kamu bukan admin!`, contextInfo: {mentionedJid: [nomor]} }, MessageType.text)
            else client.sendMessage(id, 'ok', MessageType.text)
            break
        case 'spadmin':
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
            await client.sendMessage(id, options, MessageType.text)
            break
        case 'owner':
            var group  = await client.groupMetadata(id)
            var member = group['participants']
            var owner = group['owner']
            var ids = [owner.replace('c.us', 's.whatsapp.net')]
            var msg = `owner group *${group.subject}* adalah: @${owner.split('@')[0]}`
            var options = {
                text: msg,
                contextInfo: { mentionedJid: ids },
                quoted: m
            }
            await client.sendMessage(id, options, MessageType.text)
            break
        case 'tagme':
            var options = {
                text: `@${nomor.split("@s.whatsapp.net")[0]} tagged!`,
                contextInfo: { mentionedJid: [nomor] }
            }
            client.sendMessage(id, options, MessageType.text)
            break
        case 'porn':
            textPorn(value)
                .then(data => {
                    const { result: porn } = data
                    imageToBase64(porn)
                       .then(_data => {
                           var buffer = Buffer.from(_data, 'base64')
                           client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: value })
                    })
                })
                .catch(err => {
                    console.log(err)
                })
            break
        case 'test':
            let i = 1
            const json = {
                text: 'mengirim text dengan format json.',
                id: i++
            }
            //client.sendJSON()
            break
        case 'tree':
            Archy()
               .then(data => {
                   var data = `*s* T r U k t U R c 0 d s\n\n${data}${copyright}`
                   client.sendMessage(id, data, MessageType.text, { quoted: m })
               })
            break
        case 'tourl':
            var image = await client.downloadAndSaveMediaMessage(m)
            client.sendMessage(id, '\`\`\`sedang mengconvert.. .\`\`\`', MessageType.text, { quoted: m })
            var data = fs.readFileSync('./' + image, 'base64')
            imgBB(data)
              .then(uri => {
                  imageToBase64(uri)
                     .then(_data => {
                          var buffer = Buffer.from(_data, 'base64')
                          client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: `success convert to url!!\n\n*${uri}*${copyright}`})
                      })
              })
            break*/
/*        case 'random':
            break
        case 'random':
            break
        case 'random':
            break
        case 'random':
            break
        case 'random':
            break
        case 'random':
            break
        case 'random':
            break*/
        default:
            break
    }
}

module.exports = CUSTOMHANDLER
