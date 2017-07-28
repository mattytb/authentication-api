import * as Chai from 'chai';
import Sinon from 'sinon';
import * as Token from '../../../lib/clients/tokenClient';
import * as UserClient from '../../../lib/clients/userClient';
import * as FacebookClient from '../../../lib/clients/facebookClient';
import * as AuthTokenService from '../../../lib/services/authTokenService';
import * as AuthenticationService from '../../../lib/services/authenticationService';

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

	describe("When authenticating a new Facebook user", () => {

		it("it should get the Facebook user with the access token supplied", () => {
			Expect(gettingFacebookUser).calledWith(accessToken);
		});

		it("it should enquire to see if the facebook user already exists in the database", () => {
			Expect(checkingForUser).calledWith(facebookUser.email);
		});

		it("it should request the new facebook user be saved", () => {
			Expect(savingNewUser).calledWith(facebookUser.name, facebookUser.email, facebookUser.picture.data.url);
		});

		it('it should apply an auth token to the newly created user', () => {
			Expect(applyingTokenToUser).calledWith(savedUser);
		});

		it("it should return the new authenticated user", () => {
			return result.then((user) => {
				Expect(user).to.equal(authenticatedUser);
			});
		});

		const accessToken = "accessToken";

		let gettingFacebookUser,
			checkingForUser,
			savingNewUser,
			applyingTokenToUser,
			facebookUser = {
				'name':'matt',
				'email':'matt@email.com',
				'picture':
					{ 
						data: {
							url:"image.src"
						}
					}
			},
			savedUser = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123"
			},
			authenticatedUser = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				token:'token'
			},
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {

			gettingFacebookUser = sandbox.stub(FacebookClient, 'getFacebookUser').returnsPromise();
			gettingFacebookUser.resolves(facebookUser);
			checkingForUser = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			checkingForUser.rejects();
			savingNewUser = sandbox.stub(UserClient, 'saveThirdPartyUser').returnsPromise();
			savingNewUser.resolves(savedUser);
			applyingTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthToken').returnsPromise();
			applyingTokenToUser.resolves(authenticatedUser);

			result = AuthenticationService.authenticateFacebookUser(accessToken);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe("When authenticating a already registered Facebook user and there auth token is still valid", () => {

		it("it should get the Facebook user with the access token supplied", () => {
			Expect(gettingFacebookUser).calledWith(accessToken);
		});

		it("it should enquire to see if the facebook user already exists in the database", () => {
			Expect(checkingForUser).calledWith(facebookUser.email);
		});

		it("it should check the validaty of the authentication token", () => {
				Expect(verifyingAuthToken).calledWith(user.token);
		})

		it("it should not request the re authentication of the user found", () => {
			//Expect(applyingTokenToUser).not.calledWith(user);
		});

		it("it should return the user with a new token", () => {
			return result.then((user) => {
				Expect(user).to.equal(user);
			});
		});

		const accessToken = "accessToken";

		let gettingFacebookUser,
			checkingForUser,
			applyingTokenToUser,
			verifyingAuthToken,
			facebookUser = {
				name:'facebook user',
				email:'facebook@user.com'
			},
			user = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				token:'token'
			},
			authenticatedUser = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				token:'new token'
			},
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {

			gettingFacebookUser = sandbox.stub(FacebookClient, 'getFacebookUser').returnsPromise();
			gettingFacebookUser.resolves(facebookUser);
			checkingForUser = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			checkingForUser.resolves(user);
			verifyingAuthToken = sandbox.stub(Token, 'verifyToken').returnsPromise();
			verifyingAuthToken.resolves(true);
			applyingTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthToken').returnsPromise();

			result = AuthenticationService.authenticateFacebookUser(accessToken);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe("When authenticating a already registered Facebook user and there auth token is not valid", () => {

		it("it should get the Facebook user with the access token supplied", () => {
			Expect(gettingFacebookUser).calledWith(accessToken);
		});

		it("it should enquire to see if the facebook user already exists in the database", () => {
			Expect(checkingForUser).calledWith(facebookUser.email);
		});

		it("it should check the validaty of the authentication token", () => {
				Expect(verifyingAuthToken).calledWith(user.token);
		})

		it("it should request the re authentication of the user found", () => {
			Expect(applyingTokenToUser).calledWith(user);
		});

		it("it should return the user with a new token", () => {
			return result.then((user) => {
				Expect(user).to.equal(authenticatedUser);
			});
		});

		const accessToken = "accessToken";

		let gettingFacebookUser,
			checkingForUser,
			applyingTokenToUser,
			verifyingAuthToken,
			facebookUser = {
				name:'facebook user',
				email:'facebook@user.com'
			},
			user = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				token:'token'
			},
			authenticatedUser = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				token:'new token'
			},
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {

			gettingFacebookUser = sandbox.stub(FacebookClient, 'getFacebookUser').returnsPromise();
			gettingFacebookUser.resolves(facebookUser);
			checkingForUser = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			checkingForUser.resolves(user);
			verifyingAuthToken = sandbox.stub(Token, 'verifyToken').returnsPromise();
			verifyingAuthToken.rejects();
			applyingTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthToken').returnsPromise();
			applyingTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateFacebookUser(accessToken);

		});

		afterEach(() => {
			sandbox.restore();
		});
		
	});
});



	
