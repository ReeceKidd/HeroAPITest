/*
This method is used for basic requests that do not contain array values to ensure
request parameters are of type string. 
*/
module.exports = function typeCheck(req) {
    for (var property in req) {
        var value = req[property];
        if (typeof value !== 'string') {
            return 'The property (' + property + ') containing value (' + value.toString() + ') must be a string' 
        }
    }
}