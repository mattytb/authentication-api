import { expect } from 'chai';
import SuperTest from 'supertest';
import Should from 'should';
import express from 'express';
import Config from '../../lib/config';

const app = require('../../lib/server');

let authorizationToken,
    userId,
    refreshToken,
    now = new Date(),
    expires = now.setMinutes(now.getMinutes() + 30),
    expired = now.setMinutes(now.getMinutes() - 30);  
     
    
describe('Api::when a user registers and provides the correct information', () => {

    it('it should return the user a claim', (done) => {
      SuperTest(app)
        .post('/api/users')
        .send({name : 'Super Test', password : 'Password', email : 'email@supertester.com', clientId:'tester', expires:expires})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.success.should.equal(true);
          authorizationToken = res.body.claim.authorizationToken;
          refreshToken = res.body.claim.refreshToken;
          userId = res.body.claim.userId
          done();
        });
    });

    it('it should not allow the user to register with the registered email again', (done) => {
      SuperTest(app)
      .post('/api/users')
      .send({'name' : 'Super Test', password : 'Password', email : 'email@supertester.com', clientId:'tester', expires:expires})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(409);
        res.body.success.should.equal(false);
        done();
      });
  });

  it('it should not allow a different user to use the same email', (done) => {
    SuperTest(app)
      .post('/api/users')
      .send({name : 'Super Test2', password : 'Password2', email : 'email@supertester.com', clientId:'tester', expires:expires})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(409);
        res.body.success.should.equal(false);
        done();
      });
  });

  it('should allow access to data requiring authorization with the new authorizaton token found on the claim', (done) => {
    SuperTest(app)
      .get('/api/users')
      .set({ Authorization:`Bearer ${authorizationToken}`})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.users[res.body.users.length -1].name.should.equal('Super Test');
        done();
      });
  });

});

describe('Api::when a user has been logged out and provides the username and password they previously supplied', () => {

  it('it should allow them to authorize', (done) => {
    SuperTest(app)
      .post('/api/authorize')
      .send({email : 'email@supertester.com', password : 'Password', clientId:'tester', expires:expires})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.success.should.equal(true);
        refreshToken = res.body.claim.refreshToken;
        authorizationToken = res.body.claim.authorizationToken;
        done();
      });
  });

  it('it should not allow the user to authorize with an incorrect password', (done) => {
    SuperTest(app)
      .post('/api/authorize')
      .send({email : 'email@supertester.com', password : 'password-wrong', clientId:'tester', expires:expires})
      .expect("Content-type",/json/)
      .expect(401)
      .end(function(err,res){
        res.status.should.equal(401);
        res.body.success.should.equal(false);
        done();
      });
  });

  it('should allow access to the data requiring authorization with the authorizaton token found on the new claim provided', (done) => {
    SuperTest(app)
      .get('/api/users')
      .set({ Authorization:`Bearer ${authorizationToken}`})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.users[res.body.users.length -1].name.should.equal('Super Test');
        done();
      });
  });

});

describe('Api::when a user tries to access data that requires authorization', () => {

  it('it should not allow the user access with a invalid authorizaton token', (done) => {
    SuperTest(app)
      .get('/api/users')
      .set({ Authorization:`Bearer invalid`})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(401);
        res.body.success.should.equal(false);
        done();
      });
  });

  it('it should not allow the user access with a no authorizaton token', (done) => {
    SuperTest(app)
      .get('/api/users')
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(401);
        res.body.success.should.equal(false);
        done();
      });
  });

});
  
describe('Api::when a user requests a new authorization token with a valid refresh token', () => {

  it('it should return the user an authorization token', (done) => {
    SuperTest(app)
      .post(`/api/refreshAuthorizationToken`)
      .send({refreshToken : refreshToken})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.success.should.equal(true);
        authorizationToken = res.body.authorizationToken;
        done();
      });
  });

  it('it should allow the user to access data requiring authorization, with the new authorizaton token', (done) => {
    SuperTest(app)
      .get('/api/users')
      .set({ Authorization:`Bearer ${authorizationToken}`})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.users[res.body.users.length -1].name.should.equal('Super Test');
        done();
      });
  });

});

describe('Api::when a user tries to authorize and does not provide full credentials', () => {

  it('it should not supply an authorization token', (done) => {
    SuperTest(app)
      .post('/api/users')
      .send({email : 'email@supertester.com', password : 'Password'})
      .expect("Content-type",/json/)
      .expect(403)
      .end(function(err,res){
        res.status.should.equal(403);
        res.body.success.should.equal(false);
        done();
      });
  });

});

describe('Api::when a user deletes himself', () => {

    it('it should return a success message including the users deleted id', (done) => {
      SuperTest(app)
        .delete(`/api/users/${userId}`)
        .set({ Authorization:`Bearer ${authorizationToken}`})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.message.should.equal(`${userId} User was successfully deleted`);
          done();
        });
    });

    it('it should not allow the user to authorize with deleted name and password', (done) => {
      SuperTest(app)
        .post('/api/authorize')
        .send({email : 'email@supertester.com', password : 'Password'})
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err,res){
          res.status.should.equal(403);
          res.body.success.should.equal(false);
          done();
        });
    });

});

describe('Api::when a user tries to refresh with an expired refresh token', () => {

  it('', (done) => {

    SuperTest(app)
    .post('/api/users')
    .send({name : 'Super Test', password : 'Password', email : 'email@supertester.com', clientId:'tester', expires:expired})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.success.should.equal(true);
      authorizationToken = res.body.claim.authorizationToken;
      refreshToken = res.body.claim.refreshToken;
      userId = res.body.claim.userId
      done();
    });

  });

  it('', (done) => {

    SuperTest(app)
      .post('/api/authorize')
      .send({password : 'Password', email : 'email@supertester.com', clientId:'testforanotherclaim', expires:expires})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.success.should.equal(true);
        done();
      });

  });

  it('it should not return the user an authorization token', (done) => {

    SuperTest(app)
      .post(`/api/refreshAuthorizationToken`)
      .send({refreshToken : refreshToken})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(401);
        res.body.success.should.equal(false);
        done();
      });

  });

  it('', (done) => {
    SuperTest(app)
      .delete(`/api/users/${userId}`)
      .set({ Authorization:`Bearer ${authorizationToken}`})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.message.should.equal(`${userId} User was successfully deleted`);
        done()
      });
  });
  
});
 
