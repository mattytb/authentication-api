import { expect } from 'chai';
import SuperTest from 'supertest';
import Should from 'should';
import express from 'express';

const app = require('../../lib/server');


let authorizationToken,
    userId,
    refreshToken;   
    
describe('Api::when a user registers', () => {

    it('it should return the user a claim when user supplies name, password and email and clientId', (done) => {
        SuperTest(app)
        .post('/api/users')
        .send({name : 'Super Test', password : 'Password', email : 'email@supertester.com', clientId:'test'})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.success.should.equal(true);
          authorizationToken = res.body.claim.authorizationToken;
          refreshToken = res.body.claim.refreshToken;
          done();
        });
    });

    it('it should not allow the user to register again when user supplies name, password and email and different client id', (done) => {
      SuperTest(app)
      .post('/api/users')
      .send({'name' : 'Super Test', password : 'Password', email : 'email@supertester.com', clientId:'tester'})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(409);
        res.body.success.should.equal(false);
        done();
      });
  });

  it('it should allow the user to re-authorize with their email and password', (done) => {
    SuperTest(app)
      .post('/api/authorize')
      .send({email : 'email@supertester.com', password : 'Password', clientId:'tester'})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.success.should.equal(true);
        done();
      });
  });

  it('should allow the user to access data requiring validation when requesting with a authorizaton token', (done) => {
    SuperTest(app)
      .get('/api/users')
      .set({ Authorization:`Bearer ${authorizationToken}`})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.payload[res.body.payload.length -1].name.should.equal('Super Test');
        done();
      });
  });

  it('it should not allow another user to use the newly created users email', (done) => {
    SuperTest(app)
      .post('/api/users')
      .send({name : 'Super Test2', password : 'Password2', email : 'email@supertester.com', clientId:'tester'})
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(409);
        res.body.success.should.equal(false);
        done();
      });
  });

});
  
describe('Api::when a users authorization token has expired and they use the refresh token', () => {

  it('it should allow the user to refresh the authorization token with the refresh token', (done) => {
    SuperTest(app)
      .get(`/api/users?refreshToken=${refreshToken}`)
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.payload[res.body.payload.length -1].name.should.equal('Super Test');
        authorizationToken = res.headers.Authorization;
        console.log(authorizationToken);
        done();
      });
  });
});


//     it('it should allow the user to login to pages requiring validation when requesting with the new token', (done) => {
//       SuperTest(app)
//         .get('/api/users')
//         .send({userId:userId, token:token})
//         .expect("Content-type",/json/)
//         .expect(200)
//         .end(function(err,res){
//           res.status.should.equal(200);
//           res.body.users[res.body.users.length -1].name.should.equal('Super Test');
//           done();
//         });
//     });

//     it('it should not allow the user to re-authorize with incorrect password', (done) => {
//       SuperTest(app)
//         .post('/api/authorize')
//         .send({email : 'email@supertester.com', password : 'password-wrong'})
//         .expect("Content-type",/json/)
//         .expect(401)
//         .end(function(err,res){
//           res.status.should.equal(401);
//           res.body.success.should.equal(false);
//           done();
//         });
//     });
// });

//   describe('Api::when a user tries to authorize and does not provide full credentials', () => {

//     it('it should not supply a token', (done) => {
//       SuperTest(app)
//         .post('/api/users')
//         .send({email : 'email@supertester.com', password : 'Password'})
//         .expect("Content-type",/json/)
//         .expect(403)
//         .end(function(err,res){
//           res.status.should.equal(403);
//           res.body.success.should.equal(false);
//           done();
//         });
//     });

//   });

//   describe('Api::when a user tries to access data that requires authorization without a token', () => {

//     it('it should not allow access to the data', (done) => {
//       SuperTest(app)
//         .get('/api/users')
//         .send({userId:userId, token:''})
//         .expect("Content-type",/json/)
//         .expect(500)
//         .end(function(err,res){
//           res.status.should.equal(500);
//           res.body.success.should.equal(false);
//           done();
//         });
//     });
// });

//   describe('Api::when a user deletes himself', () => {

//     it('it should return success message including the users deleted id', (done) => {
//       SuperTest(app)
//         .delete(`/api/users/${userId}`)
//         .send({token:token, userId:userId})
//         .expect("Content-type",/json/)
//         .expect(200)
//         .end(function(err,res){
//           res.status.should.equal(200);
//           res.body.message.should.equal(`User was successfully deleted ${userId}`);
//           done();
//         });
//     });

//     it('it should not allow the user to authorize with deleted name and password', (done) => {
//       SuperTest(app)
//         .post('/api/authorize')
//         .send({email : 'email@supertester.com', password : 'Password'})
//         .expect("Content-type",/json/)
//         .expect(401)
//         .end(function(err,res){
//           res.status.should.equal(401);
//           res.body.success.should.equal(false);
//           done();
//         });
//     });

//     it('it should not allow the user to authorize with deleted name and password on the mobile', (done) => {
//       SuperTest(app)
//         .post('/api/authorize')
//         .send({email : 'email@supertester.com', password : 'Password', fromMobile:true})
//         .expect("Content-type",/json/)
//         .expect(401)
//         .end(function(err,res){
//           res.status.should.equal(401);
//           res.body.success.should.equal(false);
//           done();
//         });
//     });
//   });
  
