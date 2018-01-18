import * as Chai from 'chai';
import Sinon from 'sinon';
const Expect = Chai.expect;

import { isISODateLessThanDateTimeNow } from '../../../lib/modules/dateHelper';

describe('Unit::Module date helper', () => {
    describe('When an ISO date time is less than the date time now', () => {
        Expect(isISODateLessThanDateTimeNow('2011-10-05T14:48:00.000Z')).to.be.true;
    });
    describe('When an ISO date time is greaters than the date time now', () => {
        Expect(isISODateLessThanDateTimeNow('2121-10-05T14:48:00.000Z')).to.be.false;
    });
});