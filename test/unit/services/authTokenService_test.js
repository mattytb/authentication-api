import * as Chai from 'chai';
import Sinon from 'sinon';
import * as Token from '../../../lib/clients/tokenClient';
import * as UserClient from '../../../lib/clients/userClient';
import * as AuthTokenService from '../../../lib/services/authTokenService';

const Expect = Chai.expect;

describe('Unit::Service auth token service', () => {

	describe('When applying a token to a web user', () => {

		it('it should set the original user token to null', () => {
			Expect(user.webToken).to.equal(null);
		});

		it('it should get a new token for the user', () => {
			Expect(getNewWebToken).calledWith(userWithNullWebToken);
		});

		it('it should save the new token to the user passing the user id and new token', () => {
			Expect(saveUser).calledWith(user._id, newWebToken);
		});

		it('it should return the user with the newly applied authentication token', () => {
			return result.then((user) => {
				Expect(user).to.equal(savedUser);
				Expect(user.webToken).to.equal(newWebToken);
			});
		});

		let webToken,
			user,
			savedUser,
			result,
			saveUser,
			getNewWebToken,
			userWithNullWebToken,
			sandbox = Sinon.sandbox.create();

			const newWebToken = 'newWebToken';

		beforeEach(() => {

			user = {
				'name':'matt',
				'webToken':'originalUsersToken',
				'_id' : 123
			};
			userWithNullWebToken = {
				'name':'matt',
				'webToken':null,
				'_id' : 123
			};
			savedUser = {
				'name':'matt',
				'webToken':newWebToken,
				'_id' : 123
			};

			getNewWebToken = sandbox.stub(Token, 'getWebToken').withArgs(userWithNullWebToken).callsFake(() => { return newWebToken });
			saveUser = sandbox.stub(UserClient, 'saveWebTokenToUser').returnsPromise();
			saveUser.resolves(savedUser);
			result = AuthTokenService.applyAuthWebToken(user);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});

	describe('When applying a mobile token to a user', () => {
		it('it should set the original user mobile token to null', () => {
			Expect(user.mobileToken).to.equal(null);
		});

		it('it should get a new mobile token for the user', () => {
			Expect(getNewMobileToken).calledWith(userWithNullMobileToken);
		});

		it('it should save the new mobile token to the user passing the user id and new token', () => {
			Expect(saveUser).calledWith(user._id, newMobileToken);
		});

		it('it should return the user with the newly applied mobile authentication token', () => {
			return result.then((user) => {
				Expect(user).to.equal(savedUser);
				Expect(user.mobileToken).to.equal(newMobileToken);
			});
		});

		let mobileToken,
			user,
			savedUser,
			result,
			saveUser,
			getNewMobileToken,
			userWithNullMobileToken,
			sandbox = Sinon.sandbox.create();

			const newMobileToken = 'newToken';

		beforeEach(() => {

			user = {
				'name':'matt',
				'mobileToken':'originalUsersToken',
				'_id' : 123
			};
			userWithNullMobileToken = {
				'name':'matt',
				'mobileToken':null,
				'_id' : 123
			};
			savedUser = {
				'name':'matt',
				'mobileToken':newMobileToken,
				'_id' : 123
			};

			getNewMobileToken = sandbox.stub(Token, 'getMobileToken').withArgs(userWithNullMobileToken).callsFake(() => { return newMobileToken });
			saveUser = sandbox.stub(UserClient, 'saveMobileTokenToUser').returnsPromise();
			saveUser.resolves(savedUser);
			result = AuthTokenService.applyAuthMobileToken(user);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});
});