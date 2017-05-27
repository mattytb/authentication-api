import { applyAuthToken } from '../../../modules/applyAuthToken';
import * as UserRepository from '../../../clients/userClient';
import * as Token from '../../../clients/tokenClient';
import * as Chai from 'chai';
import Sinon from 'sinon';
import SinonChai from 'sinon-chai';

Chai.use(SinonChai);

const Expect = Chai.expect;

describe('Unit::Module applyAuthToken', () => {

	describe('When applying a token to a user it', () => {

		let token,
			user,
			savedUser,
			result,
			saveUser,
			getNewToken,
			userWithNullToken,
			sandbox = Sinon.sandbox.create();

			const newToken = 'newToken';

		beforeEach((done) => {

			user = {
				'name':'matt',
				'token':'orginalUsersToken',
				'_id' : 123
			};
			userWithNullToken = {
				'name':'matt',
				'token':null,
				'_id' : 123
			};
			savedUser = {
				'name':'matt',
				'token':newToken,
				'_id' : 123
			};

			getNewToken = sandbox.stub(Token, 'getToken').callsFake(() => { return newToken });
			saveUser = sandbox.stub(UserRepository, 'saveTokenToUser').returnsPromise();
			saveUser.resolves(savedUser);
			result = applyAuthToken(user);
			done();
		});

		afterEach(function() {
			sandbox.restore();
			result = null;
		});

		it('should set the original user token to null', () => {

			Expect(user.token).to.equal(null);
			
		});

		it('should get a new token for the user', () => {

			Expect(getNewToken).calledWith(userWithNullToken);
			
		});

		it('should save the new token to the user passing the user id and new token', () => {

			Expect(saveUser).calledWith(user._id, newToken);
			
		});

		it('should return the users newly applied authentication token', () => {
			return applyAuthToken(user).then((user) => {
				Expect(user.token).to.equal(newToken);
			});
		});

	});
});