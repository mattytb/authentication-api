import * as Chai from 'chai';
import Sinon from 'sinon';
import { createCompleteClaim } from '../../../lib/services/claimService';

const Expect = Chai.expect;

describe('Unit::Service claim service', () => {

    describe('When creating a complete claim', () => {

        it('it should return the complete claim', () => {
			return result.then((completeClaim) => {
                Expect(completeClaim.refreshToken).to.equal(claim._id);
                Expect(completeClaim.authenticationToken).to.equal(claim.token);
                Expect(completeClaim.name).to.equal(user.name);
                Expect(completeClaim.userId).to.equal(user._id);
                Expect(completeClaim.userImage).to.equal(user.image);
			});
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
                token:'token'
            }

            result = createCompleteClaim(claim, user);

        });
        
    });
});