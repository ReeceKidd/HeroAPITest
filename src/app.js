const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const http = require('http')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')

var routes = require('./routes')

const app = express()

// Database configuration file. 
var config = require('./_config')

mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err)
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env])
  }
})

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator());
app.use('/', routes);


const port = process.env.PORT || 4000

let server = app.listen(port, function() {
  console.log('Listening on port ' + port)
})

function stop() {
  server.close();
}

module.exports = app 
module.exports.stop = stop



