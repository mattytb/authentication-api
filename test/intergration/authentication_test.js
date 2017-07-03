import {expect} from 'chai';
import SuperTest from 'supertest';
import Should from 'should';

const server = SuperTest.agent("http://localhost:8080");

let token,
    userId;

describe('Authentication', () => {

  describe('Int::when a user registers, it', () => {

    it('should return the user a token when user supplies name, password and email', (done) => {
        server
        .post('/api/users')
        .send({name : 'Super Test', password : 'Password', email : 'email@supertester.com'})
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

    it('should allow the user to access data requiring validation when requesting with token', (done) => {
        server
        .get('/api/users')
        .send({userId: userId, token:token})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          var length = res.body.length;
          res.body[res.body.length -1].name.should.equal('Super Test');
          done();
        });
    });

    it('should not allow another user to use the newly created users email', (done) => {
        server
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

  describe('Int::when a users token has expired and he needs to re-authenticate, it', () => {

    it('should allow the user to re-authenticate with their email and password', (done) => {
        server
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

    it('should allow the user to login to pages requiring validation when requesting with the new token', (done) => {
        server
        .get('/api/users')
        .send({userId:userId, token:token})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          var length = res.body.length;
          res.body[res.body.length -1].name.should.equal('Super Test');
          done();
        });
    });

    it('should not allow the user to re-authenticate with incorrect password', (done) => {
        server
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

  describe('Int::when a user tries to authenticate and does not provide full credentials', () => {

    it('should not supply a token', (done) => {
        server
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

  describe('Int::when a user tries to access data that requires authentication without a token', () => {

    it('should not allow access to the data', (done) => {
        server
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

  describe('Int::when a user deletes himself', () => {

    it('should return success message including the users deleted id', (done) => {
        server
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

    it('should not allow the user to authenticate with deleted name and password', (done) => {
        server
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

  });

});