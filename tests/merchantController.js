/*
Merchant controller parameters: 
name, email and postcode

Tests for the get-specific-merchant and get all merchants where completed manually using POSTMAN. 

Tests completed for the merchant controller: 

--register-merchant route

name: 
Tests that name exists in request
Tests that name is the minimum length (2)
Tests that name is the maximum length (50)
Tests that name is a string

email:
Tests that email exists
Tests that email is valid
Tests that email is a string

postcode: 
Tests that post code exists
Tests that post code is the minimum length (7)
Tests that post code does not exceed the maximum length (7)
Tests that post code is a string

merchantID: 
Tests that merchantID exists
Tests that merchantID is the minimum length (10)
Tests that merchantID does not exceed the maximum length (10)
Tests that merchantID is a string

--merchant
Tests that merchants are successfully returned. 

--/merchant/:merchantID 

Test that specified merchant is returned. 
Test that random merchantID returns nothing
Tests that merchantID does not exceed a maximum length. (10)
Tests that merchantID does not exceed a minimum length. (10)

*/

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

var server = require('../src/app.js');
var Merchant = require('../models/merchants');

var should = chai.should();
chai.use(chaiHttp);

//Empty the test database before starting
Merchant.remove({}, function (err) {})

//Creates merchant needed for tests. 
before(() => {
    //Register merchant test
    describe('Tests that name exists', () => {
        it('It should fail as name is absent from request', (done) => {
            chai.request(server)
                .post('/register-merchant')
                .send({
                    email: "merchant953@gmail.com",
                    postcode: "BT319Y4",
                    merchantID: "123456789A"
                })
                .end((err, res) => {
                    res.should.have.status(950)
                    done()
                })
        })
    })
});

//Creates valid merchant 
describe('Tests for valid merchant registration', () => {
    it('It should register as request is valid', (done) => {
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




describe('Tests that name is at least two characters long', () => {
    it('It should fail as name is equal to "A', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "A",
                email: "merchant957@gmail.com",
                postcode: "BT319Y4",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that name cannot be greater than 50 characters', () => {
    it('It should fail as name is equal to "A*50', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                email: "merchant953@gmail.com",
                postcode: "BT319Y4",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that name is a string', () => {
    it('It should fail as name is a number not a string', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: 123456,
                email: "merchant@gmail.com",
                postcode: "1234567",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that email exists in request', () => {
    it('It should fail as email is absent', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "merchant",
                postcode: "BT319Y4",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that email must be valid', () => {
    it('It should fail as email is invalid', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "merchant#gmail.com",
                postcode: "BT319Y4",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that email is a string', () => {
    it('It should fail as email is a number not a string', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "Merchant",
                email: 1234567,
                postcode: "1234567",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that postcode exists in request', () => {
    it('It should fail as email is absent', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "merchant@gmail.com",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})


describe('Tests that post code is the minimum length', () => {
    it('It should fail as postcode is only one character long', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "merchant@gmail.com",
                postcode: "1",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that post code does not exceed the maximum length', () => {
    it('It should fail as postcode is greater than seven characters long', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "merchant@gmail.com",
                postcode: "12345678",
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that post code is a string', () => {
    it('It should fail as postcode is a number not a string', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "mercahnt@gmail.com",
                postcode: 1234567,
                merchantID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that merchantID exists in request', () => {
    it('It should fail as merchantID is absent', (done) => {
        chai.request(server)
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "merchant@gmail.com",
                postcode: "BT31KJY"
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
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "merchant@gmail.com",
                postcode: "BT319TJ",
                merchantID: "12345678"
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
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "merchant@gmail.com",
                postcode: "BT319TH",
                merchantID: "123456789ABC"
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
            .post('/register-merchant')
            .send({
                name: "merchant",
                email: "mercahnt@gmail.com",
                postcode: "BT319TH",
                merchantID: 123456789
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

//-merchants
describe('Tests that get merchants is working correctly', () => {
    it('It should successfully return merchant', (done) => {
        chai.request(server)
            .get('/merchants')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

//merchant/:merchantID test 
describe('Tests that a specified merchant is returned successfully', () => {
    it('It should successfully return one specified merchant', (done) => {
        chai.request(server)
            .get('/merchants/123456789A')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

describe('Tests that no merchant is returned with random ID', () => {
    it('It should return no merchants', (done) => {
        chai.request(server)
            .get('/merchants/1234JBCDAE')
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
})

describe('Tests maximum input length of merchantID (10)', () => {
    it('It should fail as merchantID is above 10 characters', (done) => {
        chai.request(server)
            .get('/merchants/123456789ABCDEFGHIJKLMNOP')
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests minimum length of merchantID (10)', () => {
    it('It should fail as merchantID is 4 characters', (done) => {
        chai.request(server)
            .get('/merchants/1234')
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

after(async () => {
    require('../src/app.js').stop();
});