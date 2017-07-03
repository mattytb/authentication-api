import { getAuthToken } from '../../../routes/authenticate';
import * as ApplyAuthToken from '../../../modules/applyAuthToken';
import * as UserClient from '../../../clients/userClient';
import * as Chai from 'chai';
import Sinon from 'sinon';

const Expect = Chai.expect,
	request = {
		body:{
			email:'matt@email.com',
			password:'password'
		}
	},
	req = request,
	authenticatedToken = 'Token',
	authenticatedUser = {
		email:'matt@email.com',
		password:'password',
		token:authenticatedToken,
		_id:123
	};

let sandbox = Sinon.sandbox.create(),
	res = { 
		json:(obj) => { res.body = obj },
		status:function(status) {
			res.statusValue = status;
        	return this;
    	}
    };

describe('Unit::Route authenticate', () => {

	describe('When authenticating, it', () => {

		let fetchUser,
			applyTokenToUser,
			promisedUser = {};
	
		beforeEach(() => {
		 	fetchUser = sandbox.stub(UserClient, 'getUserByEmailAndPassword').returnsPromise();
		 	fetchUser.resolves(promisedUser);
			applyTokenToUser = sandbox.stub(ApplyAuthToken, 'applyAuthToken').returnsPromise();
			applyTokenToUser.resolves(authenticatedUser);
			getAuthToken(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		it('should get user by email and password', () => {
			Expect(fetchUser).calledWith(req.body.email, req.body.password);
		});

		it('should apply the auth token to the user', () => {
			Expect(applyTokenToUser).calledWith(promisedUser);
		});

		it('should have set the user\'s id on the response', () => {

			Expect(res.body.userId).to.equal(authenticatedUser._id);

		});

	  	it('should have set the token on the response', () => {

			Expect(res.body.token).to.equal(authenticatedUser.token);

		});

		it('should set success to true on the response', () => {

			Expect(res.body.success).to.be.true;

		});

		it('should set message to the success message on the response', () => {

			Expect(res.body.message).to.equal('Enjoy your token');

		});

		it('should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();

		});

	});

	describe('When not authenticating because user is not found, it', () => {
		
		const rejectedUserClientMessage = 'rejected message from user client';

		let fetchUser;
	
		beforeEach(() => {
		 	fetchUser = sandbox.stub(UserClient, 'getUserByEmailAndPassword').returnsPromise();
		 	fetchUser.rejects(rejectedUserClientMessage);
		 	getAuthToken(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		it('should attempt to get user by email and password', () => {
			Expect(fetchUser).calledWith(req.body.email, req.body.password);
		});

  
	  	it('should set the success value to false', () => {

			Expect(res.body.success).to.be.false;

		});

		it('should set message value to the error message', () => {

			Expect(res.body.message).to.equal(rejectedUserClientMessage);

		});

		it('should have a response status of 401', (done) => {
			Expect(res.statusValue).to.equal(401);
			done();
		});

	});

	describe('When not authenticating because applying auth token fails, it', () => {

		const rejectedApplyAuthTokenMessage = 'rejected message from apply user to token module',
			promisedUser = {};

		let fetchUser,
		applyTokenToUser;
	
		beforeEach(() => {

		 	fetchUser = sandbox.stub(UserClient, 'getUserByEmailAndPassword').returnsPromise();
		 	fetchUser.resolves(promisedUser);

		 	applyTokenToUser = sandbox.stub(ApplyAuthToken, 'applyAuthToken').returnsPromise();
			applyTokenToUser.rejects(rejectedApplyAuthTokenMessage);

		 	getAuthToken(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		it('should get user by email and password', () => {

			Expect(fetchUser).calledWith(req.body.email, req.body.password);
		});

		it('should attempt to apply the auth token to the user', () => {

			Expect(applyTokenToUser).calledWith(promisedUser);

		});

	  	it('should set success to false', () => {

			Expect(res.body.success).to.be.false;

		});

		it('should set message to the error message from the apply auth token module', () => {

			Expect(res.body.message).to.equal(rejectedApplyAuthTokenMessage);

		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});

	});

});