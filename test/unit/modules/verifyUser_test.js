import * as UserClient from '../../../lib/clients/userClient';
import * as TokenClient from '../../../lib/clients/tokenClient';
import { verifyUser } from '../../../lib/modules/verifyUser';
import Sinon from 'sinon';
import * as Chai from 'chai';

const Expect = Chai.expect;

describe('Unit::Module verifyUser', () => {

	describe('when successfully verifing a user via a web token', () => {

		it('it request to verify the token', () => {
			Expect(verifingToken).calledWith(fetchedUser.webToken);
		});

		it('it should request user by id', () => {
			Expect(gettingUserById).calledWith(userId);
		});

		it('it should confirm the user is verified', () => {
			return result.then((data) => {
				Expect(data).to.equal(true);
			});
		});

		const token = 'token',
			userId = 123;

		let verifingToken,
			gettingUserById,
			verifiedToken = true,
			fetchedUser = {
				name:'matt',
				email:'email',
				webToken:'token',
				password:'hash',
				_id:123,
				admin:true
			},
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			verifingToken = sandbox.stub(TokenClient, 'verifyToken').returnsPromise();
			verifingToken.resolves(verifiedToken);
			gettingUserById = sandbox.stub(UserClient, 'getUserById').returnsPromise();
			gettingUserById.resolves(fetchedUser);
			result = verifyUser(userId, token);
		});

		afterEach(function() {
			sandbox.restore();
		});
	});

	describe('when successfully verifing a user via a mobile token', () => {
		
		it('it request to verify the token', () => {
			Expect(verifingToken).calledWith(fetchedUser.mobileToken);
		});

		it('it should request user by id', () => {
			Expect(gettingUserById).calledWith(userId);
		});

		it('it should confirm the user is verified', () => {
			return result.then((data) => {
				Expect(data).to.equal(true);
			});
		});

		const token = 'token',
			userId = 123;

		let verifingToken,
			gettingUserById,
			verifiedToken = true,
			fetchedUser = {
				name:'matt',
				email:'email',
				webToken:'',
				mobileToken:'token',
				password:'hash',
				_id:123,
				admin:true
			},
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			verifingToken = sandbox.stub(TokenClient, 'verifyToken').returnsPromise();
			verifingToken.resolves(verifiedToken);
			gettingUserById = sandbox.stub(UserClient, 'getUserById').returnsPromise();
			gettingUserById.resolves(fetchedUser);
			result = verifyUser(userId, token);
		});

		afterEach(function() {
			sandbox.restore();
		});
	});
});