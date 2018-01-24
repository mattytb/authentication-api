import { hasRefreshToken } from '../../../../lib/middleware/routeValidators/refreshTokenValidator';
import Sinon from 'sinon';
import * as Chai from 'chai';

const Expect = Chai.expect;

let res = { 
		json:(obj) => { res.body = obj },
		status:function(status) {
			res.statusValue = status;
        	return this;
    	}
    },
	next;

describe('Unit::Route Validator refreshTokenValidator', () => {

	describe('When the refresh token is present, it', () => {

		const req = {
			body:{
				refreshToken:'refreshToken',
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasRefreshToken(req, res, next);
		});

		it('should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

	});

	describe('When the refresh token is not present, it', () => {

		const req = {
			body:{
				
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasRefreshToken(req, res, next);
		});

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the response success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set the response message to the failed message', () => {
			Expect(res.body.message).to.equal("missing credentials");
		});

		it('should have a repsonse status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});
    });
});