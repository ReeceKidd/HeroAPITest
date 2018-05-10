//MerchantID is retreived from command line arguments. 
const merchantID = require('../src/merchantID')

const config = {
    headers: {
        'x-hero-merchant-id': merchantID
    }
};

module.exports = config