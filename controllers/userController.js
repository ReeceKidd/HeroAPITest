const User = require('../models/users')

const checkUndefinedFields = require('./checkers/undefinedChecker')
const userValidation = require('./validators/usersValidation')
const checkTypes= require('./checkers/typeChecker')

const userController = {}

userController.registerUser = (req, res) => {

    var undefinedFields = checkUndefinedFields(req.body, [
        'firstName',
        'lastName',
        'email',
        'postcode',
        'userID'
    ])

    if (undefinedFields) {
        return res.status(950).send({
            error: 'Undefined field',
            message: undefinedFields
        })
        return
    }

    /*
    All request parameters are strings therefore the 
    checkTypes method can be used. 
    */
    var invalidTypes = checkTypes(req.body)

    if(invalidTypes) {
        return res.status(950).send({
            error: 'Invalid type',
            message: invalidTypes
        })
    }

    /*
    An optional addition would be to check for additional fields
    to make the API responsives more informative, but this was
    deemed unnecessary for this task. 
    */

    var validationErrors = userValidation(req)
    if (validationErrors) {
        return res.status(600).json({
            message: validationErrors,
            error: 'Validation failure'
        })
    }
    //Try and catch is needed for duplicate emails. 
    try {
        const saveUser = new User(req.body)
        saveUser.save(function (err) {

            if (err) {
                return res.status(500).json({
                    message: err,
                    error: 'Server faillure'
                })
            } else {
                return res.status(200).json({
                    message: 'Successfully registered: ' + req.body.firstName + ' ' + req.body.lastName
                })
            }
        });
    } catch (exception) {
        //Catches duplicate email entry. 
    }

}

/*
Retreives a specific user.
*/
userController.getSpecificUser = (req, res) => {

    /*
    Checks for undefined fields to prevent unwanted API manipulation. 
    */
    for (property in req.params) {
        if (property !== 'userID')
            return 'Request contained unsupported field: ' + property
    }

    /*
    Checks the length of userID parameter to prevent possible DDOS 
    if regex is a requirement. 
    */

    if (req.params.userID.length > 50) {
        return res.status(500).send({
            message: 'Parameter error max input size exceeded',
            error: 'Input error'
        })
    }

    const userID = req.params.userID

    User.findById(userID, function (err, user) {
        if (err) {
            res.status(500)
            res.send({
                message: err,
                error: 'Server error'
            })
        } else if (!user) {
            res.status(400)
            res.send({
                message: 'Could not find a user with that ID.',
                error: 'Unknown user error'
            })
        } else {
            res.status(200).send({
                user
            })
        }
    })
}

/*
Retreives all registered users from the database. 
*/
userController.getUsers = (req, res) => {
    var query = User.find({}).select('-__v')

    query.exec(function (err, users) {
        if (err) {
            res.status(500).send(err)
            return
        }
        res.send({
            users
        });
    })
}

module.exports = userController