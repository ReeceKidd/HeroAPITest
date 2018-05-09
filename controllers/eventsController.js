const ProductEvent = require('../models/events')
const Product = require('../models/products')
const Merchant = require('../models/merchants')
const User = require('../models/users')

// Request validators
const checkUndefinedFields = require('./checkers/undefinedChecker')
const eventValidation = require('./validators/eventsValidation')

const eventsController = {}

/*
Create a new product event. 
*/
eventsController.createEvent = (req, res) => {

    var undefinedFields = checkUndefinedFields(req.body, ['type', 'lineItems', 'merchant', 'user'])

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

    /*
    Checks that each line items object has an sku code and a quantity. 
    An additional check would be to see if a valid SKU code was entered
    for the existing products in the database. 
    */

    let productFound

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
                message: "lineItems.skuCode cannot be undefined"
            })
        }

        let skuCode = req.body.lineItems[x].skuCode

        //Checks to see if skuCode exists in database. 
        Product.find({
            skuCode: req.body.lineItems[x].skuCode
        }, function (err, product) {
            if (err) {
                res.status(500).send({
                    error: 'Server error',
                    message: err
                })
            }
            if (product.length === 0) {
                productFound = false
            }
        });

    } //End of for loop. 

    if (productFound === false) {
        return res.status(600).send({
            error: 'No product exists',
            message: 'No product exists with skuCode: ' + skuCode
        })
    }

    if (typeof req.body.merchant !== "string") {
        return res.status(600).send({
            error: 'Type error',
            message: "Merchant must be a string"
        })
    }

    if (typeof req.body.user !== "string") {
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

module.exports = eventsController