import * as Chai from 'chai';
import Sinon from 'sinon';
import * as AuthorizationService from '../../../lib/services/authorizationService';
import { authorize } from '../../../lib/routes/facebookAuthorize';

const Expect = Chai.expect;

describe('Unit::Route facebookAuthorize', () => {

	let sandbox = Sinon.sandbox.create(),
	res = { 
		json:(obj) => { res.body = obj },
		status:function(status) {
			res.statusValue = status;
        	return this;
		},
		jsonError:(obj) => { 
			res.body = obj 
			res.statusValue = obj.status;
		}
    };
	
	describe('When authorizing a facebook user', () => {

		it('should request a facebook user using the access token and client id provided', () => {
			Expect(authorizingUser).calledWith(req.body.accessToken, req.body.clientId);
		});

		it('it should have set the user\'s id on the response', () => {
			Expect(res.body.claim).to.equal(claim);
		});

		it('it should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});

		let authorizingUser,
		claim = {
			name:'name',
			image:'image.jpg',
			authorizationToken:'token',
			refreshToken:'refreshToken',
			_id:"123"
		}
	
		beforeEach(() => {
		 	authorizingUser = sandbox.stub(AuthorizationService, 'authorizeFacebookUser').returnsPromise();
		 	authorizingUser.resolves(claim);
			authorize(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		const req = {
			body:{
				accessToken: 'facebookaccesstoken',
				clientId:'clientId'
			}
		};
	});

	describe('When failing to authorize', () => {

		it('should request a facebook user using the access token provided', () => {
			Expect(authorizingUser).calledWith(req.body.accessToken, req.body.clientId);
		});

		it('should set message to the failed message on the response', () => {
			Expect(res.body.message).to.equal(error.message);
		});

		it('should have a response status of 409', (done) => {
			Expect(res.statusValue).to.equal(409);
			done();
		});

		let authorizingUser,
		error = new Error('error');
		error.status = 409;
	
		beforeEach(() => {
		 	authorizingUser = sandbox.stub(AuthorizationService, 'authorizeFacebookUser').returnsPromise();
		 	authorizingUser.rejects(error);
			authorize(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		const req = {
			body:{
				accessToken: 'facebookaccesstoken',
				clientId:'clientId'
			}
		};
		
	});
});