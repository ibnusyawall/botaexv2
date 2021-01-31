var input = process.argv.splice(2).join` `

var parse = i => parseInt(i)

var res = `
    ${input} + ${input} = ${parse(input) + parse(input)}
    ${input} x ${input} = ${parse(input) * parse(input)}
    ${input} : ${input} = ${parse(input) / parse(input)}
    ${input} - ${input} = ${parse(input) - parse(input)}
    ${input}^${input} = ${parse(input)**parse(input)}
`

console.log(res)
