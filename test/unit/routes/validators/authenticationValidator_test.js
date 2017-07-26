import * as verifyUser from '../../../../lib/modules/verifyUser';
import { isVerified } from '../../../../lib/routes/validators/authenticationValidator';
import * as Chai from 'chai';
import Sinon from 'sinon';

const clientFailedToVerifyMessage = 'Client failed to verify',
		Expect = Chai.expect;

		let sandbox = Sinon.sandbox.create(),
			res = { 
			json:(obj) => { res.body = obj },
			status:function(status) {
				res.statusValue = status;
	        	return this;
	    	}
	    },
		verifyingUser,
		result,
		next;

describe('Unit::Route Validator authenticationValidator', () => {

	describe('When verifying, it', () => {

		const req = {
				body:{
					token:'Token',
					userId:123
				}
			};

		beforeEach((done) => {

			verifyingUser = sandbox.stub(verifyUser, 'verifyUser').returnsPromise();
		 	verifyingUser.resolves();

			next = Sinon.spy();
	 		isVerified(req, res, next);
	 		done();
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		it('should request to verify the user with userId and token', () => {
			Expect(verifyingUser).calledWith(req.body.userId, req.body.token);
		});

		it('should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

	});

	describe('When failing to verify because token was invalid, it', () => {

		const req = {
				body:{
					token:'Token',
					userId:123
				}
			};

		beforeEach((done) => {
			verifyingUser = sandbox.stub(verifyUser, 'verifyUser').returnsPromise();
		 	verifyingUser.rejects(clientFailedToVerifyMessage);

			next = Sinon.spy();
	 		isVerified(req, res, next);
	 		done();
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		it('should attempt to verify the user with userId and token', () => {
			Expect(verifyingUser).calledWith(req.body.userId, req.body.token);
		});

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the invalid token message', () => {
			Expect(res.body.message).to.equal(clientFailedToVerifyMessage);
		});

		it('should set the success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should have a response status of 401', (done) => {
			Expect(res.statusValue).to.equal(401);
			done();
		});

	});

	describe('When failing to verify because no token, it', () => {
		const req = {
				body:{
					userId : 123
				},
				query:{},
				headers:[]

			};
		
		beforeEach((done) => {
			next = Sinon.spy();
			verifyingUser = sandbox.stub(verifyUser, 'verifyUser').returnsPromise();
			isVerified(req, res, next);
			done();
		
		});
	
		afterEach(() => {
		    sandbox.restore();
		});

		it('should not attempt to verify the user', () => {
			Expect(verifyingUser).not.calledWith(req.body.userId, req.body.token);
		});

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the failed to find token message', () => {
			Expect(res.body.message).to.equal('No token provided.');
		});

		it('should set the success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});

	});

	describe('When failing to verify because no userId, it', () => {
		const req = {
				body:{
					token : "token"
				},
				query:{},
				headers:[]

			};
		
		beforeEach((done) => {
			next = Sinon.spy();
			verifyingUser = sandbox.stub(verifyUser, 'verifyUser').returnsPromise();
			isVerified(req, res, next);
			done();
		
		});
	
		afterEach(() => {
		    sandbox.restore();
		});

		it('should not attempt to verify the user', () => {
			Expect(verifyingUser).not.calledWith(req.body.userId, req.body.token);
		});

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the failed to find token message', () => {
			Expect(res.body.message).to.equal('No token provided.');
		});

		it('should set the success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});

	});

});

