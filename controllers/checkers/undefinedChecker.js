
/*
This method checks that required fields are present inside of requests for non array values. 
srequestObject: This is the object being requested.
fieldsThatShouldBeDefined: Pass the strings values of the properties that should be included. 
*/

module.exports = function undefinedFields(requestObject, expectedProperties){
    objectProperties = Object.getOwnPropertyNames(requestObject);

    //Comparies expected properties to properties found. 
    for(var x = 0; x < expectedProperties.length; x++){
        if(objectProperties.indexOf(expectedProperties[x]) === -1) {
            return expectedProperties[x] + ' was not found in request' 
        }
    }
}