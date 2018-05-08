module.exports = function eventTypeChecker(request) {

    if (typeof req.body.type !== "string") {
        return 'Type must be a string'
    }

    if (typeof req.body.subTotal !== "number") {
        return 'subTotal must be a number'
    }

    if (typeof req.body.total !== "number") {
        return 'total must be a number'
    }

    if (!Array.isArray(req.body.lineItems)) {
        return 'lineItems must be an array'
    }

    if (typeof req.body.merchant !== "string") {
        return 'merchant must be a string'
    }

    if (typeof req.body.user !== "string") {
            message: 'user must be a string'
    }
}