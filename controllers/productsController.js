/*
Products controller containing the various methods related to products. 
Methods: 
uploadProduct, 
getSpecificProduct,
getAllProducts
*/

const axios = require('axios')
const Product = require('../models/products')

//Configuration for Hero API calls. 
const config = require('../src/apiConfiguration')

//heroAPI
const heroDevAPI = 'https://dev.backend.usehero.com/products/'

// Request validators
const productsValidation = require('./validators/productsValidation')
const checkUndefinedFields = require('./checkers/undefinedChecker')

const productsController = {}

productsController.registerProduct = (req, res) => {

    var undefinedFields = checkUndefinedFields(req.body, ['skuCode', 'price', 'name'])

    if (undefinedFields) {
        return res.status(950).send({
            error: 'Undefined field',
            message: undefinedFields
        })
    }

    if (typeof req.body.skuCode !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'SKU code must be a string'
        })
    }

    if (typeof req.body.price !== "number") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'Price must be a number'
        })
    }

    if (req.body.price < 0) {
        return res.status(600).send({
            error: 'Input error',
            message: 'Price cannot be a negative number'
        })
    }

    if (typeof req.body.name !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'Name must be a string'
        })
    }

    //Validation for basic registration. 
    var productValidationErrors = productsValidation(req)
    if (productValidationErrors) {
        return res.status(600).json({
            message: productValidationErrors,
            error: 'Validation failure'
        })
    }

    //Try and catch is needed for products with duplicate SKU codes.  
    const saveProduct = new Product(req.body)
    saveProduct.save(function (err) {

        if (err) {
            return res.status(500).send({
                error: 'Duplicate product',
                message: 'Product with SKU code: ' + req.body.skuCode + ' already exsits.'
            })
        } else {
            return res.status(200).send({
                message: 'Successfully registered product: ' + req.body.name
            })
        }
    });
}

/*
Retreives a specific product.
*/
productsController.getSpecificProduct = (req, res) => {

    const skuCode = req.params.skuCode

    if (typeof skuCode !== "string") {
        return res.status(600).send({
            error: 'Type failure',
            message: 'skuCode must be a string'
        })
    }

    //skuCode lengths can be adjusted to suit requirements. 
    if (skuCode.length < 6) {
        return res.status(600).send({
            error: 'Validation failure',
            message: 'skuCode cannot be less than 6 characters'
        })
    }

    if (skuCode.length > 20) {
        return res.status(600).send({
            error: 'Validation failure',
            message: 'skuCode cannot be greater than 20 characters'
        })
    }

    var query = {
        'skuCode': skuCode
    } 
    apiURL = heroDevAPI + skuCode

    
    //Checks the local database and then the API for the product. 
    Product.find(query, function (err, product) {
        if (err) {
            return res.status(500).send({
                message: 'Server error',
                error: 'Server error'
            })
        } else if (product.length === 0) {
            axios.get(apiURL, config).then(function (response) {
                console.log(response.data)
                if(response.data === null){
                    res.status(404).send({
                        message: 'Could not load product with skuCode'
                    })
                } else {
                    return res.status(200).send({
                        product: response.data
                    })
                }
                
            }).catch(err => {
                res.status(500).send({
                    message: 'Could not retreive data'
                })
            })
        } else {
            return res.status(200).send({
                product: product
            })
        }
    })
}

/*
Returns a list of all products from local database and API. 
*/
productsController.getAllProducts = (req, res) => {
    var query = Product.find({}).select('-__v')

    query.exec(function (err, products) {
        if (err) {
            res.status(500).send(err)
            return
        }
        axios.get(heroDevAPI).then(function (response) {
            res.status(200).send({
                "number-of-products": products.length + response.data.length,
                "database-products": products,
                "api-products": response.data
            })
        }).catch(err => {
            res.status(500).send({
                message: err
            })
        })

    })
}

module.exports = productsController