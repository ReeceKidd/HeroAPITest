var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/*
An alternative approach here might have been to reference the ObjectID's
designated by MongoDB. However, the merhantID's where used instead. 
*/

const ProductEvent = new Schema({
    type: String,
    data: Object,
    time: String,
    merchantID: String,
    userID: String,
    location: String
},  {
    timestamps: true
}, {
    collection: 'Events'
})

module.exports = mongoose.model('ProductEvent', ProductEvent)