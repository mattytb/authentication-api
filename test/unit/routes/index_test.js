import * as Chai from 'chai';
import Sinon from 'sinon';
import * as UserService from '../../../lib/services/userService';
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
		},
		jsonError:(obj, result) => { 
			res.body = obj;
			res.statusValue = obj.status;
		},
		jsonAuthenticate:(req, res, data) => { 
			res.body = data
		}
    };

describe('Unit::Route index', () => {

	describe('When providing users', () => {

		it('it should call the user service for the users', () => {
			Expect(requestingUsers).should.be.called;
		});

		it('it should have set the users on the response', (done) => {
			Expect(res.body).to.equal(users);
			done();
		});

		const users = [
			{
				name:"Matt",
				image:'mattsimage',
				id:'mattsid'
			},
			{
				name:"Marta",
				image:"martasimage",
				id:"martasid"
			}
		]

		let requestingUsers,
			result;
	
		beforeEach(() => {
			requestingUsers = sandbox.stub(UserService, 'getUserDetails').returnsPromise();
			requestingUsers.resolves(users);
			getAllUsers(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

	});

	describe('When providing users errors', () => {

		it('it should call the user service for the users', () => {
			Expect(requestingUsers).should.be.called;
		});

		it('should set message value to the error message', () => {
			Expect(res.body.message).to.equal("Internal Error");
		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});
		

		const users = [
			{
				name:"Matt",
				image:'mattsimage',
				id:'mattsid'
			},
			{
				name:"Marta",
				image:"martasimage",
				id:"martasid"
			}
		]

		let requestingUsers,
			result,
			error = new Error("Internal Error");
			error.status = 500;
	
		beforeEach(() => {
			requestingUsers = sandbox.stub(UserService, 'getUserDetails').returnsPromise();
			requestingUsers.rejects(error);
			getAllUsers(req, res);
		});
		
		afterEach(() => {
		    sandbox.restore();
		});

	});

});