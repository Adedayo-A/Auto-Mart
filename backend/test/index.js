const supertest = require('supertest');
const should = require('should');
const chai = require('chai');
const index = require("../index.js");

describe('Test GET endpoint', () => {
  it( 'should return all unsold cars', (done) => {
    supertest(index)
      .get('/api/v1/car/')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
  });
});

describe('Test GET endpoint', () => {
  it( 'should return all unsold cars within a price range', (done) => {
    supertest(index)
      .get('/api/v1/car/')
      .expect('Content-type',/json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
  });
});

describe('Test GET endpoint', () => {
  it( 'should return a specific car', (done) => {
    supertest(index)
      .get('/api/v1/car/:id/id=2')
      .expect('Content-type',/json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
  });
});

describe('Test POST endpoint', () => {
  it('should add a user', (done) => {
    const user = {
      email: 'jameson@gmail.com',
      password: '12354',
    }
    supertest(index)
      .post('/api/v1/users/auth/signup')
      .send(user)
      .expect('Content-type',/json/)
      .expect(200)
      .end((err, res)=>{
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
  });
});

describe('Test POST endpoint', () => {
  it('should verify a user', (done) => {
    const user = {
      email: 'dayo@gmail.com',
      password: '12346',
    }
    supertest(index)
      .post('/api/v1/users/auth/signin')
      .send(user)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res)=>{
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      });
  });
});
