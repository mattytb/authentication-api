import { expect } from 'chai';
import SuperTest from 'supertest';
import Should from 'should';
import express from 'express';

const app = require('../../lib/server');


let token,
    userId,
    mobileToken;   
    
  describe('Api::when a user registers', () => {

    it('it should return the user a token when user supplies name, password and email', (done) => {
        SuperTest(app)
        .post('/api/users')
        .send({'name' : 'Super Test', password : 'Password', email : 'email@supertester.com'})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.success.should.equal(true);
          token = res.body.token;
          userId = res.body.userId;
          done();
        });
    });

    it('it should not allow the user to register again on the mobile when user supplies name, password and email', (done) => {
      SuperTest(app)
      .post('/api/users')
      .send({'name' : 'Super Test', password : 'Password', email : 'email@supertester.com', fromMobile:true})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(409);
        res.body.success.should.equal(false);
        done();
      });
  });

  it('it should allow the user to re-authenticate with their email and password on the mobile', (done) => {
    SuperTest(app)
      .post('/api/authenticate')
      .send({email : 'email@supertester.com', password : 'Password', fromMobile:true})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.success.should.equal(true);
        mobileToken = res.body.token;
        done();
      });
  });

    it('should allow the user to access data requiring validation when requesting with token', (done) => {
      SuperTest(app)
        .get('/api/users')
        .send({userId: userId, token:token})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.users[res.body.users.length -1].name.should.equal('Super Test');
          done();
        });
    });

    it('should allow the mobile user to access data requiring validation  with mobile token', (done) => {
      SuperTest(app)
        .get('/api/users')
        .send({userId: userId, token:mobileToken, fromMobile:true})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.users[res.body.users.length -1].name.should.equal('Super Test');
          done();
        });
    });

    it('it should not allow another user to use the newly created users email', (done) => {
      SuperTest(app)
        .post('/api/users')
        .send({name : 'Super Test2', password : 'Password2', email : 'email@supertester.com'})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(409);
          res.body.success.should.equal(false);
          done();
        });
    });
  });

 

  describe('Api::when a users token has expired and he needs to re-authenticate, it', () => {

    it('it should allow the user to re-authenticate with their email and password', (done) => {
      SuperTest(app)
        .post('/api/authenticate')
        .send({email : 'email@supertester.com', password : 'Password'})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.success.should.equal(true);
          token = res.body.token;
          userId = res.body.userId;
          done();
        });
    });

    it('it should allow the user to login to pages requiring validation when requesting with the new token', (done) => {
      SuperTest(app)
        .get('/api/users')
        .send({userId:userId, token:token})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.users[res.body.users.length -1].name.should.equal('Super Test');
          done();
        });
    });

    it('it should not allow the user to re-authenticate with incorrect password', (done) => {
      SuperTest(app)
        .post('/api/authenticate')
        .send({email : 'email@supertester.com', password : 'password-wrong'})
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err,res){
          res.status.should.equal(401);
          res.body.success.should.equal(false);
          done();
        });
    });
});

  describe('Api::when a user tries to authenticate and does not provide full credentials', () => {

    it('it should not supply a token', (done) => {
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

  describe('Api::when a user tries to access data that requires authentication without a token', () => {

    it('it should not allow access to the data', (done) => {
      SuperTest(app)
        .get('/api/users')
        .send({userId:userId, token:''})
        .expect("Content-type",/json/)
        .expect(500)
        .end(function(err,res){
          res.status.should.equal(500);
          res.body.success.should.equal(false);
          done();
        });
    });
});

  describe('Api::when a user deletes himself', () => {

    it('it should return success message including the users deleted id', (done) => {
      SuperTest(app)
        .delete(`/api/users/${userId}`)
        .send({token:token, userId:userId})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.message.should.equal(`User was successfully deleted ${userId}`);
          done();
        });
    });

    it('it should not allow the user to authenticate with deleted name and password', (done) => {
      SuperTest(app)
        .post('/api/authenticate')
        .send({email : 'email@supertester.com', password : 'Password'})
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err,res){
          res.status.should.equal(401);
          res.body.success.should.equal(false);
          done();
        });
    });

    it('it should not allow the user to authenticate with deleted name and password on the mobile', (done) => {
      SuperTest(app)
        .post('/api/authenticate')
        .send({email : 'email@supertester.com', password : 'Password', fromMobile:true})
        .expect("Content-type",/json/)
        .expect(401)
        .end(function(err,res){
          res.status.should.equal(401);
          res.body.success.should.equal(false);
          done();
        });
    });
  });
  
