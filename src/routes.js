var express = require('express')
const routes = express();

//Controller imports
const eventsController = require('../controllers/eventsController')
const merchantController = require('../controllers/merchantController')
const productsController = require('../controllers/productsController')
const userController = require('../controllers/userController')

//Events Routes
routes.post('/create-event', eventsController.createEvent)
//routes.get('/events/:merchantID', eventsController.getSummaryOfEvents)
//routes.get('/events', eventsController.getAllEvents)

//Merchant Routes
//routes.get('/get-all-merchants', merchantController.getMerchants)
//routes.get('/get-specific-merchant', merchantController.getSpecificMerchant)
routes.post('/register-merchant', merchantController.registerMerchant)

//Products Routes

routes.get('/products', productsController.getAllProducts)
routes.get('/products/:skuCode', productsController.getSpecificProduct)
routes.post('/register-product', productsController.registerProduct)

//User routes
routes.get('/get-all-users', userController.getUsers)
routes.get('/get-specific-user/:userID', userController.getSpecificUser)
routes.post('/register-user', userController.registerUser)

module.exports = routes