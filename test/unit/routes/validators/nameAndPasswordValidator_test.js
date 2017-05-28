import { hasNameAndPassword } from '../../../../routes/validators/nameAndPasswordValidator';
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

describe('Unit::Route Validator nameAndPasswordValidator', () => {

	describe('When both name and password are present, it', () => {

		const req = {
			body:{
				name:'matt',
				password:'password'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNameAndPassword(req, res, next);
		});

		it('should call the next function on router', () => {
			Expect(next.calledOnce).to.be.true;
		});

	});

	describe('When name is null, it', () => {

		const req = {
			body:{
				name:null,
				password:'password'
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNameAndPassword(req, res, next);
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
				password:''
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNameAndPassword(req, res, next);
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

	describe('When both name and password are not supplied, it', () => {

		const req = {
			body:{
				name:'',
				password:null
			}
		};

		beforeEach(() => {
			next = Sinon.spy();
			hasNameAndPassword(req, res, next);
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