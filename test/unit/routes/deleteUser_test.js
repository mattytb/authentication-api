import { deleteUserByAuthorizationToken } from '../../../lib/routes/deleteUser';
import * as Chai from 'chai';
import Sinon from 'sinon';
import * as UserService from '../../../lib/services/userService';

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
			jsonError:(obj) => { 
				res.body = obj,
				res.statusValue = obj.status 
			},
			jsonAuthorized:(res, payload) => { 
				res.body = payload 
			},
			locals: {

			}
	    };


describe('Unit::Route deleteUser', () => {

	describe('When deleting, it', () => {

		it('it should request to delete the user passing the authorization token and the user id to delete', () => {
			Expect(deletingUser).calledWith(authorizationTokenWithBearer, userIdToDelete);
		});

		it('it should have set the success message on the response', () => {
			Expect(res.body).to.equal(userDeletedMessage);
		});
		
		const authorizationTokenWithBearer = 'Bearer authorizationToken',
			userIdToDelete = '123',
			req = {
				params:{
					user_id:userIdToDelete
				}
			},
			userDeletedMessage = 'user deleted';
		
		let deletingUser,
			result;
		
		beforeEach(() => {
			
			res.locals.authorizationToken = authorizationTokenWithBearer;
			deletingUser = sandbox.stub(UserService, 'deleteUser').returnsPromise();
			deletingUser.resolves(userDeletedMessage);
			result = deleteUserByAuthorizationToken(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});

	});

	describe('When deleting fails', () => {

		it('it should request to delete the user passing the authorization token and the user id to delete', () => {
			Expect(deletingUser).calledWith(authorizationTokenWithBearer, userIdToDelete);
		});

		it('should set message value to the error message', () => {
			Expect(res.body.message).to.equal("Unauthorized");
		});

		it('should have a response status of 401', (done) => {
			Expect(res.statusValue).to.equal(401);
			done();
		});
		
		const authorizationTokenWithBearer = 'Bearer authorizationToken',
			userIdToDelete = '123',
			req = {
				params:{
					user_id:userIdToDelete
				}
			}; 
			
		let deletingUser,
			result,
			error = new Error("Unauthorized");
			error.status = 401;
		
		beforeEach(() => {
			
			res.locals.authorizationToken = authorizationTokenWithBearer;
			deletingUser = sandbox.stub(UserService, 'deleteUser').returnsPromise();
			deletingUser.rejects(error);
			result = deleteUserByAuthorizationToken(req, res);
		});

		afterEach(() => {
		    sandbox.restore();
		});
	});
});