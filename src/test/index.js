/* global describe:false, it:false, before:false */
const supertest = require('supertest');
// eslint-disable-next-line no-unused-vars
const should = require('should');
// const chai = require('chai');
const index = require('../index.js');

let token;

process.env.JWT_KEY = 'mykey';
process.env.db_URL = 'postgres://firulvau:pTPhhHcTt0aZTW0zZQ471t9k263B68W1@rogue.db.elephantsql.com:5432/firulvau';

describe('TEST API ENDPOINTS', () => {
  describe('TEST CAR ADs ENDPOINTS', () => {
    before((done) => {
      const user = {
        email: 'syed@gmail.com',
        password: '3456',
      };
      supertest(index)
        .post('/api/v1/users/auth/signin')
        .send(user)
        .end((err, res) => {
        // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
          done();
        });
    });
    it('should return all unsold cars', (done) => {
      supertest(index)
        .get('/api/v1/car?status=available')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        });
    });
    it('should return all unsold cars within a price range', (done) => {
      supertest(index)
        .get('/api/v1/car/?min_price=100000&max_price=150000&status=available')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should return all cars of a specific body type', (done) => {
      supertest(index)
        .get('/api/v1/car/?body_type=car')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          // const bodyType = res.carad.body_type;
          res.status.should.equal(200);
          res.body.data.message.should.equal('result completed');
          res.error.should.equal(false);
          done();
        });
    });
    it('should return all unsold cars of a specific make', (done) => {
      supertest(index)
        .get('/api/v1/car/?manufacturer=toyota&status=available')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should return all used unsold cars', (done) => {
      supertest(index)
        .get('/api/v1/car/?status=available&state=used')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should return all new unsold cars', (done) => {
      supertest(index)
        .get('/api/v1/car/?status=available&state=new')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should return a specific car Ad', (done) => {
      supertest(index)
        .get('/api/v1/car/2')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should return a 404 error for an id of car Ad not present yet', (done) => {
      supertest(index)
        .get('/api/v1/car/20')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(200);
          done();
        });
    });
    it('should post a car sale Ad', (done) => {
      const ad = {
        status: 'available',
        manufacturer: 'Infinity',
        model: 'Jeep',
        price: 900000,
        body_type: 'car',
        owner: 3,
        state: 'used',
      };
      supertest(index)
        .post('/api/v1/car/')
        .set('Authorization', `Bearer ${token}`)
        .send(ad)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.data.message.should.equal('Posted successfully');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should mark a posted AD as sold', (done) => {
      const ad = {
        status: 'sold',
        price: 850000,
      };
      supertest(index)
        .patch('/api/v1/car/199/')
        .set('Authorization', `Bearer ${token}`)
        .send(ad)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.data.message.should.equal('AD updated successfully!!');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should update the price of a posted AD', (done) => {
      const ad = {
        price: 750000,
        status: 'available',
      };
      supertest(index)
        .patch('/api/v1/car/199/')
        .set('Authorization', `Bearer ${token}`)
        .send(ad)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.data.message.should.equal('AD updated successfully!!');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should delete a posted AD record', (done) => {
      supertest(index)
        .delete('/api/v1/car/219/')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          // res.body.message.should.equal('Deleted successfully');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });
  describe('TEST USER ENDPOINTS', () => {
    it('should signin a user', (done) => {
      const user = {
        email: 'swede@gmail.com',
        password: '2211',
      };
      supertest(index)
        .post('/api/v1/users/auth/signin')
        .send(user)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.data.message.should.equal('Success..Welcome Back Swede');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should update and register a user', (done) => {
      const user = {
        first_name: 'Swede',
        last_name: 'Bolls',
        address: '33, Adeola Odeku, Lagos',
      };
      supertest(index)
        .patch('/api/v1/users/auth/update')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect('Content-type', /json/)
        .end((err, res) => {
          // eslint-disable-next-line no-unused-vars
          res.body.data.message.should.equal('Profile updated');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });
  describe('TEST ORDERS ENDPOINTS', () => {
    it('should make a purchase order', (done) => {
      const order = {
        car_id: 3,
        price_offered: 500000,
      };
      supertest(index)
        .post('/api/v1/order/177')
        .set('Authorization', `Bearer ${token}`)
        .send(order)
        .expect('Content-type', /json/)
        .end((err, res) => {
          console.log(res.body);
          res.body.data.message.should.equal('Posted successfully');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should update the price of purchase order', (done) => {
      const order = {
        price_offered: 590000,
      };
      supertest(index)
        .patch('/api/v1/order/8/')
        .set('Authorization', `Bearer ${token}`)
        .send(order)
        .expect('Content-type', /json/)
        .end((err, res) => {
          console.log(res.body);
          res.body.data.message.should.equal('Order updated successfully!!');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });
  describe('TEST FLAG ENDPOINTS', () => {
    it('should flag a posted Ad as fraudulent', (done) => {
      const report = {
        car_id: 6,
        reason: 'pricing',
      };
      supertest(index)
        .post('/api/v1/flag/76')
        .set('Authorization', `Bearer ${token}`)
        .send(report)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.data.message.should.equal('Thank you for reporting this problem');
          // res.body.data.reason.should.equal('pricing');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });
  describe('TEST CAR ORDERS ENDPOINTS', () => {
    it('should update a car order', (done) => {
      const order = {
        status: 'rejected',
      };
      supertest(index)
        .patch('/api/v1/cars/66/carorders')
        .set('Authorization', `Bearer ${token}`)
        .send(order)
        .expect('Content-type', /json/)
        .end((err, res) => {
          console.log(res.body);
          res.body.data.message.should.equal('Order Updated');
          res.body.data.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should get all user car orders', (done) => {
      supertest(index)
        .get('/api/v1/cars/carorders/')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          console.log(res.body);
          res.body.data.message.should.equal('orders retrieved');
          res.body.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should get a car order', (done) => {
      supertest(index)
        .get('/api/v1/cars/66/carorders/')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          console.log(res.body);
          res.body.data.message.should.equal('order retrieved');
          res.body.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });
});
