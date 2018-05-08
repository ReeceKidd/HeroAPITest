var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const Product = new Schema({
  skuCode: {
    type: String,
    unique: true
  },
  price: Number,
  name: String
}, {
  timestamps: true
}, {
  collection: 'Products'
})

module.exports = mongoose.model('Product', Product)