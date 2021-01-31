const moment = require("moment-timezone")
const fs = require("fs")
const imageToBase64 = require('image-to-base64')
const _ = require('lodash')

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
const imgBB = require(process.cwd() + '/lib/menu/imgBB')
const brainlySearch = require(process.cwd() + '/lib/menu/brainly')
const nulis = require(process.cwd() + '/lib/menu/nulis')
const Translate = require(process.cwd() + '/lib/menu/Translate')

const copyright = '\n\n----    ----\n*©aex-bot copyright | science 2019-2020*'

const AexBot = new ApiTech()

const DOWNLOADERHANDLER = async (client, m) => {
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
        case 'igtv':
            AexBot.downloader('igtv', 'username', value)
                .then(data => {
                    if (data.status === 'error') {
                        client.sendMessage(id, `username ${value} tidak ditemukan atau data tidak ditemukan`, MessageType.text, { quoted: m })
                    } else {
                        const {  result: igtv } = data
                        let hasil = `Instagran TV from *${value}*\n\nJumlah TV: *${igtv.length}*\n\n`
                        let index = 1
                        igtv.map(({ caption, url_video, url_img }) => {
                            hasil += `*${index++}*. ${_.isEmpty(caption) ? 'tidak ada caption' : caption}\n\nurl video: ${url_video}\n\nurl image: ${url_img}\n\n`
                        })
                        client.sendMessage(id, hasil, MessageType.text, { quoted: m })
                    }
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'igdl':
            AexBot.downloader('igdl', 'link', value)
                .then(data => {
                    const { result: igdl } = data
                    var result = `Instagram Donwloader\n\nError: *maaf igdl sedang gangguan.* ${copyright}`
                    imageToBase64(igdl)
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
        case 'stalk':
            AexBot.downloader('stalk', 'username', value)
                .then(data => {
                    if (data.status === 'error') {
                        client.sendMessage(id, `username *${value}* atau data tidak ditemukan.`)
                    } else {
                        const { username: u, name, followers, following, pos, bio, pic } = data
                        var result = `*INSTAGRAM STALKER*\n\nUsername: *${u}* ( ${name} )\n\nFollowers: ${followers}\nFollowing: ${following}\n\nJumlah Post: ${pos}\n\nBio: ${bio}${copyright}`
                        imageToBase64(pic)
                            .then(_data => {
                                var buffer = Buffer.from(_data, 'base64')
                                client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result })
                            })
                    }
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
/*        case 'hilih':
            AexBot.downloader('hilih', 'kata', value)
                .then(data => {
                    const { result: hilih } = data
                    var result = `${hilih}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'alay':
            AexBot.downloader('alay', 'kata', value)
                .then(data => {
                    const { result: alay } = data
                    var result = `${alay}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'ninja':
            AexBot.downloader('ninja', 'kata', value)
                .then(data => {
                    const { result: ninja } = data
                    var result = `${ninja}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'cool':
            AexBot.downloader('cool', 'text', value)
                .then(data => {
                    const { result: cool } = data
                    var result = `Cool Text: *${value}*${copyright}`
                    imageToBase64(cool)
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
        case 'fire':
            var image = await client.downloadAndSaveMediaMessage(m)
            var datas = fs.readFileSync('./' + image, 'base64')
            imgBB(datas)
                .then(uri => {
                     AexBot.downloader('picfire', 'pic', uri)
                        .then(data => {
                            const { result: fire } = data
                            var result = `Fired!..${copyright}`
                            imageToBase64(fire)
                                .then(_data => {
                                     var buffer = Buffer.from(_data, 'base64')
                                     client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: result, mimetype: Mimetype.gif })
                                 })
                        })
                        .catch(err => {
                             console.log(err)
                             console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                     })
                })
            break
        case 'nama':
            var gender = {'cewe': 'female', 'perempuan': 'female', 'cowo': 'male', 'laki-laki': 'male'}
            AexBot.downloader('nama', 'gender', gender[value])
                .then(data => {
                    const { result: nama } = data
                    var result = `Random N a M a *${value}*\n\nHasil: *${nama}*${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'lirik':
            AexBot.downloader('lirik', 'query', value)
                .then(data => {
                    const { result: lirik } = data
                    var result = `\`\`\`Lirik Lagu\`\`\` *${value}*\n\n${lirik}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'sholat':
            AexBot.downloader('sholat', 'kota', value)
                .then(data => {
                    const { status } = data
                    if (status === 'error') { client.sendMessage(id, `nama kota *${value}* tidak ditemukan.`) }
                    const { imsak, subuh, dhuha, dzuhur, ashar, isya, maghrib, tanggal, note } = data
                    var result = `Jadwal Sholat Kota *${value}*\n\nImsak: ${imsak}\nSubuh: ${subuh}\nDzuhur: ${dzuhur}\nAshar: ${ashar}\nMaghrib: ${maghrib}\nIsya: ${isya}\n\n_${note}_${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'short':
            AexBot.downloader('shorturl', 'link', value)
                .then(data => {
                    const { result: url } = data
                    var result = `original url: *${value}*\nshort url: *${url}*${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'ss':
            AexBot.downloader('ssweb', 'link', value)
                .then(data => {
                    const { result: ss } = data
                    var result = `screenshot dari web: *${value}*${copyright}`
                    imageToBase64(ss)
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
        case 'icfind':
            AexBot.downloader('icon', 'query', value)
                .then(data => {
                    const { status } = data
                    if (status === 'error') { client.sendMessage(id, `Icon *${value}* tidak ditemukan.`) }
                    const { result: icon } = data
                    let response = `List icon *${value}*:\n\n`
                    let index = 1
                    icon.map(({ title, author, image }) => {
                        response += `*${index++}*. ${title} ( _*${author}*_ )\nLink: ${image}\n\n`
                    })
                    var result = `${response}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'quran':
            if (value >= 114) { client.sendMessage(id, 'nomor surat hanya sampai 114.') }
            AexBot.downloader('quran', 'surat', value)
                .then(data => {
                    const { result: surat } = data
                    let response = `Al-Qur\'an Surat ke - *${value}*:\n\n`
                    let index = 1
                    surat.map(({ ar, id }) => {
                        response += `*${index++}*. ${ar}\n\n${id}\n\n`
                    })
                    var result = `${response}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'fact':
            AexBot.downloader('fact', 'animal', value)
                .then(data => {
                    const { result: fact } = data
                    var result = `animal fact: *${value}*\n\n _${fact}_${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'qr':
            AexBot.downloader('qr', 'query', value)
                .then(data => {
                    const { result: qr } = data
                    var result = `*QR CODE MAKER*\n\nstatus: berhasil!\ntext: _${value}_ ${copyright}`
                    imageToBase64(qr)
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
        case 'brainly':
            brainlySearch(value)
               .then(data => {
                   client.sendMessage(id, data, MessageType.text, { quoted: m })
               })
               .catch(err => {
                   client.sendMessage(id, err, MessageType.text)
               })
            break
        case 'wiki':
            AexBot.downloader('wiki', 'query', value)
                .then(data => {
                    const { result: wiki } = data
                    var result = `pencarian ${value}:berdasarkan data wikipedia:\n\n ${wiki}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'umur':
            AexBot.downloader('umur', 'nama', value)
                .then(data => {
                    const { umur } = data
                    var result = `sepertinya umur *${value}* ${umur} tahun? 🤔 ${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'nulis':
            nulis(value)
                .then(data => {
                    var result = `*Berhasil menulis!* ${copyright}`
                    let index = 1
                    data.map(link => {
                        imageToBase64(link)
                            .then(_data => {
                                var buffer = Buffer.from(_data, 'base64')
                                client.sendMessage(id, buffer, MessageType.image, { quoted: m, caption: `Lembar ke *${index++}* dari total lembar: ${data.length}\n\n` + result })
                            })
                    })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'translate':
 //           Translate(vlaye)
            break*/
        default:
            console.log(`[ ${time} ] : [ ${id.split("@s.whatsapp.net")[0]} ] : UNKNOWN COMMAND.`);
            break
    }
}


module.exports = DOWNLOADERHANDLER
