const brainly = require('brainly-scraper')


const brainlySearch = (query) => {
    return new Promise((resolve, reject) => {
        if (typeof query == 'undefined') { reject('masukan query.') }
        brainly(query)
            .then(res => {
                let response = `\`\`\`BRAINLY SCRAPER\`\`\`\n\nPertanyaan: *${query}*\nTotal jawaban: *${res.data.length}*\n\n`
                let index = 1;
                res.data.map(({ pertanyaan: a, jawaban: b }) => {
                    response += `\n-*${index++}*-.\n\n*Pertanyaan*: ${a}\n\n*Jawaban*: ${b[0]['text']}\n\n`
                })
                resolve(response)
            })
    })
}

/*brainlySearch(process.argv.splice(2).join(' '))
    .then(data => console.log(data))
*/
module.exports = brainlySearch
