/*
The validation can be adapted to better suit the requirements at a later stage. 
For example user addresses and language preference could be stored. 
*/

module.exports = function registerUserValidation(req) {

    req.check('userID', 'user is required for regisration').exists()
    req.check('userID', 'user must be at least 10 characters long').isLength({
        min: 10
    })
    req.check('userID', 'user cannot be greater than 10 characters long').isLength({
        max: 10
    })

    req.check('merchantID', 'merchant is required for registration').exists()
    req.check('merchantID', 'merchant must be at least 10 characters long').isLength({
        min: 10
    })
    req.check('merchantID', 'merchant cannot be greater than 10 characters long').isLength({
        max: 10
    })
    
    var errors = req.validationErrors(true)

    if (errors) {
        return errors
    }
}