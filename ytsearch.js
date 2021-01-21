var needle = require('needle')

var url = `https://api.i-tech.id/dl/yts?key=mLT2jw-S21P1C-OoXBgg-is2UXF-V22C3d&query=${process.argv[2]}`

needle(url, async (err, resp, body) => {
    try {
        const { id, title, thumbnail, url, channel, link_channel, verified, snippet, uploaded, duration, views } = body.result[0]
        console.log(title)
        var pp = `Hasil dari Pencarian YouTube *(hh)*\n\n👉 ID: ${id}\n👉 Judul: ${title}\n👉 Foto: ${thumbnail}\n👉 Link: ${url}\n👉 Channel: ${link_channel}\n👉 Durasi: ${duration}\n👉 Views: ${views}`
        console.log(pp)
    } catch (err) {
        console.log(err)
    }
})


case 'ytsearch':{
   if(args.lenght === 0) return aruga.reply(from, 'gunakan format #ytsearch <quer>\nContoh *#ytsearch twice tt*', id)
   const yt = body.slice(10)
   var url = `https://api.i-tech.id/dl/yts?key=SENSORED&query=${yt}`
   needle(url, async (err, resp, body) => {
       try {
           if (body.status === 'error') return aruga.reply(from, body.pesan, id)
           const { id, title, thumbnail, url, channel, link_channel, verified, snippet, uploaded, duration, views } = body.result[0]
           var pp = `Hasil dari Pencarian YouTube *(${yt})*\n\n👉 ID: ${id}\n👉 Judul: ${title}\n👉 Foto: ${thumbnail}\n👉 Link: ${url}\n👉 Channel: ${link_channel}\n👉 Durasi: ${duration}\n👉 Views: ${views}\n\n\n*YouTube Search By Shirayuki BOT*`
           aruga.reply(from, pp, id)
       } catch (err) {
           console.log(err)
       }
   })
}
break

   const apiyt = await get.get(`https://api.i-tech.id/dl/yts?key=SENSORED&query=${yt}`).json()
                 const { code, status, query, result } = apiyt
                 const { id, title, image, url, channel, duration, views } = result
                 if(apiyt.pesan) return aruga.reply(from, apiyt.pesan, id)
                 const pp = `Hasil dari Pencarian YouTube *(${query})*\n\n👉 ID: ${result[0].id}\n👉 Judul: ${result[0].title}\n👉 Foto: ${result[0].image}\n👉 Link: ${result[0].url}\n👉 Channel: ${result[0].channel}\n👉 Durasi: ${result[0].duration}\n👉 Views: ${result[0].views}\n\n👉 ID: ${result[1].id}\n👉 Judul: ${result[1].title}\n👉 Foto: ${result[1].image}\n👉 Link: ${result[1].url}\n👉 Channel: ${result[1].channel}\n👉 Durasi: ${result[1].duration}\n👉 Views: ${result[1].views}\n\n👉 ID: ${result[2].id}\n👉 Judul: ${result[2].title}\n👉 Foto: ${result[2].image}\n👉 Link: ${result[2].url}\n👉 Channel: ${result[2].channel}\n👉 Durasi: ${result[2].duration}\n👉 Views: ${result[2].views}\n\n👉 ID: ${result[3].id}\n👉 Judul: ${result[3].title}\n👉 Foto: ${result[3].image}\n👉 Link: ${result[3].url}\n👉 Channel: ${result[3].channel}\n👉 Durasi: ${result[3].duration}\n👉 Views: ${result[3].views}\n\n👉 ID: ${result[4].id}\n👉 Judul: ${result[4].title}\n👉 Foto: ${result[4].image}\n👉 Link: ${result[4].url}\n👉 Channel: ${result[4].channel}\n👉 Durasi: ${result[4].duration}\n👉 Views: ${result[4].views}\n\n👉 ID: ${result[5].id}\n👉 Judul: ${result[5].title}\n👉 Foto: ${result[5].image}\n👉 Link: ${result[5].url}\n👉 Channel: ${result[5].channel}\n👉 Durasi: ${result[5].duration}\n👉 Views: ${result[5].views}\n\n👉 ID: ${result[6].id}\n👉 Judul: ${result[6].title}\n👉 Foto: ${result[6].image}\n👉 Link: ${result[6].url}\n👉 Channel: ${result[6].channel}\n👉 Durasi: ${result[6].duration}\n👉 Views: ${result[6].views}\n\n👉 ID: ${result[7].id}\n👉 Judul: ${result[7].title}\n👉 Foto: ${result[7].image}\n👉 Link: ${result[7].url}\n👉 Channel: ${result[7].channel}\n👉 Durasi: ${result[7].duration}\n👉 Views: ${result[7].views}\n\n👉 ID: ${result[8].id}\n👉 Judul: ${result[8].title}\n👉 Foto: ${result[8].image}\n👉 Link: ${result[8].url}\n👉 Channel: ${result[8].channel}\n👉 Durasi: ${result[8].duration}\n👉 Views: ${result[8].views}\n\n👉 ID: ${result[9].id}\n👉 Judul: ${result[9].title}\n👉 Foto: ${result[9].image}\n👉 Link: ${result[9].url}\n👉 Channel: ${result[9].channel}\n👉 Durasi: ${result[9].duration}\n👉 Views: ${result[9].views}\n\n\n*YouTube Search By Shirayuki BOT*`
                aruga.reply(from, pp, id)
            }
                 break

