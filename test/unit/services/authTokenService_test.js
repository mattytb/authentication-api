import * as Chai from 'chai';
import Sinon from 'sinon';
import * as Token from '../../../lib/clients/tokenClient';
import * as UserClient from '../../../lib/clients/userClient';
import * as AuthTokenService from '../../../lib/services/authTokenService';

const Expect = Chai.expect;

describe('Unit::Service auth token service', () => {

	describe('When applying a token to a user, it', () => {


		it('it should set the original user token to null', () => {

			Expect(user.token).to.equal(null);
			
		});

		it('it should get a new token for the user', () => {

			Expect(getNewToken).calledWith(userWithNullToken);
			
		});

		it('it should save the new token to the user passing the user id and new token', () => {

			Expect(saveUser).calledWith(user._id, newToken);
			
		});

		it('it should return the user with the newly applied authentication token', () => {
			return result.then((user) => {
				Expect(user).to.equal(savedUser);
				Expect(user.token).to.equal(newToken);
			});
		});

		let token,
			user,
			savedUser,
			result,
			saveUser,
			getNewToken,
			userWithNullToken,
			sandbox = Sinon.sandbox.create();

			const newToken = 'newToken';

		beforeEach(() => {

			user = {
				'name':'matt',
				'token':'orginalUsersToken',
				'_id' : 123
			};
			userWithNullToken = {
				'name':'matt',
				'token':null,
				'_id' : 123
			};
			savedUser = {
				'name':'matt',
				'token':newToken,
				'_id' : 123
			};

			getNewToken = sandbox.stub(Token, 'getToken').withArgs(userWithNullToken).callsFake(() => { return newToken });
			saveUser = sandbox.stub(UserClient, 'saveTokenToUser').returnsPromise();
			saveUser.resolves(savedUser);
			result = AuthTokenService.applyAuthToken(user);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});
});