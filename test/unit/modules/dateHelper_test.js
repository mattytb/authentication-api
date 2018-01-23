import * as Chai from 'chai';
import Sinon from 'sinon';
const Expect = Chai.expect;

import { isISODateLessThanDateTimeNow } from '../../../lib/modules/dateHelper';

describe('Unit::Module date helper', () => {
    let pastDate = new Date();
        pastDate.setMinutes(pastDate.getMinutes() - 5);

        let futureDate = new Date();
        futureDate.setMinutes(futureDate.getMinutes() + 5);

    describe('When an ISO date time is less than the date time now', () => {
        Expect(isISODateLessThanDateTimeNow(pastDate)).to.be.true;
    });
    describe('When an ISO date time is greaters than the date time now', () => {
        Expect(isISODateLessThanDateTimeNow(futureDate)).to.be.false;
    });
});