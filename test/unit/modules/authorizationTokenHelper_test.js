import * as Chai from 'chai';
import Sinon from 'sinon';
const Expect = Chai.expect;

import { stripOutBearerToJustAuthorizationToken } from '../../../lib/modules/authorizationTokenHelper';

describe('Unit::Module authorization token helper', () => {
    const authorizationTokenWithBearer = 'Bearer authorizationToken',
        justAuthorizationToken = 'authorizationToken';

    describe('When an ISO date time is less than the date time now', () => {
        Expect(stripOutBearerToJustAuthorizationToken(authorizationTokenWithBearer)).to.equal(justAuthorizationToken);
    });
});