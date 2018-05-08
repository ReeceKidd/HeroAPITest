/*
Product controller parameters: 
skuCode, price, name

Tests completed for product controller: 

--register-product route

General: 
Tests for valid registration. 

skuCode: 
Tets that skuCode exists in request
Tests that skuCode is of type number
Tests that skuCode does not exceed a maximum length. (20)
Tests that skuCode does not exceed a minimum length. (6)


price:
Tests that price exists in request
Tests that price is of type number
Tests that price is a positive number 


name:
Tests that name exists in request
Tests that name is a string
Tests that name does not exceed a maximum length. (100)
Tests that name is at least the minimum length. (4)

--/products route

Tests that two products are returned successfully. 

*/

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

var server = require('../src/app.js');
var Product = require('../models/products');

var should = chai.should();
chai.use(chaiHttp);

//Empty the test database before starting
Product.remove({}, function (err) {
    if (err) {
        console.log('Error removing products from products collection')
    }
})

//Creates two products that are needed for testing. 
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
});

//Register product tests
describe('Tests for valid registration of product', () => {
    it('It should pass as request is valid', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "1234567AB",
                name: "Laundry",
                price: 2.00
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

//Register product tests
describe('Tests that skuCode exists in request', () => {
    it('It should fail as skuCode is absent from request', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                name: "Laundry",
                price: 2.00
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that skuCode is of type string', () => {
    it('It should fail as skuCode is of type number', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: 1234,
                name: "Laundry",
                price: 2.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that skuCode does not exceed the maximum length (20)', () => {
    it('It should fail as skuCode is greater than 20 characters', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "123456789123456789123456789",
                name: "Laundry",
                price: 2.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that skuCode is at least the minimum length (6)', () => {
    it('It should fail as skuCode is less than 6 characters', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "1234",
                name: "Laundry",
                price: 2.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that price exists in the request', () => {
    it('It should fail as price is absent from request', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "123456789",
                name: "Laundry"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that price is of type number', () => {
    it('It should fail as price is off type string', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "123456789",
                price: "2.04",
                name: "Laundry"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that price is a positive number', () => {
    it('It should fail as price is a negative number', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "123456789",
                price: -2.04,
                name: "Laundry"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that name exists in request', () => {
    it('It should fail as name is absent from request', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "123456789",
                price: 2.04
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that name is a string', () => {
    it('It should fail as name is a number', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "123456789",
                price: 2.04,
                name: 1234
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that name does not exceed the maximum length (100)', () => {
    it('It should fail as name is greater than 100 characters', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "1234567891234",
                name: "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
                price: 2.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that name is at least the minimum length (4)', () => {
    it('It should fail as name is less than 4 characters', (done) => {
        chai.request(server)
            .post('/register-product')
            .send({
                skuCode: "123456",
                name: "123",
                price: 2.00
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

//TODO: Need to improve the below tests. 

// /products test 
describe('Tests that two products are returned successfully', () => {
    it('It should successfully return two products', (done) => {
        chai.request(server)
            .get('/products')
            .send({
                skuCode: "1234567AC"
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

// /product/:productID test
describe('Tests that specific product is returned successfully', () => {
    it('It should successfully return one prodcut', (done) => {
        chai.request(server)
            .get('/products/')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

after(async () => {
    require('../src/app.js').stop();
});