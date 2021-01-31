const moment = require("moment-timezone")
const fs = require("fs")
const imageToBase64 = require('image-to-base64')


const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const arrayBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const bulan = arrayBulan[moment().format('MM') - 1]

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

const { exec } = require("child_process")

const ApiTech = require(process.cwd() + '/lib/menu/index')

const copyright = '\n\n----    ----\n*©aex-bot copyright | science 2019-2020*'

const AexBot = new ApiTech()

const ANIMHANDLER = async (client, m) => {
    const messageContent = m.message
    const text = m.message.conversation
    const messageType = Object.keys(messageContent)[0]

    const re = /[\#\!\@\.]/

    const value = text.split(' ').splice(1).join(' ')

    let id = m.key.remoteJid
    let imageMessage = m.message.imageMessage

    const prefix = messageType === 'imageMessage' ? imageMessage.caption.split(' ')[0].split(re)[1] : text.split(' ')[0].split(re)[1] // multiple prefix

    console.log(`[ ${time} ] : [ ${id.split("@s.whatsapp.net")[0]} ] : ${text}`);

    switch (prefix) {
        case 'quotesnime':
            AexBot.anim('quotes')
                .then(data => {
                    const { anime, character, quotes } = data
                    var result = `Anime: ${anime}\nCharacter: ${character}\n\n${quotes}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomwibu':
            AexBot.anim('wibu')
                .then(data => {
                    const { nama, deskripsi, foto, sumber } = data
                    var result = `Nama: *${nama}*\n\nDeskripsi: ${deskripsi}\n${sumber}${copyright}`
                    imageToBase64(foto)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'nekonime':
            AexBot.anim('neko')
                .then(data => {
                    const { result: neko } = data
                    var result = `Nekonime!!${copyright}`
                    imageToBase64(neko)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'nekonime2':
            AexBot.anim('neko2')
                .then(data => {
                    const { result: neko2 } = data
                    var result = `Nekonime!!${copyright}`
                    imageToBase64(neko2)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomanim':
            AexBot.anim('anime')
                .then(data => {
                    const { result: anim } = data
                    var result = `Bbaakaa>\<!!${copyright}`
                    imageToBase64(anim)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomanim2':
            AexBot.anim('anime2')
                .then(data => {
                    const { result: anim2 } = data
                    var result = `Baka>\<${copyright}`
                    imageToBase64(anim2)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomhentai':
            AexBot.anim('hentai')
                .then(data => {
                    const { result: hentai } = data
                    var result = `Hentai${copyright}`
                    imageToBase64(hentai)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomyuri':
            AexBot.anim('yuri')
                .then(data => {
                    const { result: yuri } = data
                    var result = `Random YURI${copyright}`
                    imageToBase64(yuri)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomdva':
            AexBot.anim('dva')
                .then(data => {
                    const { result: dva } = data
                    var result = `Random DVA${copyright}`
                    imageToBase64(dva)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomtrap':
            AexBot.anim('trap')
                .then(data => {
                    const { result: trap } = data
                    var result = `Random T R a P${copyright}`
                    imageToBase64(trap)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomhug':
            AexBot.anim('hug')
                .then(data => {
                    const { result: hug } = data
                    var result = `Random H u G${copyright}`
                    imageToBase64(hug)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomnsfw':
            AexBot.anim('nsfwneko')
                .then(data => {
                    const { result: nswf } = data
                    var result = `Random N s F w${copyright}`
                    imageToBase64(nswf)
                        .then(_data => {
                            var buffer = Buffer.from(_data, 'base64')
                            client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                        })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'jurnalotaku':
            AexBot.anim('otaku')
                .then(data => {
                    const {} = data
                    var result = ``
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        default:
            console.log(`[ ${time} ] : [ ${id.split("@s.whatsapp.net")[0]} ] : UNKNOWN COMMAND.`);
            break
    }
}


module.exports = ANIMHANDLER
