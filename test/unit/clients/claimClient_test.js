import * as Chai from 'chai';
import Sinon from 'sinon';

const Expect = Chai.expect;

import * as ClaimClient from '../../../lib/clients/claimClient';
import * as Claim from '../../../lib/models/claim';
import mongoose from 'mongoose';

import * as newClaimProvider from '../../../lib/models/providers/newClaimProvider';
import * as ClaimUtils from '../../../lib/models/utils/claimUtils';
import * as ErrorLogClient from '../../../lib/clients/errorLogClient';

describe('Unit::claimClient', () => {

    describe('When successfully saving a new claim', () => {

        it('it should request a new claim providing clientid userId and expires', () => {
            Expect(providingClaim).calledWith(clientId, userId, expires);
        });

        it('it should request the provided claim be saved', () => {
            Expect(savingClaim).calledWith(providedClaim);
        }); 

        it('it should return the saved user', () => {
            return result.then((data) => {
                Expect(data).to.equal(savedClaim);
            });
        });

        const clientId = 'clientId',
            userId = 'userId',
            expires = null,
            providedClaim = {
                claimant:userId,
                clientId:clientId,
                expires:expires
            },
            savedClaim = {
                claimant:userId,
                clientId:clientId,
                expires:expires
            };

        let providingClaim,
            savingClaim,
            result,
            sandbox = Sinon.sandbox.create();

        beforeEach(() => {
            providingClaim = sandbox.stub(newClaimProvider, 'provideNewClaim').callsFake(() => {return providedClaim});
            savingClaim = sandbox.stub(ClaimUtils, 'saveClaim').returnsPromise();
            savingClaim.resolves(savedClaim);
            result = ClaimClient.saveNewClaim(clientId, userId, expires);
        });

        afterEach(function() {
            sandbox.restore();
        });
    });

    describe('When successfully saving a authorization token to a claim', () => {

		it('it should request the claim by id', () => {
			Expect(gettingClaimById).calledWith(id);
		});

		it('it should return the claim with the authorization token passed applied', () => {
			return result.then((savedClaim) => {
				Expect(savedClaim).to.equal(fetchedClaim);
				Expect(savedClaim.authorizationToken).to.equal(authorizationToken);
			});
		});

		const id = 123,
            authorizationToken = 'token',
			fetchedClaim = {
                _id:123,
                claimant:'claimantId',
                clientId:'clientId',
                expires:null,
                save:Sinon.spy(),
                authorizationToken:null
            }

		let gettingClaimById,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			gettingClaimById = sandbox.stub(mongoose.Model, 'findById').returnsPromise();
			gettingClaimById.resolves(fetchedClaim);
			result = ClaimClient.saveAuthorizationTokenToClaim(id, authorizationToken);
		});

		afterEach(function() {
			sandbox.restore();
		});
    });

    describe('when deleteing a claim found for user and client id', () => {

        it('it should call to delete all claims by claimant and client id', ()=> {
            Expect(deletingOldClaimForClaimantAndClient).calledWith({claimant:claimantId, clientId:clientId});
        });

        it('it should return true to comfirm all found have been deleted', () => {
            return result.then((data) => {
                Expect(data).to.equal(true);
            });
        });

        const claimantId = 'claimantId',
            clientId = 'clientId';

            let sandbox = Sinon.sandbox.create(),
                deletingOldClaimForClaimantAndClient,
                result;

        beforeEach(() => {
            deletingOldClaimForClaimantAndClient = sandbox.stub(mongoose.Model, 'findOneAndRemove').returnsPromise();
            deletingOldClaimForClaimantAndClient.resolves(true);
            result = ClaimClient.deleteClaimByClaimantAndClientId(claimantId, clientId);
        });

        afterEach(function() {
            sandbox.restore();
        });
    });

    describe('when getting a claim with a refresh token', () => {

        it('it should request the claim using the refresh token', () => {
            Expect(requestingClaim).calledWith({refreshToken:refreshToken});
        });

        it('it should return a claim', () => {
            return result.then((data) => {
                Expect(data).to.equal(claim);
            });
        });

        const refreshToken = 'refreshToken',
            claim = {
                _id:'123',
                claimant:'claimantId',
                authorizationToken:'authToken',
                refreshToken:'refreshToken',
                clientId:'clientId'
            }

        let sandbox = Sinon.sandbox.create(),
            requestingClaim,
            result;

        beforeEach(() => {
            requestingClaim = sandbox.stub(mongoose.Model, 'findOne').returnsPromise();
            requestingClaim.resolves(claim);
            result = ClaimClient.getClaimByRefreshToken(refreshToken);
        });

        afterEach(function() {
            sandbox.restore();
        });

    })
});