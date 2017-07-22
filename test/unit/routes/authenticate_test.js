import * as AuthenticationService from '../../../services/authenticationService';
import { getAuthToken, getAuthStatus } from '../../../routes/authenticate';
import * as VerifyUser from '../../../modules/verifyUser';
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

	describe('When re-authenticating a user', () => {

		it('it should call the authentication service to authenticate user with their email and password', () => {
			Expect(authenticatingUser).calledWith(req.body.email, req.body.password);
		});

		it('it should have set the user\'s id on the response', () => {
			Expect(res.body.userId).to.equal(authenticatedUser._id);
		});

	  	it('it should have set the token on the response', () => {
			Expect(res.body.token).to.equal(authenticatedUser.token);
		});

		it('it should set success to true on the response', () => {
			Expect(res.body.success).to.be.true;
		});

		it('it should set message to the success message on the response', () => {
			Expect(res.body.message).to.equal('Enjoy your token');
		});

		it('it should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});

		let authenticatingUser;
	
		beforeEach(() => {
		 	authenticatingUser = sandbox.stub(AuthenticationService, 'authenticateUser').returnsPromise();
		 	authenticatingUser.resolves(authenticatedUser);
			getAuthToken(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

	});

	describe('When not re-authenticating because user is not found, it', () => {

		it('it should attempt to call the authentication service to authenticate user with their email and password', () => {
			Expect(authenticatingUser).calledWith(req.body.email, req.body.password);
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
		
		const rejectedUserClientMessage = 'rejected message from user client';

		let authenticatingUser;
	
		beforeEach(() => {
		 	authenticatingUser = sandbox.stub(AuthenticationService, 'authenticateUser').returnsPromise();
		 	authenticatingUser.rejects(new Error(rejectedUserClientMessage));
		 	getAuthToken(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

	});

	describe('When checking the status of authenticated user', () => {

		it('it set the success value on the response to true', () => {
			Expect(res.body.success).to.equal(true);
		});

		it('it should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});
	
		beforeEach(() => {
		 	getAuthStatus(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

	});
});