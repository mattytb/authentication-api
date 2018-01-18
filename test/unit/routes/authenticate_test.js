import * as AuthorizationService from '../../../lib/services/authorizationService';
import { getAuthStatus, authorize } from '../../../lib/routes/authorize';
import * as Chai from 'chai';
import Sinon from 'sinon';

const Expect = Chai.expect,
	request = {
		body:{
			email:'matt@email.com',
			password:'password',
			clientId:'clientId'
		}
	},
	req = request,
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
		},
		jsonAuthenticate:(req, res) => { 
			res.body = res.body,
			res.statusValue = res.statusValue 
		}
    };

describe('Unit::Route authorize', () => {

	describe('When re-authorizing a web user', () => {

		it('it should call the authorization service to authorize user with their email and password and client id', () => {
			Expect(authorizingUser).calledWith(req.body.email, req.body.password, req.body.clientId);
		});

		it('it should have set the claim on the response', () => {
			Expect(res.body.claim).to.equal(claim);
		});

		it('it should set success to true on the response', () => {
			Expect(res.body.success).to.be.true;
		});

		it('it should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});

		let authorizingUser;
	
		beforeEach(() => {
		 	authorizingUser = sandbox.stub(AuthorizationService, 'authorizeUser').returnsPromise();
		 	authorizingUser.resolves(claim);
			authorize(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});
	});

	describe('When not re-authorizing because user is not found, it', () => {

		it('it should attempt to call the authorization service to authorize user with their email, password and client id', () => {
			Expect(authorizingUser).calledWith(req.body.email, req.body.password, req.body.clientId);
		});

		it('should set message value to the error message', () => {
			Expect(res.body.message).to.equal(rejectedUserClientMessage);
		});

		it('should have a response status of 401', () => {
			Expect(res.statusValue).to.equal(401);
		});
		
		const rejectedUserClientMessage = 'rejected message from user client';

		let authorizingUser,
			result,
			error = new Error(rejectedUserClientMessage);
			error.status = 401;
	
		beforeEach(() => {
			
		 	authorizingUser = sandbox.stub(AuthorizationService, 'authorizeUser').returnsPromise();
		 	authorizingUser.rejects(error);
		 	result = authorize(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

	});
});