/*
This is where clients configure their merchantID for use in the api. 
*/
var argv = require('yargs')
    .options({
        'M': {
            alias: 'merchantID',
            default: '887447521318',
            describe: 'Valid merchantID is required for API',
            type: 'string',
            length: 10
        }
    })
    .argv;

if (argv.M.length !== 10) {
    console.log("merchantID must be ten characters in length")
    return false
}

module.exports = argv.M