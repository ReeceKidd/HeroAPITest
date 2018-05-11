/*
merchantID controller parameters: 
name, email and postcode

Tests for the get-specific-merchantID and get all merchantIDs where completed manually using POSTMAN. 

Tests completed for the merchantID controller: 

--create-event route

type: 
Tests that type exists in request
Tests that transaction type is supported
Tests that product-view type is supported. 
Tests that only transaction and product-view events are supported. 

userID: 
Tests that userID exists
Tests that userID is the minimum length (10)
Tests that userID does not exceed the maximum length (10)
Tests that userID is a string

merchantID: 
Tests that merchantID exists
Tests that merchantID is the minimum length (10)
Tests that merchantID does not exceed the maximum length (10)
Tests that merchantID is a string

data: 
Tests that data exists in request
Tests that data is not an empty object

// transaction Event Tests

total: 
Tests that total exists
Tests that total is a >= 0.00
Tests that total is a number.

lineItems (Array):
Tests that lineItems exists in request. 
Tests that lineItems contains objects. 

Tests that lineItems.quantity exists in all line item objects.
Tests that lineItems.quantity is a number in all line item objects. 
Tests that lineItems.quantity is not negative in line item objects

Tests that lineItems.price exists in all line item objects.
Tests that lineItems.price is a number in all line item objects.  
Tests that lineItems.price is not negative in all line item objects.

Tests that lineItems.subTotal exists in all line item objects.
Tests that lineItems.subTotal is a number in all line item objects.  
Tests that linteItems.subTotal is not negative in all line item objects.

Test that lineItems.skuCode exists in all line item objects.
Tests that lineItems.skuCode is a string in all line item objects. 
Tests that lineItems.skuCode is not less than the minimum length (6)
Tests that lineItems.skuCode is not greater than (20)

//transaction event tests end 

// product-view event Test

product: 
Tests that product exists
Tests that product is an object
Tests that product is not an empty object

product.skuCode:
Thats that product.skuCode exists
Tests that product.skuCode is a string
Tests that product.skuCode is the minimum length (6)
Tests that product.skuCode does not exceed the maximum length (20)

location: 
Tests that location exists
Tests that location is a string. 
Tests that location is the minimum length (6)


// End of product-view event test

--events/:merchantID
Test that specified event is returned. 
Test that random merchantID returns nothing
Tests that merchantID does not exceed a maximum length. (10)
Tests that merchantID does not exceed a minimum length. (10)

--events/
Tests that events are being returned. 

*/

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

var server = require('../src/app.js');

var ProductEvent = require('../models/events');
var Product = require('../models/products')
var User = require('../models/users')
var Merchant = require('../models/merchants')

var should = chai.should();
chai.use(chaiHttp);

//Empty the test database before starting
ProductEvent.remove({}, function (err) {
    if (err) {
        console.log('Error removing events from product events collection')
    }
})
Product.remove({}, function (err) {
    if (err) {
        console.log('Error removing documents from product collection')
    }
})
User.remove({}, function (err) {
    if (err) {
        console.log('Error removing userIDs from userID collection')
    }
})
Merchant.remove({}, function (err) {
    if (err) {
        console.log('Error removing merchantIDs from merchantID collection')
    }
})

//Creates other database items needed to test the event controller. 
before(() => {
    //Creates denim jacket product needed for test. 
    describe('Creates denim-jacket product', () => {
        it('Denim  product should be created as request is valid', (done) => {
            chai.request(server)
                .post('/register-product')
                .send({
                    skuCode: "1234567AC",
                    name: "denim-jacket",
                    price: 50.00
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })
    //Creates tie product needed for test. 
    describe('Creates tie product', () => {
        it('Tie product should be created as request is valid', (done) => {
            chai.request(server)
                .post('/register-product')
                .send({
                    skuCode: "12345NHAB",
                    name: "blue-tie",
                    price: 5.00
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })
    //Creates merchantID for test. 
    describe('Creates valid merchant', () => {
        it('merchant should be registered as request is valid', (done) => {
            chai.request(server)
                .post('/register-merchant')
                .send({
                    name: "Prada",
                    email: "prada@gmail.com",
                    postcode: "BT319ZY",
                    merchantID: "123456789A"
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })
    //Creates userID for test. 
    describe('Creates valid user', () => {
        it('user should register as request is valid', (done) => {
            chai.request(server)
                .post('/register-user')
                .send({
                    firstName: "ABC",
                    lastName: "Kidd",
                    email: "testuserID953@gmail.com",
                    postcode: "BT319Y4",
                    userID: "123456789A"
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })
    //Creates transaction event for test
    describe('Tests for valid transaction event creation', () => {
        it('transaction Event should be created as request is valid', (done) => {
            chai.request(server)
                .post('/create-event')
                .send({
                    type: "transaction",
                    data: {
                        lineItems: [{
                            skuCode: "1234567AB",
                            quantity: 1,
                            price: 50.00,
                            subTotal: 50.00
                        },
                        {
                            skuCode: "12345NHAB",
                            quantity: 1,
                            price: 5.00,
                            subTotal: 5.00
                        }
                    ],
                    total: 55.00
                    },
                    userID: "123456789A",
                    merchantID: "123456789A"
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })
    //Creates product-view event for test. 
    describe('Tests for valid product-view event creation', () => {
        it('product-view Event should be created as request is valid', (done) => {
            chai.request(server)
                .post('/create-event')
                .send({
                    type: "product-view",
                    data: {
                        product: {
                            skuCode: "AAAA5NHAB"
                        }
                    },
                    userID: "123456789A",
                    merchantID: "123456789A"
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })
});

//type parameter checks. 
describe('Tests that type exists', () => {
    it('It should fail as type is absent from request', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 5.00,
                        subTotal: 5.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 55.00
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that transaction type is supported', () => {
    it('It should pass as type is equal to transaction', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 5.00,
                        subTotal: 5.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 55.00
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

describe('Tests that product-view type is supported. ', () => {
    it('It should pass as type is equal to product-view', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "product-view",
                data: {
                    product: {
                        skuCode: "AAAA5NHAB"
                    }
                },
                userID: "123456789A",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

describe('Tests that type is equal to transaction or product-view', () => {
    it('It should fail as type is equal to refund', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "refund",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 5,
                        subTotal: 5
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

//lineItems tests. 
describe('Tests that lineItems exists', () => {
    it('It should fail as lineItems are absent from request', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})


describe('Tests that lineItems contain objects', () => {
    it('It should fail as lineItems contain primitive values', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [
                    123, {
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that lineItem objects all contain quantitys', () => {
    it('It should fail as one lineItem object is missing a quantity value', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that lineitem objects do not contain negative quantities', () => {
    it('It should fail as one lineitem object contains a negative value', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: -10,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that lineItem objects all contain price', () => {
    it('It should fail as one lineItem object is missing a price value', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that lineItem.price is positive ', () => {
    it('It should fail as one lineItem.price is negative', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        subTotal: 50.00,
                        price: -5.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that lineItem objects all contain sub Totals', () => {
    it('It should fail as one lineItem object is missing a sub total', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        price: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that lineItem objects sub totals are not negative', () => {
    it('It should fail as one lineItem object subtotal is negative', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: -50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that lineitem objects contain SKU codes', () => {
    it('It should fail as one lineitem object does not contain an SKU code', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        quantity: 10,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

//total tests
describe('Tests that total exists', () => {
    it('It should fail as total is absent', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                merchantID: "123456789A",
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

//total tests
describe('Tests that total exists', () => {
    it('It should fail as total is absent', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                merchantID: "123456789A",
                total: "15.00"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

//total tests
describe('Tests that total exists', () => {
    it('It should fail as total is absent', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                merchantID: "123456789A",
                total: -1.00
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

//userID tests
describe('Tests that userID exists', () => {
    it('It should fail as userID is absent', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that userID is the minimum length (10)', () => {
    it('It should fail as userID is only 9 characters long', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that userID does not exceed the maximum length (10)', () => {
    it('It should fail as postcode is greater than 10 characters long', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789AB",
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that userID is a string', () => {
    it('It should fail as userID is a number not a string', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: 123456789,
                merchantID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

//merchantID tests
describe('Tests that merchantID exists in request', () => {
    it('It should fail as merchantID is absent', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})


describe('Tests that merchantID is the minimum length (10)', () => {
    it('It should fail as merchantID is only 10 characters long', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that merchantID does not exceed the maximum length (10)', () => {
    it('It should fail as merchantID is greater than 10 characters long', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: "123456789AB",
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that merchantID is a string', () => {
    it('It should fail as merchantID is a number not a string', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1,
                        price: 50.00,
                        subTotal: 50.00
                    }
                ],
                userID: "123456789A",
                merchantID: 123456789,
                total: 100.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

//--events/:merchantID
describe('Tests that a specified event is returned successfully', () => {
    it('It should successfully return events for merchants', (done) => {
        chai.request(server)
            .get('/events/123456789A')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

describe('Tests that no event is returned with random merchantID', () => {
    it('It should return no events', (done) => {
        chai.request(server)
            .get('/events/ABCDEFGHIJ')
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
})

describe('Tests maximum input length of merchantID (10)', () => {
    it('It should fail as merchantID is above 10 characters', (done) => {
        chai.request(server)
            .get('/events/123456789ABCDEFGHIJKLMNOP')
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests minimum input length of merchantID (10)', () => {
    it('It should fail as merchantID is four characters', (done) => {
        chai.request(server)
            .get('/events/3333')
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

//-events
describe('Tests that get all events is working correctly', () => {
    it('It should successfully return events', (done) => {
        chai.request(server)
            .get('/events')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})


after(async () => {
});