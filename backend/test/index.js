/* global describe:false, it:false, before:false */
const supertest = require('supertest');
// eslint-disable-next-line no-unused-vars
const should = require('should');
// const chai = require('chai');
const index = require('../index.js');

process.env.JWT_KEY = 'mykey';

describe('Test API ENDPOINTS', () => {
  describe('Test CAR ADs ENDPOINTS', () => {
    it('should return all unsold cars', (done) => {
      supertest(index)
        .get('/api/v1/car?status=available')
        .expect('Content-type', /json/)
        .end((err, res) => {
          const firstResultElement = res.body[0];
          res.status.should.equal(200);
          res.error.should.equal(false);
          firstResultElement.manufacturer.should.equal('lexus');
          done();
        });
    });
    it('should return all unsold cars within a price range', (done) => {
      supertest(index)
        .get('/api/v1/car/?min_price=100000&max_price=150000&status=available')
        .expect('Content-type', /json/)
        .end((err, res) => {
          const firstResultElement = res.body[0];
          res.status.should.equal(200);
          res.error.should.equal(false);
          firstResultElement.id.should.equal(3);
          done();
        });
    });
    it('should return all cars of a specific body type', (done) => {
      supertest(index)
        .get('/api/v1/car/?body_type=car')
        .expect('Content-type', /json/)
        .end((err, res) => {
          const firstResultElement = res.body[0];
          res.status.should.equal(200);
          res.error.should.equal(false);
          firstResultElement.body_type.should.equal('car');
          done();
        });
    });
    it('should return all unsold cars of a specific make', (done) => {
      supertest(index)
        .get('/api/v1/car/?manufacturer=toyota&status=available')
        .expect('Content-type', /json/)
        .end((err, res) => {
          const firstResultElement = res.body[0];
          res.status.should.equal(200);
          res.error.should.equal(false);
          firstResultElement.id.should.equal(7);
          firstResultElement.model.should.equal('camry');
          done();
        });
    });
    it('should return all used unsold cars', (done) => {
      supertest(index)
        .get('/api/v1/car/?state=used&status=available')
        .expect('Content-type', /json/)
        .end((err, res) => {
          const firstResultElement = res.body[0];
          res.status.should.equal(200);
          res.error.should.equal(false);
          firstResultElement.id.should.equal(4);
          firstResultElement.manufacturer.should.equal('Sienna');
          done();
        });
    });
    it('should return all new unsold cars', (done) => {
      supertest(index)
        .get('/api/v1/car/?state=new&status=available')
        .expect('Content-type', /json/)
        .end((err, res) => {
          const secondResultElement = res.body[1];
          res.status.should.equal(200);
          res.error.should.equal(false);
          secondResultElement.id.should.equal(3);
          secondResultElement.manufacturer.should.equal('mazda');
          done();
        });
    });
    it('should return a specific car Ad', (done) => {
      supertest(index)
        .get('/api/v1/car/2')
        .expect('Content-type', /json/)
        .end((err, res) => {
          const firstResultElement = res.body[0];
          firstResultElement.manufacturer.should.not.equal('toyota');
          firstResultElement.manufacturer.should.equal('lexus');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should return a 404 error for an id of car Ad not present', (done) => {
      supertest(index)
        .get('/api/v1/car/10')
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(404);
          done();
        });
    });
    let token;
    before((done) => {
      const user = {
        email: 'dayo@gmail.com',
        password: '12346',
      };
      supertest(index)
        .post('/api/v1/users/auth/signin')
        .send(user)
        .end((err, res) => {
          // eslint-disable-next-line prefer-destructuring
          token = res.body.token;
          done();
        });
    });
    it('should post a car sale Ad', (done) => {
      const ad = {
        manufacturer: 'Honda',
        model: 'accord',
        price: 500000,
      };
      supertest(index)
        .post('/api/v1/car/')
        .set('Authorization', `Bearer ${token}`)
        .send(ad)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.message.should.equal('Posted successfully');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should mark a posted AD as sold', (done) => {
      const ad = {
        id: 1,
        status: 'sold',
      };
      supertest(index)
        .patch('/api/v1/car/1/')
        .set('Authorization', `Bearer ${token}`)
        .send(ad)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.message.should.equal('Updated successfully');
          res.body.editCar.status.should.equal('sold');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should update the price of a posted AD', (done) => {
      const ad = {
        id: 3,
        price: 650000,
      };
      supertest(index)
        .patch('/api/v1/car/3/')
        .set('Authorization', `Bearer ${token}`)
        .send(ad)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.message.should.equal('Updated successfully');
          res.body.editCar.price.should.equal(650000);
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should delete a posted AD record', (done) => {
      supertest(index)
        .delete('/api/v1/car/4/')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.message.should.equal('Deleted successfully');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });

  describe('TEST USER ENDPOINTS', () => {
    it('should sign up a user', (done) => {
      const user = {
        email: 'jameson10@gmail.com',
        password: '12354',
      };
      supertest(index)
        .post('/api/v1/users/auth/signup')
        .send(user)
        .expect('Content-type', /json/)
        .end((err, res) => {
          // eslint-disable-next-line no-unused-vars
          const { newUser } = res.body;
          res.body.newUser.should.equal(newUser);
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should signin a user', (done) => {
      const user = {
        email: 'dayo@gmail.com',
        password: '12346',
      };
      supertest(index)
        .post('/api/v1/users/auth/signin')
        .send(user)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.message.should.equal('Signed in successfully');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });

  describe('TEST ORDERS ENDPOINTS', () => {
    let token;
    before((done) => {
      const user = {
        email: 'dayo@gmail.com',
        password: '12346',
      };
      supertest(index)
        .post('/api/v1/users/auth/signin')
        .send(user)
        .end((err, res) => {
        // eslint-disable-next-line prefer-destructuring
          token = res.body.token;
          done();
        });
    });
    it('should make a purchase order', (done) => {
      const order = {
        car_id: 3,
        id: 2,
        amount: 500000,
        buyer: 4,
        status: 'pending',
      };
      supertest(index)
        .post('/api/v1/order/')
        .set('Authorization', `Bearer ${token}`)
        .send(order)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.message.should.equal('Posted successfully');
          res.body.newOrder.buyer.should.equal(4);
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should update the price of purchase order', (done) => {
      const order = {
        car_id: 3,
        id: 2,
        amount: 550000,
        buyer: 4,
        status: 'pending',
      };
      supertest(index)
        .patch('/api/v1/order/2/price')
        .set('Authorization', `Bearer ${token}`)
        .send(order)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.message.should.equal('Updated successfully');
          res.body.editOrder.amount.should.equal(550000);
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
        description: 'too high pricing',
      };
      supertest(index)
        .post('/api/v1/flag/')
        .send(report)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.body.message.should.equal('Thank you for reporting this problem');
          res.body.newFlag.id.should.equal(4);
          res.body.newFlag.reason.should.equal('pricing');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });
});
