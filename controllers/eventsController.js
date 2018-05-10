const ProductEvent = require('../models/events')
const Product = require('../models/products')
const Merchant = require('../models/merchants')
const User = require('../models/users')

const axios = require('axios')

//Configuration for Hero API calls. 
const config = require('../src/apiConfiguration')

//heroAPI
const heroDevAPI = 'https://dev.backend.usehero.com/products/'

// Request validators
const checkUndefinedFields = require('./checkers/undefinedChecker')
const eventValidation = require('./validators/eventsValidation')

const eventsController = {}

/*
Create a new product event. 
*/
eventsController.createEvent = (req, res) => {

    var undefinedFields = checkUndefinedFields(req.body, ['type', 'lineItems', 'total', 'merchantID', 'userID'])

    if (undefinedFields) {
        return res.status(950).send({
            error: 'Undefined field',
            message: undefinedFields
        })
    }

    if (typeof req.body.type !== "string") {
        return res.status(600).send({
            error: 'Type error',
            message: "Type must be a string"
        })
    }

    if (!Array.isArray(req.body.lineItems)) {
        return res.status(600).send({
            error: 'Type error',
            message: "Line items must be a string"
        })
    }

    if (typeof req.body.total !== "number") {
        return res.status(600).send({
            error: 'Type error',
            message: "Total must be a number"
        })
    }

    /*
    Checks that each line items object has valid sku codes, quantities and prices. 
    An additional check would be to see if a valid SKU code was entered
    for the existing products in the database. 
    */

    for (var x = 0; x < req.body.lineItems.length; x++) {

        if (req.body.lineItems[x].quantity === undefined) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems object must contain quantity"
            })
        }

        if (typeof req.body.lineItems[x].quantity !== "number") {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.quantity must be a number"
            })
        }

        if (req.body.lineItems[x].quantity < 0) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.quantity cannot be less than 0"
            })
        }

        /*
        If price is undefined it could potentially be retreived 
        using the SKU code. 
        */
        if (req.body.lineItems[x].price === undefined) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems object must contain product price"
            })
        }

        if (typeof req.body.lineItems[x].price !== "number") {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.price must be a number"
            })
        }

        if (typeof req.body.lineItems[x].price < 0) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.price cannot be less than 0."
            })
        }

        /*
        Sub total can be calculated on the back-end if this is 
        preffered. 
        */
        if (typeof req.body.lineItems[x].subTotal !== "number") {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.subTotal must be a number"
            })
        }

        if (typeof req.body.lineItems[x].subTotal < 0) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.subTotal cannot be less than 0."
            })
        }

        if (req.body.lineItems[x].skuCode === undefined) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.skuCode cannot be undefined"
            })
        }

    } //End of for loop. 

    if (typeof req.body.merchantID !== "string") {
        return res.status(600).send({
            error: 'Type error',
            message: "Merchant must be a string"
        })
    }

    if (typeof req.body.userID !== "string") {
        return res.status(600).send({
            error: 'Type error',
            message: "User must be a string"
        })
    }

    /*
    For the purposes of this assignment transaction is only shown, 
    however refunds would also need to be supported in a live demo. 
    */
    if (req.body.type !== 'transaction') {
        return res.status(600).send({
            error: 'Unsupported option failure',
            message: 'API currently only supports transactions.'
        })
    }

    /*
    Further validation would be to check if the user and merchant
    existed in the database similarily to how the skuCOde was used to 
    check for valid products. 
    */

    var eventValidationError = eventValidation(req)
    if (eventValidationError) {
        return res.status(600).json({
            message: eventValidationError,
            error: 'Validation failure'
        })
    }

    const saveEvent = new ProductEvent(req.body)
    saveEvent.save(function (err) {
        if (err) {
            return res.status(500).json({
                message: err,
                error: 'Server faillure'
            })
        } else {
            return res.status(200).json({
                message: 'Successfully created event'
            })
        }
    });
}

/*
Create a new product event. 
*/
eventsController.createEventAPI = (req, res) => {

    var undefinedFields = checkUndefinedFields(req.body, ['type', 'lineItems', 'total', 'merchantID', 'userID'])

    if (undefinedFields) {
        return res.status(950).send({
            error: 'Undefined field',
            message: undefinedFields
        })
    }

    if (typeof req.body.type !== "string") {
        return res.status(600).send({
            error: 'Type error',
            message: "Type must be a string"
        })
    }

    if (!Array.isArray(req.body.lineItems)) {
        return res.status(600).send({
            error: 'Type error',
            message: "Line items must be a string"
        })
    }

    if (typeof req.body.total !== "number") {
        return res.status(600).send({
            error: 'Type error',
            message: "Total must be a number"
        })
    }

    /*
    Checks that each line items object has valid sku codes, quantities and prices. 
    An additional check would be to see if a valid SKU code was entered
    for the existing products in the database. 
    */

    for (var x = 0; x < req.body.lineItems.length; x++) {

        if (req.body.lineItems[x].quantity === undefined) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems object must contain quantity"
            })
        }

        if (typeof req.body.lineItems[x].quantity !== "number") {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.quantity must be a number"
            })
        }

        if (req.body.lineItems[x].quantity < 0) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.quantity cannot be less than 0"
            })
        }

        if (req.body.lineItems[x].skuCode === undefined) {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems object must contain skuCode"
            })
        }

        if (typeof req.body.lineItems[x].skuCode !== "string") {
            return res.status(600).send({
                error: 'Type error',
                message: "lineItems.skuCode must be a string skuCode"
            })
        }

        if (typeof req.body.lineItems[x].skuCode.length < 6) {
            return res.status(600).send({
                error: 'Validation error',
                message: "lineItems.skuCode cannot be less than 6 characters long"
            })
        }

        if (typeof req.body.lineItems[x].skuCode.length > 20) {
            return res.status(600).send({
                error: 'Validation error',
                message: "lineItems.skuCode cannot be greater than 20 characters long"
            })
        }

    } //End of for loop. 

    if (typeof req.body.merchantID !== "string") {
        return res.status(600).send({
            error: 'Type error',
            message: "Merchant must be a string"
        })
    }

    if (typeof req.body.userID !== "string") {
        return res.status(600).send({
            error: 'Type error',
            message: "User must be a string"
        })
    }

    /*
    For the purposes of this assignment transaction is only shown, 
    however refunds would also need to be supported in a live demo. 
    */
    if (req.body.type !== 'transaction') {
        return res.status(600).send({
            error: 'Unsupported option failure',
            message: 'API currently only supports transactions.'
        })
    }

    /*
    Further validation would be to check if the user and merchant
    existed in the database similarily to how the skuCOde was used to 
    check for valid products. 
    */

    var eventValidationError = eventValidation(req)
    if (eventValidationError) {
        return res.status(600).json({
            message: eventValidationError,
            error: 'Validation failure'
        })
    }

    const saveEvent = new ProductEvent(req.body)
    //saveEvent.API = true
    saveEvent.save(function (err) {
        if (err) {
            return res.status(500).json({
                message: err,
                error: 'Server faillure'
            })
        } else {
            return res.status(200).json({
                message: 'Successfully created event'
            })
        }
    });
}

eventsController.summaryOfEvents = (req, res) => {

    const merchantID = req.params.merchantID

    if (typeof merchantID !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'merchantID must be a string'
        })
    }

    if (merchantID.length !== 10) {
        return res.status(600).send({
            error: 'Validation failure',
            message: 'merchantID must be 10 characters long'
        })
    }

    var query = {
        'merchantID': merchantID
    }
    let eventsResult
    ProductEvent.find(query).lean().exec(function (err, events) {
        if (err) {
            return res.status(500).send({
                message: 'Server error',
                error: 'Server error'
            })
        } else if (events.length === 0) {
            return res.status(404).send({
                message: 'Could not find events.',
                error: 'Could not find events for merchants with ID: ' + merchantID
            })
        } else {

            res.status(200).send(events)
        }
    })
}

eventsController.summaryOfEventsAPI = (req, res) => {

    const merchantID = req.params.merchantID

    if (typeof merchantID !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'merchantID must be a string'
        })
    }

    if (merchantID.length !== 10) {
        return res.status(600).send({
            error: 'Validation failure',
            message: 'merchantID must be 10 characters long'
        })
    }

    var query = {
        'merchantID': merchantID
    }
    let lineItems = []
    ProductEvent.find(query).lean().exec(function (err, events) {
        if (err) {
            return res.status(500).send({
                message: 'Server error',
                error: 'Server error'
            })
        } else if (events.length === 0) {
            return res.status(404).send({
                message: 'Could not find events.',
                error: 'Could not find events for merchants with ID: ' + merchantID
            })
        } else {

            var products = {},
                promises = [];

            for (var x = 0; x < events[0].lineItems.length; x++) {
                //Need to gather all the API calls that need to be made. 
                //let apiURL = heroDevAPI + events[0].lineItems[x].skuCode
                let apiURL = heroDevAPI + '887447521318'
                promises.push(axios.get(apiURL))
            }

            console.log(promises)

            //Wait for all promises to return 
            axios.all(promises).then(function (results) {
                for (var x = 0; x < results.length; x++) {
                    console.log(results[x])
                    products[x] = results[x].data;
                }
                res.status(200).send({
                    events: events,
                    products: products
                })
            });



        }


    })
}



/*
Retreives a list of all products. 
*/
eventsController.getAllEvents = (req, res) => {
    var query = ProductEvent.find({}).select('-__v')

    query.exec(function (err, events) {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.send({
            events
        });
    })
}

module.exports = eventsController