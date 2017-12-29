import { registerUser } from '../../../lib/routes/register';
import * as AuthenticationService from '../../../lib/services/authenticationService';
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
		token:'new token',
		_id:"123"
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

	describe('When registering', () => {

		it('it should call the authentication service to authenticate user with their name, password, email and the client id', () => {
			Expect(authenticatingUser).calledWith(req.body.name, req.body.password, req.body.email, req.body.clientId);
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

		let authenticatingUser;
	
		beforeEach(() => {
		 	authenticatingUser = sandbox.stub(AuthenticationService, 'authenticateNewUser').returnsPromise();
		 	authenticatingUser.resolves(claim);
			registerUser(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

	});

	describe('When failing to register because the users email already exists, it', () => {

		let authenticatingUser;
	
		beforeEach(() => {
		 	authenticatingUser = sandbox.stub(AuthenticationService, 'authenticateNewUser').returnsPromise();
		 	authenticatingUser.rejects(new Error("message from error"));
			registerUser(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('it should attempt to call the authentication service to authenticate user with their name, password and email', () => {
			Expect(authenticatingUser).calledWith(req.body.name, req.body.password, req.body.email, req.body.clientId);
		});

		it('should set success to false on the response', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set message to the success message on the response', () => {
			Expect(res.body.message).to.equal('message from error');
		});

		it('should have a response status of 409', (done) => {
			Expect(res.statusValue).to.equal(409);
			done();
		});
		
	});

});

