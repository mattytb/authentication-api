import { hasNamePasswordEmailClientId } from '../../../../lib/routes/validators/namePasswordEmailClientIdValidator';
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

describe('Unit::Route Validator namePasswordEmailClientIdValidator', () => {

	describe('When all name password email and client are present, it', () => {

		const req = {
			body:{
				name:'matt',
				password:'password',
				email:'matt@email.com',
				clientId:'browser'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientId(req, res, next);
		});

		it('should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

	});

	describe('When name is null, it', () => {

		const req = {
			body:{
				name:null,
				password:'password',
				email:'matt@email.com'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientId(req, res, next);
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
				email:'matt@email.com'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientId(req, res, next);
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
				password:''
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientId(req, res, next);
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
				email:'matt@email.com'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientId(req, res, next);
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

	describe('When all name, password and are not supplied, it', () => {

		const req = {
			body:{
				name:'',
				password:null
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordEmailClientId(req, res, next);
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