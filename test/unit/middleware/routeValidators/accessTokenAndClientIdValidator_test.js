import { hasAccessTokenAndClientId } from '../../../../lib/middleware/routeValidators/accessTokenAndClientIdValidator';
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

describe('Unit::Route Validator accessTokenAndClinetValidator', () => {

	describe('When access token and client id are present', () => {

		it('it should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

		const req = {
			body:{
				accessToken:'accesstoken',
				clientId:'clientId'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasAccessTokenAndClientId(req, res, next);
		});

	});

	describe('When access token is null, it', () => {

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the response success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set the response message to the failed message', () => {
			Expect(res.body.message).to.equal("missing access token");
		});

		it('should have a repsonse status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});

		const req = {
			body:{
				accessToken:null,
				clientId:'123'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasAccessTokenAndClientId(req, res, next);
		});


	});

	describe('When client id is an empty string', () => {

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the response success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set the response message to the failed message', () => {
			Expect(res.body.message).to.equal("missing access token");
		});

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});

		const req = {
			body:{
				accessToken:'accessToken',
				clientId:''
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasAccessTokenAndClientId(req, res, next);
		});

	});

});