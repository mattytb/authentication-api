import * as Chai from 'chai';
import Sinon from 'sinon';
import * as UserClient from '../../../lib/clients/userClient';
import { getAllUsers } from '../../../lib/routes/index';

const Expect = Chai.expect,
	req = {},
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
					image:'mattsimage',
					id:'mattsid',
					email:'matts@email.com',
					token:'token'
				},
				{
					name:"Marta",
					image:"martasimage",
					id:"martasid",
					email:'marta@email.com',
					token:'token'
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

		it('should return all users names found', () => {
			Expect(res.body.users[0].name).to.equal("Matt");
			Expect(res.body.users[1].name).to.equal("Marta");
		});

		it('should return all users images found', () => {
			Expect(res.body.users[0].image).to.equal("mattsimage");
			Expect(res.body.users[1].image).to.equal("martasimage");
		});

		it('should return all users ids found', () => {
			Expect(res.body.users[0].id).to.equal("mattsid");
			Expect(res.body.users[1].id).to.equal("martasid");
		});

		it('should not return the users email', () => {
			Expect(res.body.users[0].email).to.not.exist;
			Expect(res.body.users[1].email).to.not.exist;
		});

		it('should not return the users token', () => {
			Expect(res.body.users[0].token).to.not.exist;
			Expect(res.body.users[1].token).to.not.exist;
		});

		it('should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});

		it('should set the success on the response to true', () => {
			Expect(res.body.success).to.be.true;
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