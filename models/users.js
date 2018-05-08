var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/*
To stay consistent with the design of the rest of the 
models userID is used here. However, an alternative would 
be to use the ObjectID that is generated by MongoDB. 
*/

const User = new Schema({
    firstName: String,
    lastName: String,
    postcode: String,
    email: {
        type: String,
        unique: true
    },
    userID: {
        type: String, 
        unique: true
    }
}, {
    timestamps: true
}, {
    collection: 'Users'
})

module.exports = mongoose.model('User', User)