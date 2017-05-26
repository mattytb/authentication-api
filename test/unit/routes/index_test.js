import * as Chai from 'chai';
import Sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import SinonStubPromise from 'sinon-stub-promise';
import * as UserClient from '../../../clients/userClient';
import { getAllUsers } from '../../../routes/index';

SinonStubPromise(Sinon);

const Expect = Chai.expect,
	request = {},
	req = mockReq(request),
	userClientErrorMessage = "ErrorMessage";

let sandbox = Sinon.sandbox.create(),
	res = { 
		json:(obj) => { res.body = obj },
		status:function(status) {
			res.statusValue = status;
        	return this;
    	}
    };

describe('Unit::Route index', () => {

	describe('When providing all users, it', () => {

		let fetchUsers,
			promisedUsers = [
				{
					name:"Matt",
				},
				{
					name:"Marta"
				}
			];
	
		beforeEach(() => {
		 	fetchUsers = sandbox.stub(UserClient, 'getUsers').returnsPromise();
		 	fetchUsers.resolves(promisedUsers);
			getAllUsers(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should return all users found', () => {
			Expect(res.body[0].name).to.equal("Matt");
			Expect(res.body[1].name).to.equal("Marta");
		});

		it('should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});

	});

	describe('When failing to provide all users, it', () => {

		let fetchUsers;
	
		beforeEach(() => {
		 	fetchUsers = sandbox.stub(UserClient, 'getUsers').returnsPromise();
		 	fetchUsers.rejects(userClientErrorMessage);
			getAllUsers(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should set the success on the response to false', () => {
			Expect(res.body.success).to.be.false;
		});

		it('should set the message on the response to the failed message from the client', () => {
			Expect(res.body.message).to.equal(userClientErrorMessage);
		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});

	});

});