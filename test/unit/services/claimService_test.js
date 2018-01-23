import * as Chai from 'chai';
import Sinon from 'sinon';
import { provideCompleteClaim, getAuthorizationTokenWithValidRefreshToken } from '../../../lib/services/claimService';
import * as AuthorizationTokenService from '../../../lib/services/authorizationTokenService';
import * as DateHelper from '../../../lib/modules/dateHelper';
import * as ClaimClient from '../../../lib/clients/claimClient'; 

const Expect = Chai.expect;

describe('Unit::Service claim service', () => {

    describe('When creating a complete claim', () => {

        it('it should return the complete claim', () => {
			    Expect(result.refreshToken).to.equal(claim.refreshToken);
                Expect(result.authorizationToken).to.equal(claim.authorizationToken);
                Expect(result.name).to.equal(user.name);
                Expect(result.userId).to.equal(user._id);
                Expect(result.userImage).to.equal(user.image);
		});

        let user,
            claim,
            result;

        beforeEach(() => {
            user = {
                name:'Matt',
                _id:'123',
                image:'image'
            }
            claim = {
                _id:'321',
                authorizationToken:'token',
                refreshToken:'fds456fds'
            }

            result = provideCompleteClaim(claim, user);

        });
    });

    describe('When getting an expired authorization token on a claim, via a refresh token', () => {

        it('it should request a claim using the refresh token provided', () => {
            Expect(requestingAClaimWithRefreshToken).calledWith(refreshToken);
        });

        it('it should check that the claim has not expired', () => {
            Expect(comparingClaimDateToDateTimeNow).calledWith(claim.expires);
        });

        it('it should not call the authorization token service', () => {
            Expect(requestUpdateOfAuthorizationTokenOnClaim).not.calledWith(claim);
        });

        it('it should return a 401 error stating the authorization token was unauthorized', ()=>{
            return result.then(result => {
                
            }, (err)=> {
                Expect(err.status).to.equal(401);
                Expect(err.message).to.equal('Unauthorised');
            })
        });

        let refreshToken = 'fds456fds',
            claim = {
                _id:'321',
                authorizationToken:'token',
                refreshToken:'fds456fds',
                expires:"2018-01-21T11:18:54.673Z"
            }

        let result,
            requestingAClaimWithRefreshToken,
            comparingClaimDateToDateTimeNow,
            requestUpdateOfAuthorizationTokenOnClaim,
			sandbox = Sinon.sandbox.create();

        beforeEach(() => {
            requestingAClaimWithRefreshToken = sandbox.stub(ClaimClient, 'getClaimByRefreshToken').returnsPromise();
            requestingAClaimWithRefreshToken.resolves(claim);
            comparingClaimDateToDateTimeNow = sandbox.stub(DateHelper, 'isISODateLessThanDateTimeNow').callsFake(() => { return true});
            requestUpdateOfAuthorizationTokenOnClaim = sandbox.stub(AuthorizationTokenService, 'applyAuthorizationToken').returnsPromise();
            result = getAuthorizationTokenWithValidRefreshToken(refreshToken);
        });

        afterEach(() => {
            sandbox.restore();
        });

    });

    describe('When getting a valid authorization token on a claim, via a refresh token', () => {

        it('it should request a claim using the refresh token provided', () => {
            Expect(requestingAClaimWithRefreshToken).calledWith(refreshToken);
        });

        it('it should check that the claim has not expired', () => {
            Expect(comparingClaimDateToDateTimeNow).calledWith(claim.expires);
        });

        it('it should call the authorization token service to provide a new authorization token for the claim', () => {
            Expect(requestUpdateOfAuthorizationTokenOnClaim).calledWith(claim);
        });

        it('it should return a refresh token', ()=>{
            return result.then(authorizationToken => {
                Expect(authorizationToken).to.equal(authorizedClaim.authorizationToken);
            })
        });
        let expires = Date;
        expires.toISOString = function (params) {}
        const refreshToken = 'fds456fds',
            claim = {
                _id:'321',
                authorizationToken:'token',
                refreshToken:'fds456fds'
                
            },
            authorizedClaim = {
                _id:'321',
                authorizationToken:'newToken',
                refreshToken:'gdfgfd'
            }

        let result,
            requestingAClaimWithRefreshToken,
            comparingClaimDateToDateTimeNow,
            requestUpdateOfAuthorizationTokenOnClaim,
			sandbox = Sinon.sandbox.create();

        beforeEach(() => {
            requestingAClaimWithRefreshToken = sandbox.stub(ClaimClient, 'getClaimByRefreshToken').returnsPromise();
            requestingAClaimWithRefreshToken.resolves(claim);
            comparingClaimDateToDateTimeNow = sandbox.stub(DateHelper, 'isISODateLessThanDateTimeNow').callsFake(() => { return false});
            requestUpdateOfAuthorizationTokenOnClaim = sandbox.stub(AuthorizationTokenService, 'applyAuthorizationToken').returnsPromise();
            requestUpdateOfAuthorizationTokenOnClaim.resolves(authorizedClaim);
            result = getAuthorizationTokenWithValidRefreshToken(refreshToken);
        });

        afterEach(() => {
            sandbox.restore();
        });
    });
});