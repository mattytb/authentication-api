import * as TokenClient from '../../../../clients/tokenClient';
import { isVerified } from '../../../../routes/validators/authenticationValidator';
import * as Chai from 'chai';
import Sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import SinonStubPromise from 'sinon-stub-promise';
import SinonChai from 'sinon-chai';

Chai.use(SinonChai);

SinonStubPromise(Sinon);

const clientFailedToVerifyMessage = 'Client failed to verify',
		Expect = Chai.expect;

		let sandbox = Sinon.sandbox.create(),
			res = res = { 
			json:(obj) => { res.body = obj },
			status:function(status) {
				res.statusValue = status;
	        	return this;
	    	}
	    },
		verifyingToken,
		result,
		next;

describe('Unit::Route Validator authenticationValidator', () => {

	describe('When verifying, it', () => {

		const request = {
				body:{
					token:'Token'
				}
			},
			req = mockReq(request);

		beforeEach((done) => {

			verifyingToken = sandbox.stub(TokenClient, 'verifyToken').returnsPromise();
		 	verifyingToken.resolves();

			next = Sinon.spy();
	 		isVerified(req, res, next);
	 		done();
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		it('should verify the token', () => {
			Expect(verifyingToken).calledWith(req.body.token);
		});

		it('should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

	});

	describe('When failing to verify because token was invalid, it', () => {

		const request = {
				body:{
					token:'Token'
				}
			},
			req = mockReq(request);

		beforeEach((done) => {
			verifyingToken = sandbox.stub(TokenClient, 'verifyToken').returnsPromise();
		 	verifyingToken.rejects(clientFailedToVerifyMessage);

			next = Sinon.spy();
	 		isVerified(req, res, next);
	 		done();
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

		it('should attempt to verify the token', () => {
			Expect(verifyingToken).calledWith(req.body.token);
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
		const request = {
			body:{

			},
				headers :{}
			},
			req = mockReq(request);
		

		beforeEach((done) => {
			next = Sinon.spy();
			isVerified(req, res, next);
			done();
		
		});
	
		afterEach(() => {
		    sandbox.restore();
		});

		it('should not attempt to verify the token', () => {
			Expect(verifyingToken).not.calledWith(req.body);
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

