var Canvas = require('canvacord')
var loging = console.log
/*
var hasil = Canvas.Canvas.trigger('undefined.jpeg').then(data => Canvas.write(data, `canvasbang.png`)).catch(err => console.log(err) )
*/

//var Welcomer = require('./../node_modules/canvacord/src/Welcomer')

var wellcome = new Canvas.Welcomer()
/*    .setUsername('syawal')
    .setDiscriminator("0007")
    .setGuildName("Snowflake Studio")*/

wellcome.build()
    .then(buffer => {
         Canvas.write(buffer, 'wellcome.png')
loging('sukses')
//         client.sendMessage(from, buffer, image, { quoted: m })
    })
//loging(hasil)
//Canvas.write(hasil, `canvasbang.png`)
