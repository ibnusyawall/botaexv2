const needle = require('needle')

const options = {
    headers: {
        "Cookie": "PHPSESSID=eceaaf2566d769c2c75a34cf3b92edea",
        "Content-Type": "application/x-www-form-urlencoded"
    }
}

var url = "https://api.i-tech.id/settings/profile"

needle.post(url, { ips: process.argv[2], password: 'I24122002u', ip: '' }, options, async (err, resp, body) => {
    try {
        if (resp.statusCode !== 200) {
            console.log('[!] session destroyed!')
        } else {
            console.log(`[√] ip berhasil diubah: ${process.argv[2]}`)
        }
    } catch(err) {
        console.log(err)
    }
})
