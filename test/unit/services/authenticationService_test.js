import * as Chai from 'chai';
import Sinon from 'sinon';
import * as Token from '../../../clients/tokenClient';
import * as UserClient from '../../../clients/userClient';
import * as AuthTokenService from '../../../services/authTokenService';
import * as AuthenticationService from '../../../services/authenticationService';

const Expect = Chai.expect;


describe('Unit::Service authentication service', () => {

	describe('When authenticating a new user', () => {

		it('it should attempt to get a user by email', () => {
			Expect(gettingUserByEmail).calledWith(email);
		});

		it('it should save a new user using name, email and password', () => {
			Expect(savingNewUser).calledWith(name, password, email);
		})

		it('it should apply an auth token to the newly created user', () => {
			Expect(applyingTokenToUser).calledWith(savedUser);
		});

		it('it should return the authenticated user', () => {
			return result.then((user) => {
				Expect(user).to.equal(authenticatedUser);
			});
		});

		const name = 'Matt',
			email = 'matt@email.com',
			password = 'password',
			authenticatedToken = 'token';

		let authenticatingUser,
			gettingUserByEmail,
			savingNewUser,
			applyingTokenToUser,
			result,
			sandbox = Sinon.sandbox.create(),
			savedUser = {
				name:'Matt',
				email:'matt@email.com',
				password:'password'
			},
			authenticatedUser = {
				name:'Matt',
				email:'matt@email.com',
				password:'password',
				token:authenticatedToken,
				_id:"123"
			};
			
		beforeEach(() => {
			gettingUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			gettingUserByEmail.rejects();
			savingNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
			savingNewUser.resolves(savedUser);
			applyingTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthToken').returnsPromise();
			applyingTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateNewUser(name, password, email);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe('When re-authenticating a user', () => {

		it('it should get a user by email and password', () => {
			Expect(gettingUserByEmailAndPassword).calledWith(email, password);
		});

		it('it should apply an auth token to the newly created user', () => {
			Expect(applyingTokenToUser).calledWith(user);
		});

		it('it should return the authenticated user', () => {
			return result.then((user) => {
				Expect(user).to.equal(authenticatedUser);
			});
		});

		const name = 'Matt',
			email = 'matt@email.com',
			password = 'password';

		let authenticatingUser,
			gettingUserByEmailAndPassword,
			applyingTokenToUser,
			result,
			sandbox = Sinon.sandbox.create(),
			user = {
				name:'Matt',
				email:'matt@email.com',
				password:'password',
				token:'token',
				_id:"123"
			},
			authenticatedUser = {
				name:'Matt',
				email:'matt@email.com',
				password:'password',
				token:'newtoken',
				_id:"123"
			};
			
		beforeEach(() => {
			gettingUserByEmailAndPassword = sandbox.stub(UserClient, 'getUserByEmailAndPassword').returnsPromise();
			gettingUserByEmailAndPassword.resolves(user);
			applyingTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthToken').returnsPromise();
			applyingTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateUser(email, password);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});
});



	
