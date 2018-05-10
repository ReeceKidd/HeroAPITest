const express = require('express')
const routes = express();

//Controller imports
const eventsController = require('../controllers/eventsController')
const merchantController = require('../controllers/merchantController')
const productsController = require('../controllers/productsController')
const userController = require('../controllers/userController')

//Events local routes
routes.post('/create-event', eventsController.createEvent)
routes.get('/events/:merchantID', eventsController.summaryOfEvents)
routes.get('/events', eventsController.getAllEvents)

//Events API routes. 
routes.post('/api/create-event', eventsController.createEventAPI)
routes.get('/api/events/:merchantID', eventsController.summaryOfEventsAPI)

//Merchant Routes
routes.get('/merchants', merchantController.getMerchants)
routes.get('/merchants/:merchantID', merchantController.getSpecificMerchant)
routes.post('/register-merchant', merchantController.registerMerchant)

//Products local routes
routes.get('/products', productsController.getAllProducts)
routes.get('/products/:skuCode', productsController.getSpecificProduct)
routes.post('/register-product', productsController.registerProduct)

//Products API routes
routes.get('/api/products', productsController.getAllProductsAPI)
routes.get('/api/products/:skuCode', productsController.getProductAPI)

//User routes
routes.get('/users', userController.getUsers)
routes.get('/users/:userID', userController.getSpecificUser)
routes.post('/register-user', userController.registerUser)

module.exports = routes