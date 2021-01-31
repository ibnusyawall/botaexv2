case 'gimage':
    gh = body.slice(6)
    qwery = gh.split("|")[1];
    jum = gh.split("|")[2];
    if (!qwery) return reply(`Kirim perintah *${prefix}gimage |Query|Jumlah*, contoh = ${prefix}gimage |loli|3`)
    if (!jum) return reply(`Jumlah gambar diperlukan, contoh = ${prefix}gimage |loli|3`)
    if (jum >= 5) return reply('Jumlah terlalu banyak! Max 4')
    var gis = require('g-i-s');
    var opts = {
        searchTerm: qwery
    };
    gis(opts, logResults);
    function logResults(error, results) {
         if (error) {
              reply('Maaf, Fitur Sedang Error')
         } else {
              const item = results.slice(0, jum)
              item.forEach(async (res) => {
                   console.log(res)
                   buffer = await getBuffer(res.url)
              })
         }
    }
    client.sendMessage(from, buffer, null, image, {quoted: mek, caption: 'Noh Dah Jadi'})
break



case 'gimage': 
				    gh = body.slice(6)
                    qwery = gh.split("|")[1];
                    jum = gh.split("|")[2];
                    if (!qwery) return reply(`Kirim perintah *${prefix}gimage |Query|Jumlah*, contoh = ${prefix}gimage |loli|3`)
                    if (!jum) return reply(`Jumlah gambar diperlukan, contoh = ${prefix}gimage |loli|3`)
                    if (jum >= 5) return reply('Jumlah terlalu banyak! Max 4')
                    var gis = require('g-i-s');
                    var opts = {
                            searchTerm: qwery
                        };
                        gis(opts, logResults);
                        function logResults(error, results) {
                        	if (error) {
                        	     reply('Maaf, Fitur Sedang Error')
                        } else {
                                const item = results.slice(0, jum)
                                item.forEach(async (res) => {
                                	console.log(res)
                                    buffer = await getBuffer(res.url)
                                })
                            }
                        }
                    client.sendMessage(from, buffer, null, image, {quoted: mek, caption: 'Noh Dah Jadi'})
                    break
