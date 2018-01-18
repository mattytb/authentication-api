import Sinon from 'sinon';
import * as Chai from 'chai';
const Expect = Chai.expect;
import { errorResponseBuilder, authorizedResponseBuilder } from '../../../../lib/middleware/responseBuilders/responseBuilders';
import { jsonError } from '../../../../lib/middleware/responseBuilders/jsonError';

describe('Unit::Middleware errorResponseBuilder', () => {

    const req = {},
        res = {};
    let next = Sinon.spy();

    let result;

	describe('when building an error response', () => {

        it('it should have the json error method set to the response', () => {
            Expect(res.jsonError).to.equal(jsonError)
        });

        it('it should call the next middleware', () =>{
            Expect(next).to.have.been.called;
        });

        beforeEach(() => {
            result = errorResponseBuilder(req, res, next);
        });
    });
    
});