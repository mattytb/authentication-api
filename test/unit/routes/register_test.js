import { registerUser } from '../../../lib/routes/register';
import * as AuthorizationService from '../../../lib/services/authorizationService';
import * as Chai from 'chai';
import Sinon from 'sinon';

const Expect = Chai.expect,
	req = {
		body:{
			name:'name',
			password:'password',
			email:'matt@email.com',
			clientId:'browser'
		}
	},
	claim = {
		name:'name',
		authorizationToken:'new token',
		_id:"123"
	}

let sandbox = Sinon.sandbox.create(),
	res = { 
		json:(obj) => { res.body = obj },
		status:function(status) {
			res.statusValue = status;
        	return this;
    	},
		jsonError:(obj) => { 
			res.body = obj,
			res.statusValue = obj.status 
		}
    };

describe('Unit::Route register', () => {

	describe('When registering', () => {

		it('it should call the authorization service to authorize user with their name, password, email and the client id', () => {
			Expect(authorizingUser).calledWith(req.body.name, req.body.password, req.body.email, req.body.clientId);
		});
		it('it should have set the body success to true', () => {
			Expect(res.body.success).to.equal(true);
		});
		it('it should have set the body claim', () => {
			Expect(res.body.claim).to.equal(claim);
		});
		it('it should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});

		let authorizingUser;
	
		beforeEach(() => {
		 	authorizingUser = sandbox.stub(AuthorizationService, 'authorizeNewUser').returnsPromise();
		 	authorizingUser.resolves(claim);
			registerUser(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

	});

	describe('When failing to register because the users email already exists, it', () => {

		let authorizingUser,
			error = new Error("message from error");
			error.status = 409;
	
		beforeEach(() => {
		 	authorizingUser = sandbox.stub(AuthorizationService, 'authorizeNewUser').returnsPromise();
		 	authorizingUser.rejects(error);
			registerUser(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('it should attempt to call the authorization service to authorize user with their name, password and email', () => {
			Expect(authorizingUser).calledWith(req.body.name, req.body.password, req.body.email, req.body.clientId);
		});

		it('should set message to the success message on the response', () => {
			Expect(res.body.message).to.equal(error.message);
		});

		it('should have a response status of the error', (done) => {
			Expect(res.statusValue).to.equal(error.status);
			done();
		});
	});
});

