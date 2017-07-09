import * as Chai from 'chai';
import Sinon from 'sinon';
import * as AuthenticationService from '../../../services/authenticationService';
import { authenticate } from '../../../routes/facebookAuthenticate';

const Expect = Chai.expect;

describe('Unit::Route facebookAuthenticate', () => {

	let sandbox = Sinon.sandbox.create(),
	res = { 
		json:(obj) => { res.body = obj },
		status:function(status) {
			res.statusValue = status;
        	return this;
    	}
    };
	
	describe('When authenticating a facebook user', () => {

		it('should request a facebook user using the access token provided', () => {
			Expect(authenticatingUser).calledWith(req.body.accessToken);
		});

		it('it should have set the user\'s id on the response', () => {
			Expect(res.body.userId).to.equal(authenticatedUser._id);
		});

	  	it('it should have set the token on the response', () => {
			Expect(res.body.token).to.equal(authenticatedUser.token);
		});

		it('it should have set the users name on the response', () => {
			Expect(res.body.name).to.equal(authenticatedUser.name);
		});

		it('it should have set the users image on the response', () => {
			Expect(res.body.image).to.equal(authenticatedUser.image);
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

		let authenticatingUser,
			authenticatedUser = {
			name:'name',
			password:'password',
			email:'name@email.com',
			image:'image.jpg',
			token:'new token',
			_id:"123"
		}
	
		beforeEach(() => {
		 	authenticatingUser = sandbox.stub(AuthenticationService, 'authenticateFacebookUser').returnsPromise();
		 	authenticatingUser.resolves(authenticatedUser);
			authenticate(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		const req = {
			body:{
				accessToken: 'facebookaccesstoken'
			}
		};

	});

	describe('When failing to authenticate because access token fails to return user', () => {

		it('should request a facebook user using the access token provided', () => {
			Expect(authenticatingUser).calledWith(req.body.accessToken);
		});

		it('should set success to false on the response', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set message to the failed message on the response', () => {
			Expect(res.body.message).to.equal('message from error');
		});

		it('should have a response status of 409', (done) => {
			Expect(res.statusValue).to.equal(409);
			done();
		});

		let authenticatingUser,
			authenticatedUser = {
			name:'name',
			password:'password',
			email:'name@email.com',
			image:'image.jpg',
			token:'new token',
			_id:"123"
		}
	
		beforeEach(() => {
		 	authenticatingUser = sandbox.stub(AuthenticationService, 'authenticateFacebookUser').returnsPromise();
		 	authenticatingUser.rejects(new Error('message from error'));
			authenticate(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		const req = {
			body:{
				accessToken: 'facebookaccesstoken'
			}
		};
		
	});
});