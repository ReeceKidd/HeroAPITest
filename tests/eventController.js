/*
Merchant controller parameters: 
name, email and postcode

Tests for the get-specific-merchant and get all merchants where completed manually using POSTMAN. 

Tests completed for the merchant controller: 

--create-event route

type: 
Tests that type exists in request
Tests that type equals transaction

lineItems (Array):
Tests that line items exists in request. 
Tests that line items contains objects. 
Tests that quantity exists in all line item objects. 
Tests that quantity is not negative in line item objects
Test that sku code exists in all line item objects. 

user: 
Tests that user exists
Tests that user is the minimum length (10)
Tests that user does not exceed the maximum length (10)
Tests that user is a string

merchant: 
Tests that merchant exists
Tests that merchant is the minimum length (10)
Tests that merchant does not exceed the maximum length (10)
Tests that merchant is a string

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
        console.log('Error removing users from user collection')
    }
})
Merchant.remove({}, function (err) {
    if (err) {
        console.log('Error removing merchants from merchant collection')
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
    //Creates merchant for test. 
    describe('Creates valid merchant', () => {
        it('Merchant should be registered as request is valid', (done) => {
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
    //Creates user for test. 
    describe('Creates user for test', () => {
        it('User should register as request is valid', (done) => {
            chai.request(server)
                .post('/register-user')
                .send({
                    firstName: "ABC",
                    lastName: "Kidd",
                    email: "testuser953@gmail.com",
                    postcode: "BT319Y4",
                    userID: "123456789A"
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })
    })
});

describe('Tests for valid event creation', () => {
    it('Event should be created as request is valid', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

//Event creation tests. 

//type parameter checks. 
describe('Tests that type exists', () => {
    it('It should fail as type is absent from request', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that type is equal to transaction', () => {
    it('It should fail as type is equal to refund', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "refund",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789A"
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
                user: "123456789A",
                merchant: "123456789A"
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
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789A"
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
                        skuCode: "1234567AB"
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789A"
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
                        quantity: -10
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789A"
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
                        quantity: 10
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that user exists', () => {
    it('It should fail as user is absent', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                merchant: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that user is the minimum length (10)', () => {
    it('It should fail as user is only 9 characters long', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789",
                merchant: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that user does not exceed the maximum length (10)', () => {
    it('It should fail as postcode is greater than 10 characters long', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789AB",
                merchant: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that user is a string', () => {
    it('It should fail as user is a number not a string', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: 123456789,
                merchant: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that merchant exists in request', () => {
    it('It should fail as merchant is absent', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})


describe('Tests that merchant is the minimum length (10)', () => {
    it('It should fail as merchant is only 10 characters long', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that merchant does not exceed the maximum length (10)', () => {
    it('It should fail as merchant is greater than 10 characters long', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: "123456789AB"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that merchant is a string', () => {
    it('It should fail as merchant is a number not a string', (done) => {
        chai.request(server)
            .post('/create-event')
            .send({
                type: "transaction",
                lineItems: [{
                        skuCode: "1234567AB",
                        quantity: 1
                    },
                    {
                        skuCode: "12345NHAB",
                        quantity: 1
                    }
                ],
                user: "123456789A",
                merchant: 123456789
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})


after(async () => {
    //require('../src/app.js').stop();
});