const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const http = require('http')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')

var routes = require('./routes')

const app = express()

// User defined merchantID for API. 
const merchantID = require('./merchantID')

// Database configuration file. 
var config = require('./_config')

if (merchantID !== false) {
  mongoose.connect(config.mongoURI[app.settings.env], function (err, res) {
    if (err) {
      console.log('Error connecting to the database. ' + err)
    } else {
      console.log('Connected to Database: ' + config.mongoURI[app.settings.env])
    }
  })

  app.use(express.static('public'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  app.use(expressValidator());
  app.use('/', routes);


  const port = process.env.PORT || 4000

  let server = app.listen(port, function () {
    console.log('Listening on port ' + port)
  })
} else {
  console.log('Please restart the server with a valid merchantID')
  return
}

module.exports = app