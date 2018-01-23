import Sinon from 'sinon';
import * as Chai from 'chai';
const Expect = Chai.expect;

import { jsonAuthorized } from '../../../../lib/middleware/responseBuilders/jsonAuthorized';

describe('Unit::Middleware authorizedResponseBuilder', () => {
  
    describe('when building an authorized response', () => {

        it('it should set the success property on the response to false', () =>{
            Expect(res.body.success).to.equal(true);
        });

        it('it should set the authorization token to the response headers', () =>{
            Expect(res.headers.Authorization).to.equal(res.locals.authorizationToken);
        });

        it('it should set the status code to 200', () => {
            Expect(res.statusValue).to.equal(200);
        });

        it('it should place the payload on the body', ()=> {
            Expect(res.body.payload).to.equal(payload);
        });


       let res = {
            json:(obj) => { res.body = obj },
            status:function(status) {
                res.statusValue = status;
                return this;
            },
            set:function(value) {
               const key = Object.keys(value)[0];
                res.headers[key] = value[key];
                return this;
            },
            locals : {
                authorizationToken : "Bearer authorizationToken"
            },
            headers:{
            }
        },
        payload = { payload:'payload'}

        let result;

        beforeEach(() => {
            result = jsonAuthorized(res, payload);
        });

    });

});