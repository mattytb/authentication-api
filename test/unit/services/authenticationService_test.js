import * as Chai from 'chai';
import Sinon from 'sinon';
import * as Token from '../../../lib/clients/tokenClient';
import * as UserClient from '../../../lib/clients/userClient';
import * as ClaimClient from '../../../lib/clients/claimClient';
import * as FacebookClient from '../../../lib/clients/facebookClient';
import * as AuthorizationTokenService from '../../../lib/services/authorizationTokenService';
import * as AuthorizationService from '../../../lib/services/authorizationService';
import * as ClaimService from '../../../lib/services/claimService';
import { saveThirdPartyUser } from '../../../lib/clients/userClient';

const Expect = Chai.expect;

describe('Unit::Service authorization service', () => {

	describe('When authorizing a new user', () => {

		it('it should attempt to get a user by email', () => {
			Expect(gettingUserByEmail).calledWith(email);
		});

		it('it should save a new user using name, email and password', () => {
			Expect(savingNewUser).calledWith(name, password, email);
		});

		it('it should create a new claim', () => {
			Expect(savingNewClaim).calledWith(clientId, savedUser._id);
		});

		it('it should authorize the claim', () => {
			Expect(applyingAuthorizationTokenToClaim).calledWith(claim);
		});

		it('it should create a complete claim', () => {
			Expect(providingCompleteClaim).calledWith(authorizedClaim, savedUser);
		});

		it('it should return the complete claim', () => {
			return result.then((claim) => {
				Expect(claim).to.equal(completeClaim);
			});
		});

		const name = 'Matt',
			email = 'matt@email.com',
			password = 'password',
			authorizedToken = 'token',
			clientId = 'clientId';

		let gettingUserByEmail,
			savingNewUser,
			invokingSavingOfClaim,
			savingNewClaim,
			applyingAuthorizationTokenToClaim,
			providingCompleteClaim,
			result,
			sandbox = Sinon.sandbox.create(),
			savedUser = {
				_id:'123',
				name:'Matt',
				email:'matt@email.com',
				password:'password'
			},
			claim = {
				_id:'321',
				claimant:'123',
				clientId:'clientid'
			},
			authorizedClaim = {
				_id:'321',
				claimant:'123',
				clientId:'clientid',
				authorizationToken:authorizedToken
			},
			completeClaim = {
				refreshToken:'claimid',
				name:'Matt',
				authorizationToken:'authtoken'
			}
			
		beforeEach(() => {

			gettingUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			gettingUserByEmail.rejects();
			savingNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
			savingNewUser.resolves(savedUser);
			savingNewClaim = sandbox.stub(ClaimClient, 'saveNewClaim').returnsPromise();
			savingNewClaim.resolves(claim);
			applyingAuthorizationTokenToClaim = sandbox.stub(AuthorizationTokenService, 'applyAuthorizationToken').returnsPromise();
			applyingAuthorizationTokenToClaim.resolves(authorizedClaim);
			providingCompleteClaim = sandbox.stub(ClaimService, 'provideCompleteClaim').callsFake(() => {return completeClaim});
			result = AuthorizationService.authorizeNewUser(name, password, email, clientId);

		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe('When authorizing a new user but a user is found', () => {

		it('it should attempt to get a user by email', () => {
			Expect(gettingUserByEmail).calledWith(email);
		});

		it('it should not attempt save a new user using name, email and password', () => {
			Expect(savingNewUser).not.calledWith(name, password, email);
		});

		it('it should not create a new claim', () => {
			Expect(savingNewClaim).not.calledWith(clientId, user._id);
		});

		it('it should not authorize the claim', () => {
			Expect(applyingAuthorizationTokenToClaim).not.calledWith(claim);
		});

		it('it should not create a complete claim', () => {
			Expect(providingCompleteClaim).not.calledWith(authorizedClaim, user);
		});

		it('it should reject with an error and status of 409', () => {
			return result.then((user) => {
			},
			(error) => {
				Expect(error.message).to.equal("A user already exists with this email");
				Expect(error.status).to.equal(409);
			});
		});

		const name = 'Matt',
			email = 'matt@email.com',
			password = 'password',
			authorizedToken = 'token',
			clientId = 'clientId';

		let gettingUserByEmail,
			savingNewUser,
			invokingSavingOfClaim,
			savingNewClaim,
			applyingAuthorizationTokenToClaim,
			providingCompleteClaim,
			result,
			sandbox = Sinon.sandbox.create(),
			user = {
				_id:'123',
				name:'Matt',
				email:'matt@email.com',
				password:'password'
			},
			authorizedClaim = {
				_id:'321'
			},
			claim = {
				_id:'321'
			}
			
		beforeEach(() => {
			gettingUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			gettingUserByEmail.resolves(user);
			savingNewUser = sandbox.stub(UserClient, 'saveNewUser').returnsPromise();
			savingNewClaim = sandbox.stub(ClaimClient, 'saveNewClaim').returnsPromise();
			applyingAuthorizationTokenToClaim = sandbox.stub(AuthorizationTokenService, 'applyAuthorizationToken').returnsPromise();
			providingCompleteClaim = sandbox.stub(ClaimService, 'provideCompleteClaim').callsFake();
			result = AuthorizationService.authorizeNewUser(name, password, email, clientId);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe('When re-authorizing a user', () => {

		it('it should get a user by email and password', () => {
			Expect(gettingUserByEmailAndPassword).calledWith(email, password);
		});

		it('it should delete any claims made from this user and the given clientId', () => {
			Expect(deletingClaim).calledWith(user._id, clientId);
		});

		it('it should create a new claim', () => {
			Expect(creatingNewClaim).calledWith(clientId, user._id)
		});

		it('it should apply a authorization token to the claim', () => {
			Expect(applyingAuthorizationTokenToClaim).calledWith(claim)
		});

		it('it should create a complete claim', () => {
			Expect(providingCompleteClaim).calledWith(authorizedClaim, user);
		});

		it('it should return the complete claim', () => {
			return result.then((claim) => {
				Expect(claim).to.equal(completeClaim);
			});
		});

		const name = 'Matt',
			email = 'matt@email.com',
			password = 'password',
			clientId = 'clientId',
			authorizedToken = 'token';

		let authorizingUser,
			gettingUserByEmailAndPassword,
			deletingClaim,
			creatingNewClaim,
			applyingAuthorizationTokenToClaim,
			providingCompleteClaim,
			result,
			sandbox = Sinon.sandbox.create(),
			user = {
				name:'Matt',
				email:'matt@email.com',
				password:'password',
				_id:"123"
			},
			claim = {
				_id:'321',
				claimant:'123',
				clientId:'clientid'
			},
			authorizedClaim = {
				_id:'321',
				claimant:'123',
				clientId:'clientid',
				authorizationToken:authorizedToken
			},
			completeClaim = {
				refreshToken:'claimid',
				name:'Matt',
				authorizationToken:'authtoken'
			}
			
		beforeEach(() => {

			gettingUserByEmailAndPassword = sandbox.stub(UserClient, 'getUserByEmailAndPassword').returnsPromise();
			gettingUserByEmailAndPassword.resolves(user);
			deletingClaim = sandbox.stub(ClaimClient, 'deleteClaimByClaimantAndClientId').returnsPromise();
			deletingClaim.resolves(true);
			creatingNewClaim = sandbox.stub(ClaimClient, 'saveNewClaim').returnsPromise();
			creatingNewClaim.resolves(claim);
			applyingAuthorizationTokenToClaim = sandbox.stub(AuthorizationTokenService, 'applyAuthorizationToken').returnsPromise();
			applyingAuthorizationTokenToClaim.resolves(authorizedClaim);
			providingCompleteClaim = sandbox.stub(ClaimService, 'provideCompleteClaim').callsFake(() => {return completeClaim});
			result = AuthorizationService.authorizeUser(email, password, clientId);

		});

		afterEach(() => {
			sandbox.restore();
		});

	});

	describe('When authorizing a new facebook user', () => {

		it('it should get the facebook user with the access token and client id', () =>{
			Expect(gettingFacebookUserByToken).calledWith(accessToken, clientId);
		});

		it('it should attempt to get the user from the users email', () => {
			Expect(gettingUserByEmail).calledWith(facebookUserDetails.email);
		});

		it('it should request a new user be saved', () => {
			Expect(savingThirdPartyUser).calledWith(facebookUserDetails.name, facebookUserDetails.email, facebookUserDetails.picture.data.url);
		});

		it('it should create a new claim', () => {
			Expect(creatingNewClaim).calledWith(clientId, user._id);
		});

		it('it should authorize the claim', () => {
			Expect(applyingAuthorizationToken).calledWith(claim);
		});

		it('it should create a complete claim', () => {
			Expect(providingCompleteClaim).calledWith(authorizedClaim, user);
		});

		it('it should return the complete claim', () => {
			return result.then((claim) => {
				Expect(claim).to.equal(completeClaim);
			});
		});

		const facebookUserDetails = {
			
			'name':'matt',
			'email':'matt@email.com',
			'picture':{ 
				data: {
					url:"image.src"
				}
			}
			
		},
		user = {
			'name':'matt',
			'email':'matt@email.com',
			'_id':'123'	
		},
		accessToken = 'accesstoken',
		authorizedToken = 'token',
		clientId = 'clientid',
		claim = {
			_id:'321',
			claimant:'123',
			clientId:'clientid'
		},
		authorizedClaim = {
			_id:'321',
			claimant:'123',
			clientId:'clientid',
			authorizationToken:authorizedToken
		},
		completeClaim = {
			refreshToken:'claimid',
			name:'Matt',
			authorizationToken:'authtoken'
		}

		let result,
		gettingFacebookUserByToken,
		gettingUserByEmail,
		creatingNewClaim,
		savingThirdPartyUser,
		applyingAuthorizationToken,
		providingCompleteClaim,
		sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			gettingFacebookUserByToken = sandbox.stub(FacebookClient, 'getFacebookUser').returnsPromise();
			gettingFacebookUserByToken.resolves(facebookUserDetails);
			gettingUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			gettingUserByEmail.rejects();
			savingThirdPartyUser = sandbox.stub(UserClient, 'saveThirdPartyUser').returnsPromise();
			savingThirdPartyUser.resolves(user);
			creatingNewClaim = sandbox.stub(ClaimClient, 'saveNewClaim').returnsPromise();
			creatingNewClaim.resolves(claim);
			applyingAuthorizationToken = sandbox.stub(AuthorizationTokenService, 'applyAuthorizationToken').returnsPromise();
			applyingAuthorizationToken.resolves(authorizedClaim);
			providingCompleteClaim = sandbox.stub(ClaimService, 'provideCompleteClaim').callsFake(() => {return completeClaim});
			result = AuthorizationService.authorizeFacebookUser(accessToken, clientId);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe('When re-authorizing a facebook user', () => {

		it('it should get the facebook user with the access token and client id', () =>{
			Expect(gettingFacebookUserByToken).calledWith(accessToken, clientId);
		});

		it('it should attempt to get the user from the users email', () => {
			Expect(gettingUserByEmail).calledWith(facebookUserDetails.email);
		});

		it('should delete old claim using client id and user id', ()=> {
			Expect(deletingClaim).calledWith(user._id, clientId);
		})

		it('it should create a new claim', () => {
			Expect(creatingNewClaim).calledWith(clientId, user._id);
		});

		it('it should authorize the claim', () => {
			Expect(applyingAuthorizationToken).calledWith(claim);
		});

		it('it should create a complete claim', () => {
			Expect(providingCompleteClaim).calledWith(authorizedClaim, user);
		});

		it('it should return the complete claim', () => {
			return result.then((claim) => {
				Expect(claim).to.equal(completeClaim);
			});
		});

		const facebookUserDetails = {
			
			'name':'matt',
			'email':'matt@email.com',
			'picture':{ 
				data: {
					url:"image.src"
				}
			}
			
		},
		user = {
			'name':'matt',
			'email':'matt@email.com',
			'_id':'123'	
		},
		accessToken = 'accesstoken',
		authorizedToken = 'token',
		clientId = 'clientid',
		claim = {
			_id:'321',
			claimant:'123',
			clientId:'clientid'
		},
		authorizedClaim = {
			_id:'321',
			claimant:'123',
			clientId:'clientid',
			authorizationToken:authorizedToken
		},
		completeClaim = {
			refreshToken:'claimid',
			name:'Matt',
			authorizationToken:'authtoken'
		}

		let result,
		gettingFacebookUserByToken,
		gettingUserByEmail,
		deletingClaim,
		creatingNewClaim,
		savingThirdPartyUser,
		applyingAuthorizationToken,
		providingCompleteClaim,
		sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			gettingFacebookUserByToken = sandbox.stub(FacebookClient, 'getFacebookUser').returnsPromise();
			gettingFacebookUserByToken.resolves(facebookUserDetails);
			gettingUserByEmail = sandbox.stub(UserClient, 'getUserByEmail').returnsPromise();
			gettingUserByEmail.resolves(user);
			deletingClaim = sandbox.stub(ClaimClient, 'deleteClaimByClaimantAndClientId').returnsPromise();
			deletingClaim.resolves(true);
			creatingNewClaim = sandbox.stub(ClaimClient, 'saveNewClaim').returnsPromise();
			creatingNewClaim.resolves(claim);
			applyingAuthorizationToken = sandbox.stub(AuthorizationTokenService, 'applyAuthorizationToken').returnsPromise();
			applyingAuthorizationToken.resolves(authorizedClaim);
			providingCompleteClaim = sandbox.stub(ClaimService, 'provideCompleteClaim').callsFake(() => {return completeClaim});
			result = AuthorizationService.authorizeFacebookUser(accessToken, clientId);
		});

		afterEach(() => {
			sandbox.restore();
		});

	});
});



	
