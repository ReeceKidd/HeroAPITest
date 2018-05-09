const Merchant = require('../models/merchants')

//Request validators. 
const merchantValidation = require('./validators/merchantValidation')
const checkUndefinedFields = require('./checkers/undefinedChecker')

const merchantController = {}

merchantController.registerMerchant = (req, res) => {

    /*
    MerchantID is passed to this API request, implying that another servive
    will be used to generate it. Alternative approaches to this are to use the
    ObjectID generated by MongoDb or to have this API call generate a random 
    sequence of characters. As it was not outlined in the instructions the 
    assumption is that a random unique merchant ID will be passed here.   
    */

    var undefinedFields = checkUndefinedFields(req.body, [
        'name',
        'email',
        'postcode',
        'merchantID'
    ])

    if (undefinedFields) {
        return res.status(950).send({
            error: 'Undefined field',
            message: undefinedFields
        })
    }


    if (typeof req.body.name !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'First name must be a string'
        })
    }

    if (typeof req.body.email !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'Email must be a string'
        })
    }

    if (typeof req.body.postcode !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'Postcode must be a string'
        })
    }

    if(typeof req.body.merchantID !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'MerchantID must be a string'
        })
    }

    var merchantValidationError = merchantValidation(req)
    if (merchantValidationError) {
        return res.status(600).json({
            message: merchantValidationError,
            error: 'Validation failure'
        })
    }

        const saveMerchant = new Merchant(req.body)
        saveMerchant.save(function (err) {
            if (err) {
                return res.status(500).json({
                    message: err,
                    error: 'Server faillure'
                })
            } else {
                return res.status(200).json({
                    message: 'Successfully registered merchant: ' + req.body.name
                })
            }
        });
}

/*
Retreives a specific user.
*/
merchantController.getSpecificMerchant = (req, res) => {

    /*
    Checks for undefined fields to prevent unwanted API manipulation. 
    */
    for (property in req.params) {
        if (property !== 'merchantID')
            return 'Request contained unsupported field: ' + property
    }

    /*
    Checks the length of merchantID paramater to prevent possible DDOS attack
    */

    if (req.params.merchantID.length !== 10) {
        return res.status(600).send({
            message: 'Parameter error merchantID should be 10 characters',
            error: 'Input error'
        })
    }

    const merchantID = req.params.merchantID

    Merchant.find({"merchantID":merchantID}, function (err, merchant) {
        if (err) {
            res.status(500)
            res.send({
                message: err,
                error: 'Server error'
            })
        } else if (merchant.length === 0) {
            res.status(404)
            res.send({
                message: 'Could not find a merchant with ID: ' + merchantID,
                error: 'Unknown user error'
            })
        } else {
            res.status(200).send({
                merchant
            })
        }
    })
}

/*
Returns a list of merchants. 
*/
merchantController.getMerchants = (req, res) => {
    var query = Merchant.find({}).select('-__v')

    query.exec(function (err, merchants) {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.send({
            merchants
        });
    })
}





module.exports = merchantController