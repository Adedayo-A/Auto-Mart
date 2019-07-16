"use strict";

/* global describe:false, it:false, before:false */
var supertest = require('supertest'); // eslint-disable-next-line no-unused-vars


var should = require('should'); // const chai = require('chai');


var index = require('../index.js');

var token;
process.env.JWT_KEY = 'mykey';
process.env.db_URL = 'postgres://firulvau:pTPhhHcTt0aZTW0zZQ471t9k263B68W1@rogue.db.elephantsql.com:5432/firulvau';
describe('TEST API ENDPOINTS', function () {
  describe('TEST CAR ADs ENDPOINTS', function () {
    before(function (done) {
      var user = {
        email: 'syed@gmail.com',
        password: '3456'
      };
      supertest(index).post('/api/v1/users/auth/signin').send(user).end(function (err, res) {
        // eslint-disable-next-line prefer-destructuring
        token = res.body.token;
        done();
      });
    });
    it('should return all unsold cars', function (done) {
      supertest(index).get('/api/v1/car?status=available').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        res.status.should.equal(200);
        done();
      });
    });
    it('should return all unsold cars within a price range', function (done) {
      supertest(index).get('/api/v1/car/?min_price=100000&max_price=150000&status=available').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should return all cars of a specific body type', function (done) {
      supertest(index).get('/api/v1/car/?body_type=car').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        // const bodyType = res.carad.body_type;
        res.status.should.equal(200);
        res.body.message.should.equal('result completed');
        res.error.should.equal(false);
        done();
      });
    });
    it('should return all unsold cars of a specific make', function (done) {
      supertest(index).get('/api/v1/car/?manufacturer=toyota&status=available').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should return all used unsold cars', function (done) {
      supertest(index).get('/api/v1/car/?status=available&state=used').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should return all new unsold cars', function (done) {
      supertest(index).get('/api/v1/car/?status=available&state=new').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should return a specific car Ad', function (done) {
      supertest(index).get('/api/v1/car/2').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should return a 404 error for an id of car Ad not present yet', function (done) {
      supertest(index).get('/api/v1/car/20').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        res.status.should.equal(200);
        done();
      });
    });
    it('should post a car sale Ad', function (done) {
      var ad = {
        status: 'available',
        manufacturer: 'Infinity',
        model: 'Jeep',
        price: 500000,
        body_type: 'car',
        owner: 3,
        state: 'used'
      };
      supertest(index).post('/api/v1/car/').set('Authorization', "Bearer ".concat(token)).send(ad).expect('Content-type', /json/).end(function (err, res) {
        res.body.message.should.equal('Posted successfully');
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should mark a posted AD as sold', function (done) {
      var ad = {
        status: 'available',
        price: 850000
      };
      supertest(index).patch('/api/v1/car/29/').set('Authorization', "Bearer ".concat(token)).send(ad).expect('Content-type', /json/).end(function (err, res) {
        res.body.message.should.equal('AD updated successfully!!');
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should update the price of a posted AD', function (done) {
      var ad = {
        price: 850000,
        status: 'available'
      };
      supertest(index).patch('/api/v1/car/41/').set('Authorization', "Bearer ".concat(token)).send(ad).expect('Content-type', /json/).end(function (err, res) {
        // res.body.message.should.equal('Updated successfully');
        // res.body.editCar.price.should.equal(650000);
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should delete a posted AD record', function (done) {
      supertest(index)["delete"]('/api/v1/car/34/').set('Authorization', "Bearer ".concat(token)).expect('Content-type', /json/).end(function (err, res) {
        // res.body.message.should.equal('Deleted successfully');
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
  });
  describe('TEST USER ENDPOINTS', function () {
    it('should signin a user', function (done) {
      var user = {
        email: 'swede@gmail.com',
        password: '2211'
      };
      supertest(index).post('/api/v1/users/auth/signin').send(user).expect('Content-type', /json/).end(function (err, res) {
        res.body.message.should.equal('Success..Welcome Back Swede');
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should update and register a user', function (done) {
      var user = {
        first_name: 'Swede',
        last_name: 'Bolls',
        address: '33, Adeola Odeku, Lagos'
      };
      supertest(index).patch('/api/v1/users/auth/update').set('Authorization', "Bearer ".concat(token)).send(user).expect('Content-type', /json/).end(function (err, res) {
        // eslint-disable-next-line no-unused-vars
        res.body.message.should.equal('Profile updated');
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
  });
  describe('TEST ORDERS ENDPOINTS', function () {
    it('should make a purchase order', function (done) {
      var order = {
        car_id: 3,
        id: 2,
        amount: 500000,
        buyer: 4,
        status: 'pending'
      };
      supertest(index).post('/api/v1/order/').set('Authorization', "Bearer ".concat(token)).send(order).expect('Content-type', /json/).end(function (err, res) {
        res.body.message.should.equal('Posted successfully');
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
    it('should update the price of purchase order', function (done) {
      var order = {
        amount: 550000
      };
      supertest(index).patch('/api/v1/order/4/price').set('Authorization', "Bearer ".concat(token)).send(order).expect('Content-type', /json/).end(function (err, res) {
        res.body.message.should.equal('Order updated successfully!!');
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
  });
  describe('TEST FLAG ENDPOINTS', function () {
    it('should flag a posted Ad as fraudulent', function (done) {
      var report = {
        car_id: 6,
        reason: 'pricing'
      };
      supertest(index).post('/api/v1/flag/').set('Authorization', "Bearer ".concat(token)).send(report).expect('Content-type', /json/).end(function (err, res) {
        res.body.message.should.equal('Thank you for reporting this problem');
        res.body.newFlag.reason.should.equal('pricing');
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
    });
  });
});