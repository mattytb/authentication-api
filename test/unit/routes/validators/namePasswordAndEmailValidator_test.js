import { hasNamePasswordAndEmail } from '../../../../routes/validators/namePasswordAndEmailValidator';
import { mockReq, mockRes } from 'sinon-express-mock';
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

describe('Unit::Route Validator namePasswordAndEmailValidator', () => {

	describe('When all name password and email are present, it', () => {

		const request = {
			body:{
				name:'matt',
				password:'password',
				email:'matt@email.com'
			}
		},
		req = mockReq(request);

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordAndEmail(req, res, next);
		});

		it('should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

	});

	describe('When name is null, it', () => {

		const request = {
			body:{
				name:null,
				password:'password',
				email:'matt@email.com'
			}
		},
		req = mockReq(request);

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordAndEmail(req, res, next);
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

		const request = {
			body:{
				name:'matt',
				password:'',
				email:'matt@email.com'
			}
		},
		req = mockReq(request);

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordAndEmail(req, res, next);
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

		const request = {
			body:{
				name:'matt',
				password:''
			}
		},
		req = mockReq(request);

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordAndEmail(req, res, next);
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

		const request = {
			body:{
				name:'',
				password:null
			}
		},
		req = mockReq(request);

		beforeEach(() => {
			next = Sinon.spy();
			hasNamePasswordAndEmail(req, res, next);
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