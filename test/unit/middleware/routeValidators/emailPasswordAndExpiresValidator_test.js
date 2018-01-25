import { hasEmailPasswordAndExpires } from '../../../../lib/middleware/routeValidators/emailPasswordAndExpiresValidator';
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

describe('Unit::Route Validator emailPasswordAndExpiresValidator', () => {

	describe('When email, password and expires are present, it', () => {

		const req = {
			body:{
				email:'matt',
				password:'password',
				expires:'ISODateString'
			}
		};

		it('should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

		beforeEach(() => {
			next = Sinon.spy();
			hasEmailPasswordAndExpires(req, res, next);
		});

	});

	describe('When email is null, it', () => {

		const req = {
			body:{
				email:null,
				password:'password',
				expires:'ISODateString'
			}
		};

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

		beforeEach(() => {
			next = Sinon.spy();
			hasEmailPasswordAndExpires(req, res, next);
		});
	});

	describe('When password is an empty string, it', () => {

		const req = {
			body:{
				email:'matt@email.com',
				password:'',
				expires:'ISODateString'
			}
		};

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the response success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set the response message to the failed message', () => {
			Expect(res.body.message).to.equal("missing credentials");
		});

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});

		beforeEach(() => {
			next = Sinon.spy();
			hasEmailPasswordAndExpires(req, res, next);
		});

	});
	describe('When expires is an empty string, it', () => {

		const req = {
			body:{
				email:'matt@email.com',
				password:'password',
				expires:''
			}
		};

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the response success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set the response message to the failed message', () => {
			Expect(res.body.message).to.equal("missing credentials");
		});

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});

		beforeEach(() => {
			next = Sinon.spy();
			hasEmailPasswordAndExpires(req, res, next);
		});

	});

	describe('When all email, password and expires are not supplied, it', () => {

		const req = {
			body:{
				email:'',
				password:null,
				expires:''
			}
		};

		it('should not call the next function on router', () => {
			Expect(next.calledOnce).to.be.false;
		});

		it('should set the response success value to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set the response message to the failed message', () => {
			Expect(res.body.message).to.equal("missing credentials");
		});

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});

		beforeEach(() => {
			next = Sinon.spy();
			hasEmailPasswordAndExpires(req, res, next);
		});

	});

});