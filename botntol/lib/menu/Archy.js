const archy = require('archy')

const Archy = () => new Promise((resolve, reject) => {
    var struktur = archy({
        label: 'botntol',
        nodes: [
           'assets',
           {
              label: 'database',
              nodes: ['index.js']
           },
           {
                label: 'handler',
                nodes: ['animHandler.js', 'downloaderHandler.js', 'customHandler.js', 'toolsHandler.js', 'index.js']
           },
           {
                label: 'lib',
                nodes: ['index.js']
           },
           'node_modules',
           '.env',
           'DEBUG.js',
           'index.js',
           'package.json',
           'package-lock.json',
           'syawal.json'
        ]
    })
    resolve(`\`\`\`${struktur}\`\`\``)
})

module.exports = Archy
