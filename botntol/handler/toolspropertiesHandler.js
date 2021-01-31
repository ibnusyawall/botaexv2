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

const TPROPERTIESHANDLER = async (client, m) => {
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
        case 'quotes':
            AexBot.toolsProperties('quotes')
                .then(data => {
                    const { result: quotes } = data
                    var result = `${quotes}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'quotes2':
            AexBot.toolsProperties('quotes2')
                .then(data => {
                    const { result: quotes } = data
                    var result = `${quotes}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'bmkg':
            AexBot.toolsProperties('bmkg')
                .then(data => {
                    const { Tanggal, Jam, Kedalaman, Wilayah1, Wilayah2, Wilayah3, Potensi } = data.result.Infogempa.gempa
                    var result = `*Info Gempa Terkini!*\n\nTanggal: ${Tanggal} ( *${Jam}* )\nKedalaman: ${Kedalaman}\nCase Wilayah:\n\n${Wilayah1}\n${Wilayah2}\n${Wilayah3}\n\n!! *${Potensi}*${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'asu':
            AexBot.toolsProperties('asu')
                .then(data => {
                    const { result: asu } = data
                    var result = `Random A s U${copyright}`
                    imageToBase64(asu)
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
        case 'miaw':
            AexBot.toolsProperties('cat')
                .then(data => {
                    const { result: miaw } = data
                    var result = `Random M i A w${copyright}`
                    imageToBase64(miaw)
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
        case 'rubah':
            AexBot.toolsProperties('foxes')
                .then(data => {
                    const { result: rubah } = data
                    var result = `Random R u b A h${copyright}`
                    imageToBase64(rubah)
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
        case 'mbe':
            AexBot.toolsProperties('goat')
                .then(data => {
                    const { result: mbe } = data
                    var result = `Random K a m B i N g${copyright}`
                    imageToBase64(mbe)
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
        case 'fakta':
            AexBot.toolsProperties('fakta')
                .then(data => {
                    const { result: fakta } = data
                    var result = `Fakta Unik!!\n${fakta}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'ptl':
            AexBot.toolsProperties('gambar')
                .then(data => {
                    const { result: ptl } = data
                    var kata = ['hai', 'halo', 'hola', 'syg']
                    var rand = kata[Math.floor(Math.random() * kata.length)]
                    var result = `${rand}${copyright}`
                    imageToBase64(ptl)
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
        case 'togel':
            AexBot.toolsProperties('togel')
                .then(data => {
                    const { result: togel } = data
                    var rand = togel[Math.floor(Math.random() * togel.length )]
                    const { Negara, Senin, Selasa, Rabu, Kamis, Jumat, Sabtu } = rand
                    var result = `*Togel of Today!*\n\nNegara: *${Negara}*\n\nSenin: ${Senin}\nSelasa: ${Selasa}\nRabu: ${Rabu}\nKamis: ${Kamis}\nJumat: ${Jumat}\nSabtu: ${Sabtu}${copyright}`
                    client.sendJSON(rand)
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        /*case 'randomhug':
            AexBot.toolsProperties('hug')
                .then(data => {

                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'randomnsfw':
            AexBot.toolsProperties('nsfwneko')
                .then(data => {
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'jurnalotaku':
            AexBot.toolsProperties('otaku')
                .then(data => {
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break*/
        default:
            console.log(`[ ${time} ] : [ ${id.split("@s.whatsapp.net")[0]} ] : UNKNOWN COMMAND.`);
            break
    }
}


module.exports = TPROPERTIESHANDLER
