import * as Chai from 'chai';
import Sinon from 'sinon';

const Expect = Chai.expect;

import * as ClaimClient from '../../../lib/clients/claimClient';
import * as Claim from '../../../lib/models/claim';
import mongoose from 'mongoose';

import * as newClaimProvider from '../../../lib/models/providers/newClaimProvider';
import * as ClaimUtils from '../../../lib/models/utils/claimUtils';

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

    describe('When successfully saving a web token to a claim', () => {

		it('it should request the claim by id', () => {
			Expect(gettingClaimById).calledWith(id);
		});

		it('it should return the claim with the token passed applied', () => {
			return result.then((savedClaim) => {
				Expect(savedClaim).to.equal(fetchedClaim);
				Expect(savedClaim.token).to.equal(webToken);
			});
		});

		const id = 123,
			webToken = 'webToken',
			fetchedClaim = {
                _id:123,
                claimant:'claimantId',
                clientId:'clientId',
                expires:null,
                save:Sinon.spy(),
                token:null
            }

		let gettingClaimById,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			gettingClaimById = sandbox.stub(mongoose.Model, 'findById').returnsPromise();
			gettingClaimById.resolves(fetchedClaim);
			result = ClaimClient.saveTokenToClaim(id, webToken);
		});

		afterEach(function() {
			sandbox.restore();
		});
    });
});