import { registerUser } from '../../../routes/register';
import { getAuthToken } from '../../../routes/authenticate';
import * as ApplyAuthToken from '../../../modules/applyAuthToken';
import * as UserClient from '../../../clients/userClient';
import * as Chai from 'chai';
import Sinon from 'sinon';

const Expect = Chai.expect,
	req = {
		body:{
			name:'name',
			password:'password',
			email:'matt@email.com'
		}
	},
	authenticatedToken = 'Token',
	authenticatedUser = {
		name:'name',
		password:'password',
		email:'name@email.com',
		token:authenticatedToken,
		_id:123
	}

let sandbox = Sinon.sandbox.create(),
	res = { 
		json:(obj) => { res.body = obj },
		status:function(status) {
			res.statusValue = status;
        	return this;
    	}
    };

describe('Unit::Route register', () => {

	describe('When registering, it', () => {

		let fetchUserByEmail,
			applyTokenToUser,
			newUser = {},
			saveNewUser;
	
		beforeEach(() => {
		 	fetchUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
		 	fetchUserByEmail.rejects();
		 	saveNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
		 	saveNewUser.resolves(newUser);
			applyTokenToUser = sandbox.stub(ApplyAuthToken, 'applyAuthToken').returnsPromise();
			applyTokenToUser.resolves(authenticatedUser);
			registerUser(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should attempt to find user by email', () => {

			Expect(fetchUserByEmail).calledWith(req.body.email);

		});

		it('should save the new user', () => {

			Expect(saveNewUser).calledWith(req.body.name, req.body.password, req.body.email);

		});

		it('should save the auth token to the user', () => {

			Expect(applyTokenToUser).calledWith(newUser);

		});

		it('should have set the token on the response', () => {

			Expect(res.body.token).to.equal(authenticatedUser.token);

		});

		it('should have set the id of the user on the response', () => {

			Expect(res.body.userId).to.equal(authenticatedUser._id);

		});

		it('should set success to true on the response', () => {

			Expect(res.body.success).to.be.true;

		});

		it('should set message to the success message on the response', () => {
			
			Expect(res.body.message).to.equal('Enjoy your token!');

		});

		it('should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});

	});

	describe('When failing to register because the users email already exists, it', () => {

		let fetchUserByEmail,
			applyTokenToUser,
			newUser = {},
			saveNewUser;
	
		beforeEach(() => {
		 	fetchUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
		 	fetchUserByEmail.resolves();
		 	saveNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
			applyTokenToUser = sandbox.stub(ApplyAuthToken, 'applyAuthToken').returnsPromise();
			registerUser(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should attempt to find user by name', () => {

			Expect(fetchUserByEmail).calledWith(req.body.email);

		});

		it('should not attempt save the new user', () => {

			Expect(saveNewUser).not.calledWith(req.body.name, req.body.password, req.body.email);

		});

		it('should not attempt to save the auth token to the user', () => {

			Expect(applyTokenToUser).not.calledWith(newUser);

		});

		it('should set success to false on the response', () => {

			Expect(res.body.success).to.be.false;

		});

		it('should set message to the success message on the response', () => {
			
			Expect(res.body.message).to.equal('Sorry, already a user with this email');

		});

		it('should have a response status of 409', (done) => {
			Expect(res.statusValue).to.equal(409);
			done();
		});

	});

	describe('When failing to register because saving of the user fails, it', () => {

		let fetchUserByEmail,
			applyTokenToUser,
			saveNewUser,
			newUser = {},
			saveNewUserClientFailureMessage = "Failed to save new user";
	
		beforeEach(() => {
		 	fetchUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
		 	fetchUserByEmail.rejects();
		 	saveNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
		 	saveNewUser.rejects(saveNewUserClientFailureMessage);
			applyTokenToUser = sandbox.stub(ApplyAuthToken, 'applyAuthToken').returnsPromise();
			registerUser(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should attempt to find user by email', () => {

			Expect(fetchUserByEmail).calledWith(req.body.email);

		});

		it('should attempt to save the new user', () => {

			Expect(saveNewUser).calledWith(req.body.name, req.body.password, req.body.email);

		});

		it('should not attempt to save the auth token to the user', () => {

			Expect(applyTokenToUser).not.calledWith(newUser);

		});

		it('should set success to false on the response', () => {

			Expect(res.body.success).to.be.false;

		});

		it('should set message to the success message on the response', () => {
			
			Expect(res.body.message).to.equal(saveNewUserClientFailureMessage);

		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});

	});

	describe('When failing to register because applying the auth token fails, it', () => {

		let fetchUserByEmail,
			applyTokenToUser,
			newUser = {},
			saveNewUser,
			authTokenClientFailureMessage = "failed to authenticate";
	
		beforeEach(() => {
		 	fetchUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
		 	fetchUserByEmail.rejects();
		 	saveNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
		 	saveNewUser.resolves(newUser);
			applyTokenToUser = sandbox.stub(ApplyAuthToken, 'applyAuthToken').returnsPromise();
			applyTokenToUser.rejects(authTokenClientFailureMessage);
			registerUser(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should attempt to find user by email', () => {

			Expect(fetchUserByEmail).calledWith(req.body.email);

		});

		it('should save the new user', () => {

			Expect(saveNewUser).calledWith(req.body.name, req.body.password, req.body.email);

		});

		it('should not attempt to save the auth token to the user', () => {

			Expect(applyTokenToUser).calledWith(newUser);

		});

		it('should set success to false on the response', () => {

			Expect(res.body.success).to.be.false;

		});

		it('should set message to the success message on the response', () => {
			
			Expect(res.body.message).to.equal(authTokenClientFailureMessage);

		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});

	});

});

