import { hasNamePasswordEmailClientIdAndExpires } from '../../../../lib/middleware/routeValidators/namePasswordEmailClientIdAndExpiresValidator';
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

describe('Unit::Route Validator namePasswordEmailClientIdAndExpiresValidator', () => {

	describe('When all name password email client id and expires are present, it', () => {

		const req = {
			body:{
				name:'matt',
				password:'password',
				email:'matt@email.com',
				clientId:'browser',
				expires:'ISODateString'
			}
		};

		it('should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientIdAndExpires(req, res, next);
		});

	});

	describe('When name is null, it', () => {

		const req = {
			body:{
				name:null,
				password:'password',
				email:'matt@email.com',
				expires:'ISODateString'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientIdAndExpires(req, res, next);
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

	describe('When password is an empty string, it', () => {

		const req = {
			body:{
				name:'matt',
				password:'',
				email:'matt@email.com',
				expires:'ISODateString'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientIdAndExpires(req, res, next);
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

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});

	});

	describe('When email is not sent, it', () => {

		const req = {
			body:{
				name:'matt',
				password:'',
				expires:'ISODateString'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientIdAndExpires(req, res, next);
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

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});

	});

	describe('When client id is not sent, it', () => {

		const req = {
			body:{
				name:'matt',
				password:'password',
				email:'matt@email.com',
				expires:'ISODateString'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientIdAndExpires(req, res, next);
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

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});

	});

	describe('When expires is not sent, it', () => {

		const req = {
			body:{
				name:'matt',
				password:'password',
				email:'matt@email.com',
				clientId:'clientId'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientIdAndExpires(req, res, next);
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

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});
	});

	describe('When all name, password, email, clientId and Expires and are not supplied, it', () => {

		const req = {
			body:{
				name:'',
				password:null
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientIdAndExpires(req, res, next);
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

		it('should have a response status of 403', (done) => {
			Expect(res.statusValue).to.equal(403);
			done();
		});
	});
});