case 'level':
                                case 'rank':
                        const name2 = await dani.contacts[sender] != undefined ? dani.contacts[sender].vname || dani.contacts[sender].notify : undefined
                                        try {
                                         ppimg = await dani.getProfilePicture(`${semder.split('@')[0]}@c.us`)
                                         } catch {
                                         ppimg = 'https://i.ibb.co/2KKcSZv/20210130-093639.png'
                                        }
                                const currrentLevel = getLevelingLevel(sender)
                                const requirredXp = 5000 * (Math.pow(2, currrentLevel) - 1)
                                var userrXp = getLevelingXp(sender)
                                var userrLevel = getLevelingLevel(sender)
                                const img = `https://i.ibb.co/2KKcSZv/20210130-093639.png`
                                const rank = new canvacord.Rank()
                                    .setAvatar(ppimg)
                                    .setCurrentXP(userrXp)
                                    .setRequiredXP(requirredXp)
                                    .setLevel(userrLevel)
                                    .setStatus("online")
                                    .setProgressBar("#FFFFFF", "COLOR")
                                    .setBackground("IMAGE", "https://i.ibb.co/YB4MF0F/20210130-172035.png")
                                    .setUsername(`${name2}`)
                                    .setDiscriminator("0001");
                                        rank.build()
                                            .then(buffer => {
                                                canvacord.write(buffer, `${name2}.png`)
                                    dani.sendMessage(from, buffer, image, {quoted: mek})
                                        })
                                        break
