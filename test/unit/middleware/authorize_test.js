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

    describe('when user has not provided an authorization token', () => {

        it('it should not call to verify the authorization token', () => {
            Expect(verifingAuthorizationToken).not.called;
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
            verifingAuthorizationToken;

        beforeEach(() => {
            verifingAuthorizationToken = sandbox.stub(TokenClient, 'verifyAuthorizationToken').returnsPromise();
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
            next;

        beforeEach(() => {
            verifingAuthorizationToken = sandbox.stub(TokenClient, 'verifyAuthorizationToken').returnsPromise();
            verifingAuthorizationToken.resolves(true);
            next = Sinon.spy();
            result = authorize(req, res, next);
        });

        afterEach(() => {
            sandbox.restore();
        });
        
    });
});