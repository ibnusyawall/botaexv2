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
const imgBB = require(process.cwd() + '/lib/menu/imgBB')
const brainlySearch = require(process.cwd() + '/lib/menu/brainly')
const nulis = require(process.cwd() + '/lib/menu/nulis')
const Translate = require(process.cwd() + '/lib/menu/Translate')

const copyright = '\n\n----    ----\n*©aex-bot copyright | science 2019-2020*'

const AexBot = new ApiTech()

const TPARAM1HANDLER = async (client, m) => {
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
        case 'jam':
            AexBot.toolsParam1('jam', 'kota', value)
                .then(data => {
                    const { timezone, date, time, latitude: lat, longitude: long } = data
                    var maps = 'https://www.google.com/maps/@' + lat + ',' + long
                    var result = `j a M Lo o k u P (${value})\n\nTimezone: *${timezone}*\nDate: *${date}* [${time}]\n\nLatitude: ${lat}\nLongtitude: ${long}\n\nGoogle Maps Link: ${maps}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'cuaca':
            AexBot.toolsParam1('cuaca', 'kota', value)
                .then(data => {
                    const { tempat, cuaca, deskripsi, suhu, kelembapan, udara, angin } = data
                    var result = `Cuaca daerah *{tempat}*\n\nCuaca: ${cuaca} (${deskripsi})\nSuhu: ${suhu}\nKelembapan: ${kelembapan}\n\nUdara: ${udara}\nAngin: ${angin}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'chord':
            AexBot.toolsParam1('chord', 'query', value)
                .then(data => {
                    const { result: chord } = data
                    var result = `Chord Lagu *${value}*\n\n${chord}${copyright}`
                    client.sendMessage(id, result, MessageType.text, { quoted: m })
                })
                .catch(err => {
                    console.log(err)
                    console.log(`[ ${time} ] : [ QUOTES-ANIME ] Error!`)
                })
            break
        case 'hilih':
            AexBot.toolsParam1('hilih', 'kata', value)
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
            AexBot.toolsParam1('alay', 'kata', value)
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
            AexBot.toolsParam1('ninja', 'kata', value)
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
            AexBot.toolsParam1('cool', 'text', value)
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
                     AexBot.toolsParam1('picfire', 'pic', uri)
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
            AexBot.toolsParam1('nama', 'gender', gender[value])
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
            AexBot.toolsParam1('lirik', 'query', value)
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
            AexBot.toolsParam1('sholat', 'kota', value)
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
            AexBot.toolsParam1('shorturl', 'link', value)
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
            AexBot.toolsParam1('ssweb', 'link', value)
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
            AexBot.toolsParam1('icon', 'query', value)
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
            AexBot.toolsParam1('quran', 'surat', value)
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
            AexBot.toolsParam1('fact', 'animal', value)
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
            AexBot.toolsParam1('qr', 'query', value)
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
            AexBot.toolsParam1('wiki', 'query', value)
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
            AexBot.toolsParam1('umur', 'nama', value)
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
            break
        default:
            console.log(`[ ${time} ] : [ ${id.split("@s.whatsapp.net")[0]} ] : UNKNOWN COMMAND.`);
            break
    }
}


module.exports = TPARAM1HANDLER
