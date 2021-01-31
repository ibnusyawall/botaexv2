const qrcode = require("qrcode-terminal")
const fs = require("fs")

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

const client = new WAConnection()

client.on('qr', qr => {
   qrcode.generate(qr, { small: true })
   console.log(`[ ! ] Scan kode qr dengan whatsapp!`)
})

client.on('credentials-updated', () => {
   const authInfo = client.base64EncodedAuthInfo()
   console.log(`credentials updated!`)

   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})

fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')

client.connect();


//  client.on('message-status-update', json => {
//        // ur code
//  })


//  client.loadAllUnreadMessages()

client.on('message-new', async (m) => {
    const { formMe: saya, remoteJid: id } = m.key
    const { conversation: body } = m.message

    if (saya) {
        if (body.includes('.cek')) {
            client.sendMessage(id, 'paste respon disini', MessageType.text, { quoted: m })
        }
    }
})
