/*
This checks that a valid Mongo object ID is passed in request. 
*/

var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

module.exports = function isValidMongoID(input){
    if(input.match(checkForHexRegExp)){
        return true
    } 
    return false
}