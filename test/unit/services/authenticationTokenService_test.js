import * as Chai from 'chai';
import Sinon from 'sinon';
import * as TokenClient from '../../../lib/clients/tokenClient';
import * as ClaimClient from '../../../lib/clients/claimClient';
import * as AuthorizationTokenService from '../../../lib/services/authorizationTokenService';

const Expect = Chai.expect;

describe('Unit::Service authorization token service', () => {

	describe('When applying a authorization token to a claim', () => {

		it('it should get a authorization token for the claim', () => {
			Expect(gettingNewAuthorizationToken).calledWith({claimantId:providedClaim.claimant, clientId:providedClaim.clientId});
		});

		it('it should save the new token to the claim passing the claim id and new token', () => {
			Expect(savingNewAuthorizationTokenToClaim).calledWith(providedClaim._id, newAuthorizationToken);
		});

		it('it should return the claim with the newly applied authorization token', () => {
			return result.then((claim) => {
				Expect(claim).to.equal(freshClaim);
				Expect(claim.authorizationToken).to.equal(newAuthorizationToken);
			});
		});

		let providedClaim,
			result,
			savingNewAuthorizationTokenToClaim,
			freshClaim,
			gettingNewAuthorizationToken,
			sandbox = Sinon.sandbox.create();

			const newAuthorizationToken = 'newToken';

		beforeEach(() => {

			providedClaim = {
				_id:'321',
				claimant:'123',
				clientId:'clientid'
			},
			freshClaim = {
				_id:'321',
				clientId:'clientid',
				authorizationToken:newAuthorizationToken
			},

			gettingNewAuthorizationToken = sandbox.stub(TokenClient, 'getAuthorizationToken').withArgs({claimantId:providedClaim.claimant, clientId:providedClaim.clientId}).callsFake(() => { return newAuthorizationToken });
			savingNewAuthorizationTokenToClaim = sandbox.stub(ClaimClient, 'saveAuthorizationTokenToClaim').returnsPromise();
			savingNewAuthorizationTokenToClaim.resolves(freshClaim);
			result = AuthorizationTokenService.applyAuthorizationToken(providedClaim);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});
});