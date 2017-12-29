import * as Chai from 'chai';
import Sinon from 'sinon';
import * as Token from '../../../lib/clients/tokenClient';
import * as ClaimClient from '../../../lib/clients/claimClient';
import * as AuthTokenService from '../../../lib/services/authTokenService';

const Expect = Chai.expect;

describe('Unit::Service auth token service', () => {

	describe('When applying a token to a claim', () => {

		it('it should get a token for the claim', () => {
			Expect(gettingNewToken).calledWith({claimantId:claimWithoutToken.claimant, clientId:claimWithoutToken.clientId});
		});

		it('it should save the new token to the claim passing the claim id and new token', () => {
			Expect(savingTokenToClaim).calledWith(claimWithoutToken._id, newToken);
		});

		it('it should return the claim with the newly applied authentication token', () => {
			return result.then((claim) => {
				Expect(claim).to.equal(claimWithToken);
				Expect(claim.token).to.equal(newToken);
			});
		});

		let token,
			claimWithoutToken,
			result,
			savingTokenToClaim,
			claimWithToken,
			gettingNewToken,
			sandbox = Sinon.sandbox.create();

			const newToken = 'newToken';

		beforeEach(() => {

			claimWithoutToken = {
				_id:'321',
				claimant:'123',
				clientId:'clientid'
			},
			claimWithToken = {
				_id:'321',
				claimant:'123',
				clientId:'clientid',
				token:newToken
			},

			gettingNewToken = sandbox.stub(Token, 'getToken').withArgs({claimantId:claimWithoutToken.claimant, clientId:claimWithoutToken.clientId}).callsFake(() => { return newToken });
			savingTokenToClaim = sandbox.stub(ClaimClient, 'saveTokenToClaim').returnsPromise();
			savingTokenToClaim.resolves(claimWithToken);
			result = AuthTokenService.applyAuthToken(claimWithoutToken);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});

	
});