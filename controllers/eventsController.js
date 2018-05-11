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
TODO: Should really abstract these if statements to seperate files for each parameter being passed. 
*/
eventsController.createEvent = (req, res) => {

    let undefinedFields = checkUndefinedFields(req.body, ['type', 'data', 'merchantID', 'userID'])

    if (undefinedFields) {
        return res.status(950).send({
            error: 'Undefined field',
            message: undefinedFields
        })
    }

    /*
    Time is currently not included in request. 
    As the database has time stamps enabled. 
    */

    if (typeof req.body.type !== "string") {
        return res.status(600).send({
            error: 'Type error',
            message: "Type must be a string"
        })
    }

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

    /*
    Transaction events.
    The transaction events currently supported are transaction and product view. 
    */

    if (req.body.type === "transaction") {

        if (!Array.isArray(req.body.data.lineItems)) {
            return res.status(600).send({
                error: 'Type error',
                message: "Line items must be a string"
            })
        }

        if (typeof req.body.data.total !== "number") {
            return res.status(600).send({
                error: 'Type error',
                message: "Total must be a number"
            })
        }

        var products = {},
            apiProductInformationPromises = [];

        /*
        Line items inside of transaction events
        An additional check would be to see if a valid SKU code was entered
        for the existing products in the database. 
        */
        for (var x = 0; x < req.body.data.lineItems.length; x++) {

            if (req.body.data.lineItems[x].quantity === undefined) {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems object must contain quantity"
                })
            }

            if (typeof req.body.data.lineItems[x].quantity !== "number") {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems.quantity must be a number"
                })
            }

            if (req.body.data.lineItems[x].quantity < 0) {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems.quantity cannot be less than 0"
                })
            }

            /*
            If price is undefined it could potentially be retreived 
            using the SKU code. 
            */
            if (req.body.data.lineItems[x].price === undefined) {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems object must contain product price"
                })
            }

            if (typeof req.body.data.lineItems[x].price !== "number") {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems.price must be a number"
                })
            }

            if (typeof req.body.data.lineItems[x].price < 0) {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems.price cannot be less than 0."
                })
            }

            /*
            Sub total can be calculated on the back-end if this is 
            preffered. 
            */
            if (typeof req.body.data.lineItems[x].subTotal !== "number") {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems.subTotal must be a number"
                })
            }

            if (typeof req.body.data.lineItems[x].subTotal < 0) {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems.subTotal cannot be less than 0."
                })
            }

            if (req.body.data.lineItems[x].skuCode === undefined) {
                return res.status(600).send({
                    error: 'Type error',
                    message: "lineItems.skuCode cannot be undefined"
                })
            }

            if (req.body.data.lineItems[x].skuCode.length < 6) {
                return res.status(600).send({
                    error: 'Validation error',
                    message: "lineItems.skuCode cannot be less than 6 characters"
                })
            }

            if (req.body.data.lineItems[x].skuCode.length > 20) {
                return res.status(600).send({
                    error: 'Validation error',
                    message: "lineItems.skuCode cannot be greater than 20 characters"
                })
            }

            /*
            This gathers all the API requests that need to be made for each 
            of the lineItems products. 
            */
            let apiURL = heroDevAPI + req.body.data.lineItems[x].skuCode
            console.log(apiURL)
            apiProductInformationPromises.push(axios.get(apiURL).then((response) => {
                return response
            }).catch((err) => {
                //Most likely a product not found error. 
                return err.response
            }));

        } //End of for loop. 


        axios.all(apiProductInformationPromises).then(function (responses) {
            let updatedLineItems = {}
            console.log('Number of responses ' + responses.length)
            for (var x = 0; x < responses.length; x++) {

                for (var y = 0; y < req.body.data.lineItems.length; y++) {

                    if (responses[x].status === 200) {

                        if (responses[x].data.sku_code == req.body.data.lineItems[y].skuCode) {
                            updatedLineItems[y] = req.body.data.lineItems[y]
                            updatedLineItems[y].apiProductInfo = responses[x].data
                        } 
                    } else if(responses[x].status === 404) {
                        updatedLineItems[y] = req.body.data.lineItems[y]
                    }
                    
                }
            }
            return updatedLineItems

        }).then((lineItems) => {

            const transactionEvent = new ProductEvent({
                "type": req.body.type,
                "userID": req.body.userID,
                "merchantID": req.body.merchantID,
                "data": {
                    "lineItems": lineItems,
                    "total": req.body.data.total
                }
            })
            const saveTransactionEvent = new ProductEvent(transactionEvent)
            saveTransactionEvent.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        message: err,
                        error: 'Server faillure'
                    })
                } else {
                    return res.status(200).send({
                        message: 'Successfully created transaction event',
                        "event": saveTransactionEvent
                    })
                }
            });
        })
    } else if (req.body.type === "product-view") {

        if (req.body.data.product === undefined) {
            return res.status(600).send({
                error: 'Type error',
                message: "data.product must be defined"
            })
        }

        if (req.body.data.product === {}) {
            return res.status(600).send({
                error: 'Validation error',
                message: "data.product cannot be empty"
            })
        }

        if (req.body.data.product.skuCode === undefined) {
            return res.status(600).send({
                error: 'Validation error',
                message: "data.product.skuCode cannot be empty"
            })
        }

        if (typeof req.body.data.product.skuCode !== "string") {
            return res.status(600).send({
                error: 'Validation error',
                message: "data.product.skuCode must be a string"
            })
        }

        if (req.body.data.product.skuCode.length < 6) {
            return res.status(600).send({
                error: 'Validation error',
                message: "data.product.skuCode must be at least six characters"
            })
        }

        if (req.body.data.product.skuCode.length > 20) {
            return res.status(600).send({
                error: 'Validation error',
                message: "data.product.skuCode cannot be greater than 20 characters"
            })
        }

        if (req.body.data.location === undefined) {
            return res.status(600).send({
                error: 'Type error',
                message: "data.location cannot be undefined."
            })
        }

        if (typeof req.body.data.location !== "string") {
            return res.status(600).send({
                error: 'Type error',
                message: "data.location must be a string."
            })
        }

        if (req.body.data.location.length < 4) {
            return res.status(600).send({
                error: 'Validation error',
                message: "data.location cannot be undefined."
            })
        }

        const productViewEvent = new ProductEvent({
            "type": req.body.type,
            "userID": req.body.userID,
            "merchantID": req.body.merchantID,
            "data": {
                "location": req.body.data.location,
                "product": {
                    "skuCode": req.body.data.product.skuCode
                }
            }
        })

        console.log(productViewEvent)
        const saveProductViewEvent = new ProductEvent(productViewEvent)
        saveProductViewEvent.save(function (err) {
            if (err) {
                return res.status(500).json({
                    message: err,
                    error: 'Server faillure'
                })
            } else {
                return res.status(200).send({
                    message: 'Successfully created product-view event',
                    "event": saveProductViewEvent
                })
            }
        });

    } else {
        return res.status(600).send({
            error: 'Unsupported event',
            message: "Unsupported event: " + req.body.type + ' event must either be transaction or product-view'
        })
    }


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
            var numberOfTransactionEvents = 0
            var numberOfProductViewEvents = 0
            var uniqueUsers = new Set([]);
            var productViewUniqueUsers = new Set([])
            var transactionUniqueUsers = new Set([])

            for (var x = 0; x < events.length; x++) {
                if (!uniqueUsers.has(events[x].userID)) {
                    uniqueUsers.add(events[x].userID)
                }
                if (events[x].type === "transaction") {
                    numberOfTransactionEvents++
                    if (!transactionUniqueUsers.has(events[x].userID)) {
                        transactionUniqueUsers.add(events[x].userID)
                    }
                } else if (events[x].type === "product-view") {
                    numberOfProductViewEvents++
                    if (!productViewUniqueUsers.has(events[x].userID)) {
                        productViewUniqueUsers.add(events[x].userID)
                    }
                }
            }

            res.status(200).send({
                "total-events": numberOfTransactionEvents + numberOfProductViewEvents,
                "number-of-customers": totalUniqueUsers.size,
                "events-summary": [{
                        "type": "product-vew",
                        "total-events": numberOfProductViewEvents,
                        "number-of-customers": productViewUniqueUsers.size()
                    },
                    {
                        "type": "transaction",
                        "total-events": numberOfTransactionEvents,
                        "number-of-customers": transactionUniqueUsers.size(),
                        "total-value": events[x].total
                    }
                ]
            })
        }
    })
}

/*
Retreives a list of all events
*/
eventsController.getAllEvents = (req, res) => {
    var query = ProductEvent.find({}).select('-__v')

    query.exec(function (err, events) {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.send({
            events: events
        });
    })
}


module.exports = eventsController