import { deleteUserByToken } from '../../../lib/routes/deleteUser';
import * as Chai from 'chai';
import Sinon from 'sinon';
import * as UserClient from '../../../lib/clients/userClient';

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

	describe('When deleting yourself, it', () => {

	});

});