/*
The validation can be adapted to better suit the requirements at a later stage. 
For example user addresses and language preference could be stored. 
*/

module.exports = function registerUserValidation(req) {

    req.check('firstName', 'First name is required for regisration').exists()
    req.check('firstName', 'First name must be at least two characters long').isLength({
        min: 2
    })
    req.check('firstName', 'First name cannot be greater than 50 characters long').isLength({
        max: 50
    })

    req.check('lastName', 'Last name is required for registration').exists()
    req.check('lastName', 'Last name must be at least two characters long').isLength({
        min: 2
    })
    req.check('lastName', 'Last name cannot be greater than 100 characters long').isLength({
        max: 50
    })
    req.check('email', 'Email is required for basic registration').exists()
    req.check('email', 'Invalid email').isEmail()

    //Post code could also have regex checks depending on what country needs to be supported. 
    req.check('postcode', 'Post code is required for registration').exists()
    req.check('postcode', 'Post code must be at least seven characters long').isLength({
        min: 7
    })
    req.check('postcode', 'Post code cannot be greater than seven characters long').isLength({
        max: 7
    })
    //UserIDs are specified with a length of 10 to stay consistent with merchantIDs. 
    req.check('userID', 'userID is required for registration').exists()
    req.check('userID', 'userID must be at least 10 characters long').isLength({
        min: 10
    })
    req.check('userID', 'userID cannot be greater than 10 characters long').isLength({
        max: 10
    })


    var errors = req.validationErrors(true)

    if (errors) {
        return errors
    }
}