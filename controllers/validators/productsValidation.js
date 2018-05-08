
module.exports = function registerProductValidation(req) {

    req.check('skuCode', 'skuCode is required').exists()
    /*
    Min and max can be changed to suit requirements of the project. 
    */
    req.check('skuCode', 'skuCode must be greater than 6 characters').isLength({min:6})
    req.check('skuCode', 'skuCode can not be greater than 20 characters').isLength({max:20})

    req.check('price', 'price is required')

    req.check('name', 'product name is required')
    req.check('name', 'product name must be greater than 4 characters').isLength({min:4})
    req.check('name', 'product name can not be greater than 100 characters').isLength({max:100})

    var errors = req.validationErrors(true)

    if (errors) {
        return errors
    }
}