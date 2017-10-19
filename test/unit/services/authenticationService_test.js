import * as Chai from 'chai';
import Sinon from 'sinon';
import * as Token from '../../../lib/clients/tokenClient';
import * as UserClient from '../../../lib/clients/userClient';
import * as FacebookClient from '../../../lib/clients/facebookClient';
import * as AuthTokenService from '../../../lib/services/authTokenService';
import * as AuthenticationService from '../../../lib/services/authenticationService';

const Expect = Chai.expect;


describe('Unit::Service authentication service', () => {

	describe('When authenticating a new web user', () => {

		it('it should attempt to get a user by email', () => {
			Expect(gettingUserByEmail).calledWith(email);
		});

		it('it should save a new user using name, email and password', () => {
			Expect(savingNewUser).calledWith(name, password, email);
		})

		it('it should apply an auth token to the newly created user', () => {
			Expect(applyingWebTokenToUser).calledWith(savedUser);
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
			applyingWebTokenToUser,
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
				webToken:authenticatedToken,
				_id:"123"
			};
			
		beforeEach(() => {
			gettingUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			gettingUserByEmail.rejects();
			savingNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
			savingNewUser.resolves(savedUser);
			applyingWebTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthWebToken').returnsPromise();
			applyingWebTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateNewUser(name, password, email);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe('When authenticating a new mobile user', () => {
		
				it('it should attempt to get a user by email', () => {
					Expect(gettingUserByEmail).calledWith(email);
				});
		
				it('it should save a new user using name, email and password', () => {
					Expect(savingNewUser).calledWith(name, password, email);
				})
		
				it('it should apply a mobile auth token to the newly created user', () => {
					Expect(applyingMobileTokenToUser).calledWith(savedUser);
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
					applyingMobileTokenToUser,
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
						mobileToken:authenticatedToken,
						_id:"123"
					};
					
				beforeEach(() => {
					gettingUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
					gettingUserByEmail.rejects();
					savingNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
					savingNewUser.resolves(savedUser);
					applyingMobileTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthMobileToken').returnsPromise();
					applyingMobileTokenToUser.resolves(authenticatedUser);
					result = AuthenticationService.authenticateNewUser(name, password, email, true);
				});
		
				afterEach(() => {
					sandbox.restore();
				});
		
			});

	describe('When re-authenticating a web user', () => {

		it('it should get a user by email and password', () => {
			Expect(gettingUserByEmailAndPassword).calledWith(email, password);
		});

		it('it should apply an auth token to the newly created user', () => {
			Expect(applyingWebTokenToUser).calledWith(user);
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
			applyingWebTokenToUser,
			result,
			sandbox = Sinon.sandbox.create(),
			user = {
				name:'Matt',
				email:'matt@email.com',
				password:'password',
				webToken:'token',
				_id:"123"
			},
			authenticatedUser = {
				name:'Matt',
				email:'matt@email.com',
				password:'password',
				webToken:'newtoken',
				_id:"123"
			};
			
		beforeEach(() => {
			gettingUserByEmailAndPassword = sandbox.stub(UserClient, 'getUserByEmailAndPassword').returnsPromise();
			gettingUserByEmailAndPassword.resolves(user);
			applyingWebTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthWebToken').returnsPromise();
			applyingWebTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateUser(email, password);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe('When re-authenticating a mobile user', () => {
		
				it('it should get a user by email and password', () => {
					Expect(gettingUserByEmailAndPassword).calledWith(email, password);
				});
		
				it('it should apply an auth token to the newly created user', () => {
					Expect(applyingMobileTokenToUser).calledWith(user);
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
					applyingMobileTokenToUser,
					result,
					sandbox = Sinon.sandbox.create(),
					user = {
						name:'Matt',
						email:'matt@email.com',
						password:'password',
						webToken:'token',
						mobileToken:'mobileToken',
						_id:"123"
					},
					authenticatedUser = {
						name:'Matt',
						email:'matt@email.com',
						password:'password',
						webToken:'newtoken',
						mobileToken:'newmobiletoken',
						_id:"123"
					};
					
				beforeEach(() => {
					gettingUserByEmailAndPassword = sandbox.stub(UserClient, 'getUserByEmailAndPassword').returnsPromise();
					gettingUserByEmailAndPassword.resolves(user);
					applyingMobileTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthMobileToken').returnsPromise();
					applyingMobileTokenToUser.resolves(authenticatedUser);
					result = AuthenticationService.authenticateUser(email, password, true);
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
			Expect(applyingWebTokenToUser).calledWith(savedUser);
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
			applyingWebTokenToUser,
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
				webToken:'token'
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
			applyingWebTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthWebToken').returnsPromise();
			applyingWebTokenToUser.resolves(authenticatedUser);

			result = AuthenticationService.authenticateFacebookUser(accessToken);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe("When authenticating a new mobile Facebook user", () => {
		
				it("it should get the Facebook user with the access token supplied", () => {
					Expect(gettingFacebookUser).calledWith(accessToken);
				});
		
				it("it should enquire to see if the facebook user already exists in the database", () => {
					Expect(checkingForUser).calledWith(facebookUser.email);
				});
				
				it("it should request the new facebook user be saved", () => {
					Expect(savingNewUser).calledWith(facebookUser.name, facebookUser.email, facebookUser.picture.data.url);
				});
		
				it('it should apply an mobile auth token to the newly created user', () => {
					Expect(applyingMobileTokenToUser).calledWith(savedUser);
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
					applyingMobileTokenToUser,
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
						webToken:'token',
						mobileToken:'mobile token'
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
					applyingMobileTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthMobileToken').returnsPromise();
					applyingMobileTokenToUser.resolves(authenticatedUser);
		
					result = AuthenticationService.authenticateFacebookUser(accessToken, true);
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

		it("it should check the validaty of the authentication web token", () => {
			Expect(verifyingAuthToken).calledWith(user.webToken);
		});

		it("it should return the user with a new token", () => {
			return result.then((user) => {
				Expect(user).to.equal(user);
			});
		});

		const accessToken = "accessToken";

		let gettingFacebookUser,
			checkingForUser,
			applyingWebTokenToUser,
			verifyingAuthToken,
			facebookUser = {
				name:'facebook user',
				email:'facebook@user.com'
			},
			user = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				webToken:'token'
			},
			authenticatedUser = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				webToken:'new token'
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
			applyingWebTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthWebToken').returnsPromise();
			applyingWebTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateFacebookUser(accessToken);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("When authenticating an already registered Facebook mobile user and there auth token is still valid", () => {
		
		it("it should get the Facebook user with the access token supplied", () => {
			Expect(gettingFacebookUser).calledWith(accessToken);
		});

		it("it should enquire to see if the facebook user already exists in the database", () => {
			Expect(checkingForUser).calledWith(facebookUser.email);
		});

		it("it should check the validaty of the authentication web token", () => {
			Expect(verifyingAuthToken).calledWith(user.mobileToken);
		});

		it("it should return the user with a new token", () => {
			return result.then((user) => {
				Expect(user).to.equal(user);
			});
		});

		const accessToken = "accessToken";

		let gettingFacebookUser,
			checkingForUser,
			applyingWebTokenToUser,
			verifyingAuthToken,
			facebookUser = {
				name:'facebook user',
				email:'facebook@user.com'
			},
			user = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				webToken:'token',
				mobileToken:"mobile token"
			},
			authenticatedUser = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				webToken:'new token',
				mobileToken:'new mobile token'
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
			applyingWebTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthMobileToken').returnsPromise();
			applyingWebTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateFacebookUser(accessToken, true);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("When authenticating an already registered Facebook user and thier auth token is not valid", () => {

		it("it should get the Facebook user with the access token supplied", () => {
			Expect(gettingFacebookUser).calledWith(accessToken);
		});

		it("it should enquire to see if the facebook user already exists in the database", () => {
			Expect(checkingForUser).calledWith(facebookUser.email);
		});

		it("it should check the validaty of the authentication web token", () => {
				Expect(verifyingAuthToken).calledWith(user.webToken);
		})

		it("it should request the re authentication of the user found", () => {
			Expect(applyingWebTokenToUser).calledWith(user);
		});

		it("it should return the user with a new token", () => {
			return result.then((user) => {
				Expect(user).to.equal(authenticatedUser);
			});
		});

		const accessToken = "accessToken";

		let gettingFacebookUser,
			checkingForUser,
			applyingWebTokenToUser,
			verifyingAuthToken,
			facebookUser = {
				name:'facebook user',
				email:'facebook@user.com'
			},
			user = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				webToken:'token'
			},
			authenticatedUser = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				webToken:'new token'
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
			applyingWebTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthWebToken').returnsPromise();
			applyingWebTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateFacebookUser(accessToken);

		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("When authenticating an already registered Facebook mobile user and thier auth token is not valid", () => {
		
		it("it should get the Facebook user with the access token supplied", () => {
			Expect(gettingFacebookUser).calledWith(accessToken);
		});

		it("it should enquire to see if the facebook user already exists in the database", () => {
			Expect(checkingForUser).calledWith(facebookUser.email);
		});

		it("it should check the validaty of the authentication web token", () => {
				Expect(verifyingAuthToken).calledWith(user.mobileToken);
		})

		it("it should request the re authentication of the user found", () => {
			Expect(applyingWebTokenToUser).calledWith(user);
		});

		it("it should return the user with a new token", () => {
			return result.then((user) => {
				Expect(user).to.equal(authenticatedUser);
			});
		});

		const accessToken = "accessToken";

		let gettingFacebookUser,
			checkingForUser,
			applyingWebTokenToUser,
			verifyingAuthToken,
			facebookUser = {
				name:'facebook user',
				email:'facebook@user.com'
			},
			user = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				webToken:'token',
				mobileToken:'mobile token'
			},
			authenticatedUser = {
				name:'facebook user',
				email:'facebook@user.com',
				_id:"123",
				webToken:'new token',
				mobileToken:'new mobile token'
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
			applyingWebTokenToUser = sandbox.stub(AuthTokenService, 'applyAuthMobileToken').returnsPromise();
			applyingWebTokenToUser.resolves(authenticatedUser);
			result = AuthenticationService.authenticateFacebookUser(accessToken, true);

		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});



	
