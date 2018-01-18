import Sinon from 'sinon';
import * as Chai from 'chai';
const Expect = Chai.expect;
import * as TokenClient from '../../../lib/clients/tokenClient';
import { authorize } from '../../../lib/middleware/authorize';
import * as ClaimService from '../../../lib/services/claimService';
import * as LoggingClient from '../../../lib/clients/errorLogClient';

let res = {
        json:(obj) => { res.body = obj },
        status:function(status) {
            res.statusValue = status;
            return this;
        },
        jsonError:(obj, result) => { 
            res.body = obj;
            res.statusValue = obj.status;
        },
		locals : {}

    },
    sandbox = Sinon.sandbox.create();

describe('Unit::Middleware authorize', () => {

    describe('when user has not provided either a authorization token or a refresh token', () => {

        it('it should not call to verify the authorization token', () => {
            Expect(verifingAuthorizationToken).not.called;
        });

        it('should not call to get authorization token with a refresh token', () => {
            Expect(requestingNewAuthorizationToken).not.called;
        });

        it('should not call the next piece of middleware', ()=> {
            Expect(next).not.called;
        });

        it('should have set the response message to the unauthorized message', ()=> {
            Expect(res.body.message).to.equal("Unauthorized");
        });

        it('should have set the error status to 401', ()=> {
            Expect(res.statusValue).to.equal(401);
        });

        const req = {
            body: {
            },
            query:{

            },
            headers:{

            }
        };
            
        let result,
            next,
            verifingAuthorizationToken,
            requestingNewAuthorizationToken;

        beforeEach(() => {
            verifingAuthorizationToken = sandbox.stub(TokenClient, 'verifyAuthorizationToken').returnsPromise();
            requestingNewAuthorizationToken = sandbox.stub(ClaimService, 'getAuthorizationTokenWithValidRefreshToken').returnsPromise();
            next = Sinon.spy();
            result = authorize(req, res, next);
        });

        afterEach(() => {
            sandbox.restore();
        })

       
    });
        
    describe('when authorization token is valid and no refresh token is present', () => {

        it('it should request the authorization token on the header is validated', () => {
            Expect(verifingAuthorizationToken).calledWith(authorizationToken);
        });

        it('should not call to get authorization token with a refresh token', () => {
            Expect(requestingNewAuthorizationToken).not.called;
        });

        it('it should have set the authorizationToken to the response locals', () => {
            Expect(res.locals.authorizationToken).to.equal(`Bearer ${authorizationToken}`);
        });

        it('it should call the next piece of middleware', () => {
            Expect(next).to.be.called;
        });

        const authorizationToken = 'authorizationToken', 
            req = {
                body: {
                },
                query:{

                },
                headers:{
                    authorization : `Bearer ${authorizationToken}`
                }
            };

        let verifingAuthorizationToken,
            result,
            requestingNewAuthorizationToken,
            next;

        beforeEach(() => {
            verifingAuthorizationToken = sandbox.stub(TokenClient, 'verifyAuthorizationToken').returnsPromise();
            verifingAuthorizationToken.resolves(true);
            requestingNewAuthorizationToken = sandbox.stub(ClaimService, 'getAuthorizationTokenWithValidRefreshToken').returnsPromise();
            next = Sinon.spy();
            result = authorize(req, res, next);
        });

        afterEach(() => {
            sandbox.restore();
        })

    });

    describe('when a valid refresh token is present', () => {

        it('it should not request the authorization token on the header is validated', () => {
            Expect(verifingAuthorizationToken).not.calledWith(authorizationToken);
        });

        it('should call to get authorization token with a refresh token', () => {
            Expect(requestingNewAuthorizationToken).calledWith(req.body.refreshToken);
        });

        it('it should have set the authorizationToken to the response locals', () => {
            Expect(res.locals.authorizationToken).to.equal(`Bearer ${newAuthorizationToken}`);
        });

        it('it should call the next piece of middleware', () => {
            Expect(next).to.be.called;
        });

        const authorizationToken = 'authorizationToken', 
            req = {
                body: {
                    refreshToken:'refreshToken'
                },
                query:{

                },
                headers:{
                    authorization : `Bearer ${authorizationToken}`
                },
            },
            newAuthorizationToken = 'newAuthorizationToken';

        let verifingAuthorizationToken,
            result,
            requestingNewAuthorizationToken,
            next;

        beforeEach(() => {
            verifingAuthorizationToken = sandbox.stub(TokenClient, 'verifyAuthorizationToken').returnsPromise();
            requestingNewAuthorizationToken = sandbox.stub(ClaimService, 'getAuthorizationTokenWithValidRefreshToken').returnsPromise();
            requestingNewAuthorizationToken.resolves(newAuthorizationToken);
            next = Sinon.spy();
            result = authorize(req, res, next);
        });

        afterEach(() => {
            sandbox.restore();
        })

    });
});