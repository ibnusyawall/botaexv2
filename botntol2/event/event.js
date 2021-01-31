const fs = require('fs')
const util = require('util')
const path = require('path')
const FileType = require('file-type')
const fetch = require('node-fetch')
const { spawn } = require('child_process')
const { MessageType } = require('@adiwajshing/baileys')


exports.WAConnection = (_WAConnection) => {
    class WAConnection extends _WAConnection {
        constructor(...args) {
            super(...args)
            this.on('message-new', m => {
                let type = m.messageStubType
                let participants = m.messageStubParameters

                switch (type) {
                    case 27:
                    case 31:
                        this.emit('group-add', { m, type, participants })
                        break
                    case 28:
                    case 32:
                        this.emit('group-leave', { m, type, participants })
                        break
                    case 40:
                    case 41:
                    case 45:
                    case 46:
                        this.emit('call', {
                            type, participants,
                            isGroup: type == 45 || type == 46,
                            isVideo: type == 41 || type == 46
                        })
                        break
                }
            })
            if (!Array.isArray(this._events['CB:action,add:relay,message'])) this._events['CB:action,add:relay,message'] = [this._events['CB:action,add:relay,message']]
            else this._events['CB:action,add:relay,message'] = [this._events['CB:action,add:relay,message'].pop()]

            this._events['CB:action,add:relay,message'].unshift(async function (json) {
                try {
                    let m = json[2][0][2]
                    if (m.message && m.message.protocolMessage && m.message.protocolMessage.type == 0) {
                        let key = m.message.protocolMessage.key
                        let c = this.chats.get(key.remoteJid)
                        let a = c.messages.dict[`${key.id}|${key.fromMe ? 1 : 0}`]
                        let participant = key.fromMe ? this.user.jid : a.participant ? a.participant : key.remoteJid
                        let WAMSG = a.constructor
                        this.emit('message-delete', { key, participant, message: WAMSG.fromObject(WAMSG.toObject(a)) })
                    }
                } catch (e) {}
            })
        }

        async copyNForward(jid, message, idk = false, options = {}) {
            let mtype   = Object.keys(message.message)[0]
            let content = await this.generateForwardMessageContent(message, idk)
            let ctype   = Object.keys(content)[0]
            let context = {}
            if (mtype != MessageType.text) context = message.message[mtype].contextInfo
            content[ctype].contextInfo = {
                ...context,
                ...content[ctype].contextInfo
            }
            const waMessage = await this.prepareMessageFromContent(jid, content, options)
            await this.relayWAMessage(waMessage)
            return waMessage
        }

        async sendCMod(jid, message, text, sender, options = {}) {
            let copy  = await this.prepareMessageFromContent(jid, message, options)
            let mtype = Object.keys(message.message)[0]
            let msg   = copy.message[mtype]
            if (typeof msg == 'string') copy.message[mtype] = text || msg
            else if (msg.text) msg.text = text || msg.text
            else if (msg.caption) msg.caption = text || msg.captipn

            if (copy.participant) sender = copy.participant = sender || copy.participant
            else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant

            copy.key.fromMe = sender === this.user.jid

            const waMessage = this.prepareMessageFromContent(jid, copy, options)
            await this.relayWAMessage(waMessage)
            return waMessage
        }

        waitEvent(eventName, is = () => true, maxTries = 25) {
            return new Promise((resolve, reject) => {
                let tries = 0
                let on = (...args) => {
                    if (++tries > maxTries) reject('Max tries reached')
                    else if (is()) {
                        this.off(eventName, on)
                        resolve(...args)
                    }
                }
                this.on(eventName, on)
            })
        }

        formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        toJSON(json) {
            if (typeof json != 'object') return 'only object'

            return JSON.stringify(json, null, '\t')
        }

        getName(jid)  {
            let v = jid === this.user.jid ? this.user : this.contacts[jid] || { notify: jid.replace(/@.+/, '') }
            return v.name || v.vname || v.notify
        }
    }
}
