import { deleteUserByToken } from '../../../routes/deleteUser';
import * as Chai from 'chai';
import Sinon from 'sinon';
import * as UserClient from '../../../clients/userClient';

const Expect = Chai.expect,
	deletingUserFailureMessage = "failed to delete user",
	successfullyDeletedMessage = "User was successfully deleted",
	serverErrorMessage = "Internal server error",
	unauthorisedMessage = "401 unauthorised",
	userIdToDelete = 123,
	userIdOfUserActioningDelete = 321,
	tokenOfUserActioningDelete = 'token';


	let sandbox = Sinon.sandbox.create(),
		res = { 
			json:(obj) => { res.body = obj },
			status:function(status) {
				res.statusValue = status;
	        	return this;
	    	}
	    };


describe('Unit::Route deleteUser', () => {

	describe('When deleting a user as an admin, it', () => {

		let deletingUser,
			userActioningDelete = {
				name:'matt',
				admin:true,
				_id:userIdOfUserActioningDelete
			},
			req = {
				body:{
					userId:userIdOfUserActioningDelete,
				},
				params:{
					user_id:userIdToDelete
				}
			},
			fetchingUser;
	
		beforeEach(() => {
			fetchingUser = sandbox.stub(UserClient, 'getUserById').returnsPromise();
			fetchingUser.resolves(userActioningDelete);
		 	deletingUser = sandbox.stub(UserClient, 'deleteUser').returnsPromise();
		 	deletingUser.resolves(userIdToDelete);
			deleteUserByToken(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should request the user with the requesting users id', () => {

			Expect(fetchingUser).calledWith(userIdOfUserActioningDelete);

		});

		it('should call the user client to delete', () => {

			Expect(deletingUser).calledWith(userIdToDelete);

		});

		it('should set success to true on the response', () => {

			Expect(res.body.success).to.be.true;

		});

		it('should set message to the success message on the response', () => {
			
			Expect(res.body.message).to.equal(`${successfullyDeletedMessage} ${userIdToDelete}`);

		});

		it('should have a response status of 200', (done) => {
			Expect(res.statusValue).to.equal(200);
			done();
		});

	});

	describe('When deleting yourself, it', () => {

		let deletingUser,
			userActioningDelete = {
				name:'matt',
				admin:false,
				_id:userIdOfUserActioningDelete
			},
			req = {
				body:{
					userId:userIdOfUserActioningDelete,
				},
				params:{
					user_id:userIdOfUserActioningDelete
				}
			},
			fetchingUser;
	
		beforeEach(() => {
			fetchingUser = sandbox.stub(UserClient, 'getUserById').returnsPromise();
			fetchingUser.resolves(userActioningDelete);
		 	deletingUser = sandbox.stub(UserClient, 'deleteUser').returnsPromise();
		 	deletingUser.resolves(userIdToDelete);
			deleteUserByToken(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should request the user with the requesting users id', () => {
			Expect(fetchingUser).calledWith(userIdOfUserActioningDelete);
		});

		it('should call the user client to delete', () => {
				Expect(deletingUser).calledWith(userIdOfUserActioningDelete);
		});

		it('should set success to true on the response', () => {

			Expect(res.body.success).to.be.true;

		});

		it('should set the success message on the response', () => {
			
			Expect(res.body.message).to.equal(`${successfullyDeletedMessage} ${userIdToDelete}`);

		});

		it('should have a response status of 200', (done) => {

			Expect(res.statusValue).to.equal(200);
			done();

		});

	});

	describe('When failing to delete a user because the user does not have permission to do so, it', () => {

		let deletingUser,
			userActioningDelete = {
				name:'matt',
				admin:false,
				_id:userIdOfUserActioningDelete
			},
			req = {
				body:{
					userId:userIdOfUserActioningDelete,
				},
				params:{
					user_id:userIdToDelete
				}
			},
			fetchingUser;
	
		beforeEach(() => {
			fetchingUser = sandbox.stub(UserClient, 'getUserById').returnsPromise();
			fetchingUser.resolves(userActioningDelete);
		 	deletingUser = sandbox.stub(UserClient, 'deleteUser').returnsPromise();
			deleteUserByToken(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should request the user with the requesting users id', () => {

			Expect(fetchingUser).calledWith(userIdOfUserActioningDelete);

		});

		it('should not call the user client to delete', () => {

			Expect(deletingUser).not.calledWith(userIdToDelete);

		});

		it('should set success to false on the response', () => {

			Expect(res.body.success).to.be.false;

		});

		it('should set message on the response to the unauthorised message', () => {
			
			Expect(res.body.message).to.equal(unauthorisedMessage);

		});

		it('should have a response status of 401', (done) => {
			Expect(res.statusValue).to.equal(401);
			done();
		});

	});

	describe('When failing to delete a user because the user client fails to find the user, it', () => {

		let deletingUser,
			userActioningDelete = {
				name:'matt',
				admin:false,
				_id:userIdOfUserActioningDelete
			},
			req = {
				body:{
					userId:userIdOfUserActioningDelete,
				},
				params:{
					user_id:userIdToDelete
				}
			},
			fetchingUser;
	
		beforeEach(() => {
			fetchingUser = sandbox.stub(UserClient, 'getUserById').returnsPromise();
			fetchingUser.rejects();
		 	deletingUser = sandbox.stub(UserClient, 'deleteUser');
			deleteUserByToken(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should request the user with the requesting users id', () => {

			Expect(fetchingUser).calledWith(userIdOfUserActioningDelete);

		});

		it('should not call the user client to delete', () => {

			Expect(deletingUser).not.calledWith(req.userIdToDelete);

		});

		it('should set success to false on the response', () => {

			Expect(res.body.success).to.be.false;

		});

		it('should set message on the response to the server error message', () => {
			
			Expect(res.body.message).to.equal(serverErrorMessage);

		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});

	});

	describe('When failing to delete a user because the user client fails to delete, it', () => {

		let deletingUser,
			userActioningDelete = {
				name:'matt',
				admin:true,
				_id:userIdOfUserActioningDelete
			},
			req = {
				body:{
					userId:userIdOfUserActioningDelete,
				},
				params:{
					user_id:userIdToDelete
				}
			},
			fetchingUser;
	
		beforeEach(() => {
			fetchingUser = sandbox.stub(UserClient, 'getUserById').returnsPromise();
			fetchingUser.resolves(userActioningDelete);
		 	deletingUser = sandbox.stub(UserClient, 'deleteUser').returnsPromise();
		 	deletingUser.rejects();
			deleteUserByToken(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

		it('should request the user with the requesting users id', () => {

			Expect(fetchingUser).calledWith(userIdOfUserActioningDelete);

		});

		it('should call the user client to delete', () => {

			Expect(deletingUser).calledWith(userIdToDelete);

		});

		it('should set success to false on the response', () => {

			Expect(res.body.success).to.be.false;

		});

		it('should set message on the response to the server error message', () => {
			
			Expect(res.body.message).to.equal(serverErrorMessage);

		});

		it('should have a response status of 500', (done) => {
			Expect(res.statusValue).to.equal(500);
			done();
		});

	});

});