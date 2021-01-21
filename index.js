const qrcode = require("qrcode-terminal")
const fs = require("fs")
var _ = require('lodash')
var moment = require('moment-timezone')
const imageToBase64 = require('image-to-base64')

const UNITTESTING = require('./handler/UnitTesting')
const UNITTESTING2 = require('./handler/UnitTesting2')
const UNITTESTING3 = require('./handler/UnitTesting3')
const UNITTESTING4 = require('./handler/UnitTesting4')
const UNITTESTING5 = require('./handler/UnitTesting5')

const { insertGroup, usersGroupInfo, checkGroupUser, countGroupUser } = require(process.cwd() + '/database/groups')

const
{
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
} = require("@adiwajshing/baileys")


const {
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

const { insertCist, countCmdUser, deleteCmdUser, checkCmdUser } = require(process.cwd() + '/database/level')

const { exec } = require("child_process")

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ! ] Scan kode qr dengan whatsapp!`)
})

block = []
prefix = '.'
const copyright = '\n\n----    ----\n*©aex-bot copyright | science 2019-2020*'

client.on('CB:Blocklist', json => {
    if (block.length > 2) return
    for (let i of json[1].blocklist) {
        block.push(i.replace('c.us','s.whatsapp.net'))
    }
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./syawal.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./syawal.json') && client.loadAuthInfo('./syawal.json')

client.connect()

Array.prototype.random = function() {
    var ran = this[Math.floor(Math.random() * this.length)]
    return Math.floor(Math.random() * 10) + ran
}

console.log([1, 2, 3].random())

client.on('group-participants-update', async (anu) => {
    var isWellcome     = await checkGroupUser(anu.jid)
    var isGroupDetails = isWellcome ? await usersGroupInfo(anu.jid) : false
    if (!isWellcome && isGroupDetails.status === 'off') return
    try {
        const mdata = await client.groupMetadata(anu.jid)
        console.log(anu)
        if (anu.action == 'add') {
               num = anu.participants[0]
               try {
                   ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
               } catch {
                   ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
               }
               teks = `Halo @${num.split('@')[0]}\n\n${isGroupDetails.message.length <= 0 ? 'selamat datang di group' + mdata.subject : isGroupDetails.message}`
               imageToBase64(ppimg)
                   .then(data => {
                        var buffer = Buffer.from(data, 'base64')
                        client.sendMessage(mdata.id, buffer, MessageType.image, { caption: teks, contextInfo: { mentionedJid: [num] }})
               })
        } else if (anu.action == 'remove') {
               num = anu.participants[0]
               try {
                    ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
               } catch {
                    ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
               }
               teks = `Bye @${num.split('@')[0]}👋`
               imageToBase64(ppimg)
                   .then(data => {
                       var buffer = Buffer.from(data, 'base64')
                       client.sendMessage(mdata.id, buffer, MessageType.image, { caption: teks, contextInfo: { mentionedJid: [num] }})
               })
        }
    } catch (e) {
               console.log('Error : %s', e)
    }
})

client.on('message-new', async (m) => {
    global.prefix
    global.block

    var tojson = j => JSON.stringify(j, null, '\t')
    const from = m.key.remoteJid
    const isGroup = from.endsWith('@g.us')

    const id = isGroup ? m.participant : m.key.remoteJid

    var type = Object.keys(m.message)[0]
    const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType

    body = (type === 'conversation' && m.message.conversation.startsWith(prefix)) ? m.message.conversation : (type == 'imageMessage') && m.message.imageMessage.caption.startsWith(prefix) ? m.message.imageMessage.caption : (type == 'videoMessage') && m.message.videoMessage.caption.startsWith(prefix) ? m.message.videoMessage.caption : (type == 'extendedTextMessage') && m.message.extendedTextMessage.text.startsWith(prefix) ? m.message.extendedTextMessage.text : ''
    budy = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''

    const args = body.trim().split(/ +/)

    const { formMe: saya } = m.key

    var isUser = await checkUser(id)

    user = await usersInfo(id)
    var _user = user != false ? user.details.xp : 0

    //user != false ? user : ''

    var save = new Map()

    const reply = (f, msg) => client.sendMessage(f, msg, text, { quoted: m })

    save.set(id)

    _.isEmpty(save.get(id)) ? save.set(id, [args.join(' ')]) : save.set(id, [args.join(' '), ...save.get(id)])

    

    

    if (text.includes('.block list')) {
         var msg = `List block number length: ${block.length}\n\n`
         var index = 1
         block.map(data => {
             msg += `*${index++}*. ${data.split(/@/)[0]}\n`
         })
         client.sendMessage(id, msg + copyright, MessageType.text, { quoted: m })
    }

    var nomor = '6282299265151@s.whatsapp.net'
    var group = "62895413001925-1606544568@g.us" // TERMUX CMD BOT WHATSAPP


    console.log(JSON.stringify(m, null, '\t'))
    console.log(Object.keys(m.message))
    UNITTESTING(client, m)
    UNITTESTING2(client, m)
    UNITTESTING3(client, m)
    UNITTESTING4(client, m)
    UNITTESTING5(client, m)
})
