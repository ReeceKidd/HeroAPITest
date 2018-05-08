var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const Merchant = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    merchantID: String,
    postcode: String
}, {
    timestamps: true
}, {
    collection: 'Merchants'
})

module.exports = mongoose.model('Merchant', Merchant)