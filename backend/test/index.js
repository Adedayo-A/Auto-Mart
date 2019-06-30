/* global describe:false, it:false, before:false, beforeEach:false */
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
    const user = {
      email: 'swede@gmail.com',
      password: '2211',
    };
    before((done) => {
      supertest(index)
        .post('/api/v1/users/auth/signin')
        .send(user)
        .end((err, res) => {
        // eslint-disable-next-line prefer-destructuring
          token = res.body.token;
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
          res.body.message.should.equal('result completed');
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
          // res.body.message.should.equal('result completed');
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
          // res.body.message.should.equal('result completed');
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
    it('should return a 404 error for an id of car Ad not present', (done) => {
      supertest(index)
        .get('/api/v1/car/10')
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-type', /json/)
        .end((err, res) => {
          res.status.should.equal(404);
          done();
        });
    });
    it('should post a car sale Ad', (done) => {
      const ad = {
        status: 'available',
        manufacturer: 'Honda',
        model: 'accord',
        price: 500000,
        body_type: 'car',
        owner: 'Bisola',
        state: 'new',
      };
      supertest(index)
        .post('/api/v1/car/')
        .set('Authorization', `Bearer ${token}`)
        .send(ad)
        .expect('Content-type', /json/)
        .end((err, res) => {
          // res.body.message.should.equal('Posted successfully');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
    it('should mark a posted AD as sold', (done) => {
      const ad = {
        id: 5,
        status: 'sold',
      };
      supertest(index)
        .patch('/api/v1/car/1/')
        .set('Authorization', `Bearer ${token}`)
        .send(ad)
        .expect('Content-type', /json/)
        .end((err, res) => {
          // res.body.message.should.equal('Updated successfully');
          // res.body.editCar.status.should.equal('sold');
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
          // res.body.message.should.equal('Updated successfully');
          // res.body.editCar.price.should.equal(650000);
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
          // res.body.message.should.equal('Deleted successfully');
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        });
    });
  });
});
