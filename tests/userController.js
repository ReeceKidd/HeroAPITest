/*
User controller parameters: 
firstName, lastName, email and postcode

Tests for the get-specific-user and get all users where completed manually using POSTMAN. 

Tests completed for the user controller: 

--register-user route

firstName: 
Tests that first name exists
Tests that first name is the minimum length (2)
Tests that first name does not exceed the maximum length (50)
Tests that firstName is a string

lastName: 
Tests that last name exists
Tests that last name is the minimum length (2)
Tests that last name does not exceed the maximum length (50)
Tests that lastname  is a string

email:
Tests that email exists
Tests that email isn't already registered. 
Tests that email must be valid
Tests that email is a string

postcode: 
Tests that post code exists. 
Tests that post code is the minimum length (7)
Tests that post code does not exceed the maximum length (7)
Tests that post code is a string

--user/
Tests that users are successfully returned. 

--/user/:userID 

Test that specified user is returned. 
Test that random userID returns nothing
Tests that userID does not exceed a maximum length. (10)
Tests that userID does not exceed a minimum length. (10)
*/

process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

var server = require('../src/app.js');
var User = require('../models/users');

var should = chai.should();
chai.use(chaiHttp);

//Empty the test database before starting
User.remove({}, function (err) {})

//Creates user needed for tests. 
describe('Tests for valid registration', () => {
    it('It should register as request is valid', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "ABC",
                lastName: "Kidd",
                email: "testuser@gmail.com",
                postcode: "BT319Y4",
                userID: "12345678BB"
            })
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

//Register tests
describe('Tests that first name is at least two characters long', () => {
    it('It should fail as first name is equal to "A', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "A",
                lastName: "Kidd",
                email: "reecekidd953@gmail.com",
                postcode: "BT319Y4",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that first name cannot be greater than 50 characters', () => {
    it('It should fail as first name is equal to "A*50', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                lastName: "Kidd",
                email: "reecekidd953@gmail.com",
                postcode: "BT319Y4",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that first name exists', () => {
    it('It should fail as first name is absent from request', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                lastName: "Kidd",
                email: "reecekidd953@gmail.com",
                postcode: "BT319Y4",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that firstName is a string', () => {
    it('It should fail as firstName is a number not a string', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: 12345,
                lastName: "Kidd",
                email: "reecekidd@test.com",
                postcode: "1234567",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that last name is at least two characters long', () => {
    it('It should fail as last name is equal to "A', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "A",
                email: "reecekidd957@gmail.com",
                postcode: "BT319Y4",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that last name cannot be greater than 50 characters', () => {
    it('It should fail as last name is equal to "A*50', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                lastName: "Kidd",
                email: "reecekidd953@gmail.com",
                postcode: "BT319Y4",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that last name exists', () => {
    it('It should fail as last name is absent from request', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                email: "reecekidd953@gmail.com",
                postcode: "BT319Y4",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that lastname  is a string', () => {
    it('It should fail as lastname is a number not a string', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: 123456,
                email: "reecekidd@gmail.com",
                postcode: "1234567",
                userID: "123456789A"
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
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "reecekidd953#gmail.com",
                postcode: "BT319Y4",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests that users cant register with exisitng email', () => {
    it('It should fail as email is already registered', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "ABC",
                lastName: "Kidd",
                email: "testuser@gmail.com",
                postcode: "BT319Y4",
                userID: "12345678BL"
            })
            .end((err, res) => {
                res.should.have.status(500)
                done()
            })
    })
})

describe('Tests that email exists', () => {
    it('It should fail as email is absent', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                postcode: "BT319Y4",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that email is a string', () => {
    it('It should fail as email is a number not a string', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: 1234567,
                postcode: "1234567",
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that postcode exists', () => {
    it('It should fail as postcode is absent', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "test@gmail.com",
                userID: "123456789A"
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
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "reece@gmail.com",
                postcode: "1",
                userID: "123456789A"
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
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "reece@gmail.com",
                postcode: "12345678",
                userID: "123456789A"
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
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "reece@gmail.com",
                postcode: 1234567,
                userID: "123456789A"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that userID exists', () => {
    it('It should fail as userID is absent', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "test@gmail.com",
                postcode: "BT319Y4"
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

describe('Tests that users cant register with exisitng userID', () => {
    it('It should fail as userID is already registered', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "testuser123@gmail.com",
                postcode: "BT319Y4",
                userID: "12345678BB"
            })
            .end((err, res) => {
                res.should.have.status(500)
                done()
            })
    })
})

describe('Tests that userID is the minimum length (10)', () => {
    it('It should fail as userID is only 9 characters long', (done) => {
        chai.request(server)
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "reece@gmail.com",
                postcode: "1234567",
                userID: "123456789"
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
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "reece@gmail.com",
                postcode: "1234567",
                userID: "123456789AB"
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
            .post('/register-user')
            .send({
                firstName: "Reece",
                lastName: "Kidd",
                email: "reece@gmail.com",
                postcode: "1234567",
                userID: 123456789
            })
            .end((err, res) => {
                res.should.have.status(950)
                done()
            })
    })
})

//-users
describe('Tests that get users is working correctly', () => {
    it('It should successfully return users', (done) => {
        chai.request(server)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

//user/:userID test 
describe('Tests that a specified user is returned successfully', () => {
    it('It should successfully return one specified user', (done) => {
        chai.request(server)
            .get('/users/12345678BB')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

describe('Tests that no user is returned with random ID', () => {
    it('It should return no users', (done) => {
        chai.request(server)
            .get('/users/1234JBCDAE')
            .end((err, res) => {
                res.should.have.status(404)
                done()
            })
    })
})

describe('Tests maximum input length of userID (10)', () => {
    it('It should fail as userID is above 10 characters', (done) => {
        chai.request(server)
            .get('/users/123456789ABCDEFGHIJKLMNOP')
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

describe('Tests minimum length of merchantID (10)', () => {
    it('It should fail as userID is 4 characters', (done) => {
        chai.request(server)
            .get('/users/1234')
            .end((err, res) => {
                res.should.have.status(600)
                done()
            })
    })
})

after(async () => {
    User.remove({}, function (err) {})
});