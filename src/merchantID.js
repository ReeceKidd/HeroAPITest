/*
This is where clients configure their merchantID for use in the api. 
*/
var argv = require('yargs')
    .options({
        'H': {
            alias: 'merchantID',
            demandOption: true,
            describe: 'Valid merchantID is required for API',
            type: 'string',
            length: 10
        }
    })
    .argv;

console.log('Length: ' + argv.H.length)
console.log(argv.H)

if (argv.H.length !== 10) {
    console.log("merchantID must be ten characters in length")
    return false
}

module.exports = argv.H