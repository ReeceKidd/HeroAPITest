/*
The validation can be adapted to better suit the requirements at a later stage. 
*/

module.exports = function registerUserValidation(req) {

    req.check('name', 'Merchant name is required for registration').exists()
    req.check('name', 'Merchant name must be at least two characters long').isLength({
        min: 2
    })
    req.check('name', 'Merchant cannot be greater than 50 characters long').isLength({
        max: 50
    })
    req.check('email', 'Email is required for merchant registration').exists()
    req.check('email', 'Invalid email').isEmail()

    //Post code could also have regex checks depending on what country needs to be supported. 
    req.check('postcode', 'Post code is required for registration').exists()
    req.check('postcode', 'Post code must be at least seven characters long').isLength({
        min: 7
    })
    req.check('postcode', 'Post code cannot be greater than seven characters long').isLength({
        max: 7
    })

    //This is assuming that all merchantID's are 10 characters based on the instructions. 
    req.check('merchantID', 'merchantID is required for registration')
    req.check('merchantID', 'merchantID must be at least 10 characters long').isLength({
        min: 10
    })
    req.check('merchantID', 'merchantID cannot be greater than 10 characters').isLength({
        max: 10
    })


    var errors = req.validationErrors(true)

    if (errors) {
        return errors
    }
}